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

};