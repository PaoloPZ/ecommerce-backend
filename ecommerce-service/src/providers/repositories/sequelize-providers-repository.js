const { DataTypes } = require('sequelize');

class SequelizeProvidersRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    let tableName = test ? 'Providers_test' : 'Providers';

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

    this.providerModel = sequelizeClient.sequelize.define('Provider', columns, options);

    sequelizeClient.addModel(this.providerModel, 'Provider');
  }

  async getProviders() {
    const providers = await this.providerModel.findAll({
      raw: true,
    });

    return providers;
  }

  async getProvider(id) {
    return await this.providerModel.findByPk(id);
  }

  async createProvider(provider) {
    const data = await this.providerModel.create(provider);
    return data.id;
  }

  async updateProvider(provider) {
    const options = {
      where: {
        id: provider.id,
      },
    };

    await this.providerModel.update(provider, options);
  }

  async deleteProvider(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.providerModel.destroy(options);
  }

  async deleteAllProviders() {
    if(this.test) {
      const options = {
        truncate: true,
      };

      await this.providerModel.destroy(options);
    }
  }

  async dropProvidersTable() {
    if(this.test) {
      await this.providerModel.drop();
    }
  }

  async seed() {
    if(await this.providerModel.findAll().length > 0) {
      return;
    }

    await this.providerModel.bulkCreate([
      {
        name: 'PULLMAN BUS',
        email: 'p.bus@gmail.com',
        phone: '221234567',
      },
      {
        name: 'TUR BUS',
        email: 't.bus@gmail.com',
        phone: '221234568',
      },
    ]);
  }
}

module.exports = SequelizeProvidersRepository;
