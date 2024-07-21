import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository.js';
import { CustomError } from '../utils/CustomError.js';
import { TYPES_OF_ERROR } from '../utils/errorTypes.js';
import { UserDAO } from '../dao/UserDAO.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/config.js';

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

            // trato de comparar la contraseña guardada con la nueva
            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                throw new CustomError('New password cannot be the same as the old password', TYPES_OF_ERROR.INVALID_ARGUMENTS);
            }

            // acá logré hacer hasheo de la password
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
    }

};

export { UserController };