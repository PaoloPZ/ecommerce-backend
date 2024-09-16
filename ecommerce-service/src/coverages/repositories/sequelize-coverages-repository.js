const { DataTypes } = require('sequelize');

class SequelizeCoveragesRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    let tableName = test ? 'Coverages_test' : 'Coverages';

    const columns = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      startHour: DataTypes.STRING,
      travelDuration: DataTypes.INTEGER,
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.coverageModel = sequelizeClient.sequelize.define(
      'Coverage',
      columns,
      options
    );

    this.coverageModel.belongsTo(sequelizeClient.getModel('Place'), {
      foreignKey: 'originId',
      as: 'origin',
    });

    this.coverageModel.belongsTo(sequelizeClient.getModel('Place'), {
      foreignKey: 'destinationId',
      as: 'destination',
    });

    this.coverageModel.belongsTo(sequelizeClient.getModel('Provider'), {
      foreignKey: 'providerId',
      as: 'provider',
    });

    this.coverageModel.belongsTo(sequelizeClient.getModel('Vehicle'), {
      foreignKey: 'vehicleId',
      as: 'vehicle',
    });

    sequelizeClient.addModel(this.coverageModel, 'Coverage');
  }

  async getCoverages(include = []) {
    const coverages = await this.coverageModel.findAll({
      include: include,
    });

    return coverages;
  }

  async getCoverage(id, include = []) {
    return await this.coverageModel.findByPk(id, {
      include: include,
    });
  }

  async createCoverage(coverage) {
    const data = await this.coverageModel.create(coverage);
    return data.id;
  }

  async updateCoverage(coverage) {
    const options = {
      where: {
        id: coverage.id,
      },
    };

    await this.coverageModel.update(coverage, options);
  }

  async deleteCoverage(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.coverageModel.destroy(options);
  }

  async getCoveragesByOriginAndDestination(originId, destinationId, include = []) {
    return await this.coverageModel.findAll({
      include: include,
      where: {
        originId: originId,
        destinationId: destinationId,
      },
    });
  }

  async getCoveragesByProviderId(providerId, include = []) {
    return await this.coverageModel.findAll({
      include: include,
      where: {
        providerId: providerId,
      },
    });
  }

  async deleteAllCoverages() {
    if(this.test) {
      const options = {
        truncate: true,
      };

      await this.coverageModel.destroy(options);
    }
  }

  async dropCoveragesTable() {
    if (this.test) {
      await this.coverageModel.drop();
    }
  }

  async seed() {
    if((await this.coverageModel.findAll()).length > 0) {
      return;
    }

    await this.coverageModel.bulkCreate([
      {
        startHour: '08:00',
        travelDuration: 2,
        originId: 1,
        destinationId: 2,
        providerId: 1,
        vehicleId: 1,
      },
      {
        startHour: '11:00',
        travelDuration: 2,
        originId: 2,
        destinationId: 1,
        providerId: 1,
        vehicleId: 1,
      },
      {
        startHour: '10:00',
        travelDuration: 2,
        originId: 1,
        destinationId: 2,
        providerId: 1,
        vehicleId: 2,
      },
      {
        startHour: '13:00',
        travelDuration: 2,
        originId: 2,
        destinationId: 1,
        providerId: 1,
        vehicleId: 2,
      },
      {
        startHour: '06:00',
        travelDuration: 4,
        originId: 2,
        destinationId: 3,
        providerId: 2,
        vehicleId: 3,
      },
      {
        startHour: '11:00',
        travelDuration: 4,
        originId: 3,
        destinationId: 2,
        providerId: 2,
        vehicleId: 3,
      }
    ]);
  }
}

module.exports = SequelizeCoveragesRepository;
