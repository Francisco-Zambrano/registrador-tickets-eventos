import { Router } from "express";
import { UserController } from "../controllers/userController.js";

const router = Router();

router.post('/premium/:uid', UserController.changeUserRole);

export { router };