import { TicketRepository } from '../repositories/TicketRepository.js';
import { TicketDTO } from '../dto/TicketDTO.js';
import { CustomError } from '../utils/CustomError.js';
import { TYPES_OF_ERROR } from '../utils/errorTypes.js';

const ticketRepository = new TicketRepository();

export class TicketsController {

    static createTicket = async (req, res, next) => {
        try {
            const { amount, purchaser } = req.body;
            if (!amount || !purchaser) {
                throw CustomError.createError(
                    "InvalidArgumentsError",
                    new Error('Missing required fields'),
                    'Amount and purchaser are required to create a ticket',
                    TYPES_OF_ERROR.INVALID_ARGUMENTS
                );
            }
            const ticketData = { amount, purchaser };
            const ticket = await ticketRepository.create(ticketData);
            res.status(201).json(new TicketDTO(ticket));
        } catch (error) {
            next(error);
        }
    };

    static getTicketById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const ticket = await ticketRepository.getById(id);
            if (!ticket) {
                throw CustomError.createError(
                    "NotFoundError",
                    new Error(`Ticket with id ${id} not found`),
                    'Ticket not found',
                    TYPES_OF_ERROR.NOT_FOUND
                );
            }
            res.json(new TicketDTO(ticket));
        } catch (error) {
            next(error);
        }
    };

    static getAllTickets = async (req, res, next) => {
        try {
            const tickets = await ticketRepository.getAll();
            res.json(tickets.map(ticket => new TicketDTO(ticket)));
        } catch (error) {
            next(error);
        }
    };
    
};