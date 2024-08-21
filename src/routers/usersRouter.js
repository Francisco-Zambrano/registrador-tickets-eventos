import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { upload } from "../middleware/uploadFiles.js";

const router = Router();

router.post('/premium/:uid', UserController.changeUserRole);

router.post('/:uid/documents', upload, UserController.uploadDocuments);

router.get('/', (req, res) => UserController.getAllUsers(req,res));

export { router };