const User = require('../entities/user');
const appRoot = require('app-root-path');
const NotFoundException = require(appRoot + '/src/frameworks/http/exceptions/not-found-exception');

class ManageUsersUsecase {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async getUsers() {
    return await this.usersRepository.getUsers();
  }

  async getUser(id) {
    const user = await this.usersRepository.getUser(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async createUser(data) {
    const user = new User(undefined, data.name, data.email, data.phone);
    const id = await this.usersRepository.createUser(user);
    user.id = id;

    return user;
  }

  async updateUser(id, data) {
    await this.getUser(id);
    const user = new User(id, data.name, data.email, data.phone);
    await this.usersRepository.updateUser(user);

    return user;
  }

  async deleteUser(id) {
    await this.getUser(id);
    await this.usersRepository.deleteUser(id);
  }
}

module.exports = ManageUsersUsecase;
