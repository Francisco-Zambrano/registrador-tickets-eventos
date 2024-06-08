import dotenv from "dotenv"
import { Command, Option } from "commander";


let program = new Command()

program.addOption(new Option("-m, --mode <modo>", "script execution mode").choices(["dev", "prod"]).default("dev"))

program.parse()
const arg = program.opts()

const mode = arg.mode

dotenv.config(
    {
        path: mode === "prod" ? "./src/.env.prduction" : "./src/.env.development",
        override: true
    }
);

export const config = {

    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    SECRET: process.env.SECRET,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CALLBACK_URL: process.env.CALLBACK_URL
    
};