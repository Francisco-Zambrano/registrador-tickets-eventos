import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createFolder = (folderPath) => {

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, {recursive: true})
    }
};

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        const fileType = file.fieldname;

        let folderPath;
        switch (fileType) {

            case 'profile':
                folderPath = path.join(__dirname, '../uploads/profiles');
                break;

            case 'product':
                folderPath = path.join(__dirname, '../uploads/products');
                break;

            case 'document':
                folderPath = path.join(__dirname, '../uploads/documents');
                break;
            
        }

        createFolder(folderPath);
        cb(null, folderPath);

    },

    filename: (req, file, cb) => {
        const uploadDate = Date.now()
        cb(null, `${file.fieldname}${uploadDate}${path.extname(file.originalname)}`)
    }

});


export const upload = multer({
    storage: storage,
}).any(); 