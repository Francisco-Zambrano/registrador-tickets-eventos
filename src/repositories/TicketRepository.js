import { ticketsModel } from "../dao/models/ticketsModel.js";


export class TicketRepository {

    async create(ticketData) {
        return await ticketsModel.create(ticketData);
    };

    async getById(id) {
        return await ticketsModel.findById(id);
    };

    async getAll() {
        return await ticketsModel.find();
    };
    
};