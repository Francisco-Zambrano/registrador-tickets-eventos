import { TYPES_OF_ERROR } from "./errorTypes.js"

export class CustomError {

    static createError (name="Error", cause, message, code = TYPES_OF_ERROR.INTERNAL_SERVER_ERROR) {

        const error = new Error (message, {cause:cause})
        error.name = name
        error.code = code

        throw error
    };

};