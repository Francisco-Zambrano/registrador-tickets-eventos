import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt"
import { config } from "./config/config.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

export default __dirname;

const SECRET = config.SECRET
export const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, passwordHash) => bcrypt.compareSync(password, passwordHash);