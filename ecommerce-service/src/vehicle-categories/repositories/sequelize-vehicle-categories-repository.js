const { DataTypes } = require('sequelize');
const { Op } = require('sequelize');

class SequelizeVehicleCategoriesRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    let tableName = test ? 'VehicleCategories_test' : 'VehicleCategories';

    const columns = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      numberOfPassengers: DataTypes.INTEGER,
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.vehicleCategoryModel = sequelizeClient.sequelize.define(
      'VehicleCategory',
      columns,
      options
    );

    this.vehicleCategoryModel.belongsTo(sequelizeClient.getModel('Vehicle'), {
      foreignKey: 'vehicleId',
      as: 'vehicle',
    });

    this.vehicleCategoryModel.belongsTo(sequelizeClient.getModel('Category'), {
      foreignKey: 'categoryId',
      as: 'category',
    });

    sequelizeClient.addModel(this.vehicleCategoryModel, 'VehicleCategory');
  }

  async getVehicleCategories(include = []) {
    return await this.vehicleCategoryModel.findAll({
      include: include,
    });
  }

  async getVehicleCategory(id, include = []) {
    return await this.vehicleCategoryModel.findByPk(id, {
      include: include,
    });
  }

  async createVehicleCategory(vehicleCategory) {
    const data = await this.vehicleCategoryModel.create(vehicleCategory);
    return data.id;
  }

  async updateVehicleCategory(vehicleCategory) {
    const options = {
      where: {
        id: vehicleCategory.id,
      },
    };

    await this.vehicleCategoryModel.update(vehicleCategory, options);
  }

  async deleteVehicleCategory(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.vehicleCategoryModel.destroy(options);
  }

  async getVehicleCategoriesByVehicleId(vehicleId, include = []) {
    return await this.vehicleCategoryModel.findAll({
      include: include,
      where: {
        vehicleId: vehicleId,
      },
    });
  }

  async getVehicleCategoriesByVehiclesIds(vehiclesIds, include = []) {
    return await this.vehicleCategoryModel.findAll({
      include: include,
      where: {
        vehicleId: {
          [Op.in]: vehiclesIds,
        },
      },
    });
  }

  async deleteAllVehicleCategories() {
    if(this.test){
      const options = {
        truncate: true,
      };

      await this.vehicleCategoryModel.destroy(options);
    }
  }

  async dropVehicleCategoriesTable() {
    if(this.test){
      await this.vehicleCategoryModel.drop();
    }
  }

  async seed() {
    if((await this.vehicleCategoryModel.findAll()).length > 0) {
      return;
    }

    await this.vehicleCategoryModel.bulkCreate([
      {
        numberOfPassengers: 32,
        vehicleId: 1,
        categoryId: 1,
      },
      {
        numberOfPassengers: 8,
        vehicleId: 1,
        categoryId: 2,
      },
      {
        numberOfPassengers: 32,
        vehicleId: 2,
        categoryId: 1,
      },
      {
        numberOfPassengers: 8,
        vehicleId: 2,
        categoryId: 2,
      },
      {
        numberOfPassengers: 30,
        vehicleId: 3,
        categoryId: 1,
      }
    ]);
  }
}

module.exports = SequelizeVehicleCategoriesRepository;
