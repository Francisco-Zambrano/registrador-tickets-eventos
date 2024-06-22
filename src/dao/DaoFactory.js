import { CartDAO } from './cartDAO.js';
import { ProductDAO } from './productDAO.js';
import { UserDAO } from './userDAO.js';


export class DaoFactory {

    static getDao(type) {

        switch(type) {
        case 'mongo':
            return {

                cartDao: new CartDAO(),
                productDao: new ProductDAO(),
                userDao: new UserDAO()

            };
        default:
            throw new Error('Invalid DAO type');
        }
    };

};