import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import crypto from "crypto"
import bcrypt from "bcrypt"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

export default __dirname;

const SECRET = "adminCod3r123"
export const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, passwordHash) => bcrypt.compareSync(password, passwordHash);