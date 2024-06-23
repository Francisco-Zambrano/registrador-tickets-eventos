import { TicketRepository } from '../repositories/TicketRepository.js';
import { TicketDTO } from '../dto/TicketDTO.js';

const ticketRepository = new TicketRepository();

export class TicketsController {

    static createTicket = async (req, res) => {

        try {
            const { amount, purchaser } = req.body;
            const ticketData = {
                amount,
                purchaser
            };
            const ticket = await ticketRepository.create(ticketData);
            res.status(201).json(new TicketDTO(ticket));
        } catch (error) {
            console.error('Error creating ticket:', error);
            res.status(500).json({ msg: 'Internal server error' });
        }

    };

    static getTicketById = async (req, res) => {

        try {
            const { id } = req.params;
            const ticket = await ticketRepository.getById(id);
            if (!ticket) {
                return res.status(404).json({ msg: 'Ticket not found' });
            }
            res.json(new TicketDTO(ticket));
        } catch (error) {
            console.error('Error getting ticket:', error);
            res.status(500).json({ msg: 'Internal server error' });
        }

    };

    static getAllTickets = async (req, res) => {

        try {
            const tickets = await ticketRepository.getAll();
            res.json(tickets.map(ticket => new TicketDTO(ticket)));
        } catch (error) {
            console.error('Error getting tickets:', error);
            res.status(500).json({ msg: 'Internal server error' });
        }
        
    };

};
