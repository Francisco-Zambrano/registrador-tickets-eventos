export class UserRepository {
    
    constructor(dao) {
      this.dao = dao;
    }
    async create(user) {
      return await this.dao.create(user);
    }
    async getBy(query) {
      return await this.dao.getBy(query);
    }
    async update(id, user) {
      return await this.dao.update(id, user);
    }
    async delete(id) {
      return await this.dao.delete(id);
    }

    async findById(id) {
      return await this.dao.findById(id);
    }

    async getAllUsers() {
      return await this.dao.getAllUsers();
    }

};