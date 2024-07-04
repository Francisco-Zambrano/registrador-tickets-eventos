import { TYPES_OF_ERROR } from '../utils/errorTypes.js';

export const errorHandler = (error, req, res, next) => {
    console.log(`${error.cause ? error.cause : error.message}`);

    switch (error.code) {
        case TYPES_OF_ERROR.AUTHENTICATION:
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: `incorrect credentials` });

        case TYPES_OF_ERROR.AUTHORIZATION:
            res.setHeader('Content-Type', 'application/json');
            return res.status(403).json({ error: `incorrect credentials` });

        case TYPES_OF_ERROR.DATA_TYPE:
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `${error.message}` });

        case TYPES_OF_ERROR.INVALID_ARGUMENTS:
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: `${error.message}` });

        case TYPES_OF_ERROR.NOT_FOUND:
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ error: `Not Found` });

        case TYPES_OF_ERROR.INTERNAL_SERVER_ERROR:
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Internal Server Error. Please contact the administrator` });

        default:
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Contact the Administrator` });
    }
};