import { Router } from "express";
import { TicketsController } from "../controllers/ticketsController.js";
import { auth } from '../middleware/auth.js';
import { isAdmin, isUser } from "../middleware/roleAuth.js";


const router = Router();

router.post('/', auth, isUser, TicketsController.createTicket);
router.get('/:id', auth, isAdmin, TicketsController.getTicketById);
router.get('/', auth, isAdmin, TicketsController.getAllTickets);

export {router};