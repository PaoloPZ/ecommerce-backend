const { DataTypes } = require('sequelize');

class SequelizeVehiclesRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    let tableName = test ? 'Vehicles_test' : 'Vehicles';

    const columns = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: DataTypes.STRING,
      capacity: DataTypes.INTEGER,
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.vehicleModel = sequelizeClient.sequelize.define(
      'Vehicle',
      columns,
      options
    );

    this.vehicleModel.belongsTo(sequelizeClient.getModel('Provider'), {
      foreignKey: 'providerId',
      as: 'provider',
    });

    sequelizeClient.addModel(this.vehicleModel, 'Vehicle');
  }

  async getVehicles(include = []) {
    const vehicles = await this.vehicleModel.findAll({
      include: include,
    });

    return vehicles;
  }

  async getVehicle(id, include = []) {
    return await this.vehicleModel.findByPk(id, {
      include: include,
    });
  }

  async createVehicle(vehicle) {
    const data = await this.vehicleModel.create(vehicle);
    return data.id;
  }

  async updateVehicle(vehicle) {
    const options = {
      where: {
        id: vehicle.id,
      },
    };

    await this.vehicleModel.update(vehicle, options);
  }

  async deleteVehicle(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.vehicleModel.destroy(options);
  }

  async deleteAllVehicles() {
    if (this.test) {
      const options = {
        truncate: true,
      };

      await this.vehicleModel.destroy(options);
    }
  }

  async dropVehiclesTable() {
    if (this.test) {
      await this.vehicleModel.drop();
    }
  }

  async seed() {
    if ((await this.vehicleModel.findAll()).length > 0) {
      return;
    }

    await this.vehicleModel.bulkCreate([
      {
        name: 'Bus 1.1',
        capacity: 40,
        providerId: 1,
      },
      {
        name: 'Bus 1.2',
        capacity: 40,
        providerId: 1,
      },
      {
        name: 'Bus 2.1',
        capacity: 30,
        providerId: 2,
      },
    ]);
  }
}

module.exports = SequelizeVehiclesRepository;
