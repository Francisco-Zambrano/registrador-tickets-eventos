import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository.js';
import { CustomError } from '../utils/CustomError.js';
import { TYPES_OF_ERROR } from '../utils/errorTypes.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/config.js';
import { UserDAO } from '../dao/userDAO.js';


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

            const newRole = user.role === 'user' ? 'premium' : 'user';
            await userRepository.update(user._id, { role: newRole });

            res.json({ msg: `User role updated to ${newRole}`, user });
        } catch (error) {
            next(error);
        }
    };

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

};

export { UserController };