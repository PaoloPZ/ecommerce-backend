const { DataTypes } = require('sequelize');

class SequelizeUsersRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    let tableName = test ? 'Users_test' : 'Users';

    const columns = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.userModel = sequelizeClient.sequelize.define('User', columns, options);

    sequelizeClient.addModel(this.userModel, 'User');
  }

  async getUsers(include = []) {
    const users = await this.userModel.findAll({
      include: include,
    });

    return users;
  }

  async getUser(id, include = []) {
    return await this.userModel.findByPk(id, {
      include: include,
    });
  }

  async createUser(user) {
    const data = await this.userModel.create(user);
    return data.id;
  }

  async updateUser(user) {
    const options = {
      where: {
        id: user.id,
      },
    };

    await this.userModel.update(user, options);
  }

  async deleteUser(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.userModel.destroy(options);
  }

  async deleteAllUsers() {
    if (this.test) {
      const options = {
        truncate: true,
      };

      await this.userModel.destroy(options);
    }
  }

  async dropUsersTable() {
    if (this.test) {
      await this.userModel.drop();
    }
  }

  async seed() {
    if ((await this.userModel.findAll()).length > 0) {
      return;
    }

    await this.userModel.bulkCreate([
      {
        name: 'Alex Rodriguez',
        email: 'a.rod@gmail.com',
        phone: '123456789',
      },
      {
        name: 'Jose Ramirez',
        email: 'j.ram@gmail.com',
        phone: '987654321',
      },
    ]);
  }
}

module.exports = SequelizeUsersRepository;
