import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository.js';
import { CustomError } from '../utils/CustomError.js';
import { TYPES_OF_ERROR } from '../utils/errorTypes.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/config.js';
import { UserDAO } from '../dao/userDAO.js';
import { UserDTO } from '../dto/UserDTO.js';


const SECRET_KEY = config.SECRET;
const userDao = new UserDAO();
const userRepository = new UserRepository(userDao);

class UserController {

    static async resetPassword(req, res, next) {
        const { newPassword } = req.body;
        const { token } = req.query;

        try {
            if (!token) {
                throw new CustomError('Token is missing', TYPES_OF_ERROR.INVALID_ARGUMENTS);
            }

            const decoded = jwt.verify(token, SECRET_KEY);
            const user = await userRepository.getBy({ _id: decoded.userId });

            if (!user) {
                throw new CustomError('User not found', TYPES_OF_ERROR.NOT_FOUND);
            }

            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                throw new CustomError('New password cannot be the same as the old password', TYPES_OF_ERROR.INVALID_ARGUMENTS);
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await userRepository.update(user._id, { password: hashedPassword });

            res.clearCookie('resetToken');
            res.redirect('/login');
        } catch (error) {
            logger.error(`Error resetting password: ${error.message}`);
            if (error.name === 'TokenExpiredError') {
                res.redirect('/reset-password-expired');
            } else {
                next(error);
            }
        }
    };


    static async changeUserRole(req, res, next) {
        const { uid } = req.params;

        try {

            const user = await userRepository.findById(uid);
            if (!user) {
                throw new CustomError('User not found', TYPES_OF_ERROR.NOT_FOUND);
            }

            if (user.role !== 'user') {
                return res.json({ msg: 'The user already has the premium role' });
            }

            const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            
            const documentTypes = {
                Identificación: 0,
                'Comprobante de domicilio': 0,
                'Comprobante de estado de cuenta': 0
            };

            user.documents.forEach(doc => {

                const fileName = doc.name.toLowerCase();
                
                if (fileName.includes('identificación') || fileName.includes('id')) {
                    documentTypes.Identificación++;
                } else if (fileName.includes('domicilio')) {
                    documentTypes['Comprobante de domicilio']++;
                } else if (fileName.includes('cuenta') || fileName.includes('estado de cuenta')) {
                    documentTypes['Comprobante de estado de cuenta']++;
                }

            });

            if (Object.values(documentTypes).every(count => count > 0)) {

                const newRole = 'premium';
                await userRepository.update(user._id, { role: newRole });

                return res.json({ msg: `User role updated to ${newRole}`, user });

            } else {

                return res.status(400).json({
                    msg: 'Some documents are missing, Please check file names'
                });

            }

        } catch (error) {
            console.error(error);
            next(error);
        }
    }


    static async uploadDocuments(req, res, next) {

        const { uid } = req.params;
        const files = req.files;

        try {

            const user = await userRepository.findById(uid);
            if (!user) {
                throw new CustomError('User not found', TYPES_OF_ERROR.NOT_FOUND)
            }

            if (!files || files.length === 0) {
                return res.status(400).json({ error: "No files were uploaded" });
            }

            const documents = files.map(file => ({
                name: file.originalname,
                reference: file.path,
            }));

            user.documents = [...user.documents, ...documents];
            await userRepository.update(uid, {documents: user.documents})

            res.json({message: 'Documents uploades successfylly', documents})

        } catch(error){
            next(error);
        }

    }

    static async getAllUsers(req, res) {

        try {

            const users = await userRepository.getAllUsers();
            const usersDTO = users.map(user => {
                return {
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    role: user.role
                }
            });

            res.status(200).json(usersDTO)

        } catch (error) {
            res.status(500).json({error: 'Error getting users'})
        }

    }

};

export { UserController };