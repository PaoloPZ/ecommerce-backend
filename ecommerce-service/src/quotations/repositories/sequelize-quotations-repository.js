const { DataTypes } = require('sequelize');
const { Op } = require('sequelize');

class SequelizeQuotationsRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    let tableName = test ? 'Quotations_test' : 'Quotations';

    const columns = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      travelDate: DataTypes.DATE,
      numberOfPassengers: DataTypes.INTEGER,
      status: DataTypes.ENUM('CREADO', 'RESERVA', 'RESERVA_CANCELADA'),
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.quotationModel = sequelizeClient.sequelize.define(
      'Quotation',
      columns,
      options
    );

    this.quotationModel.belongsTo(sequelizeClient.getModel('User'), {
      foreignKey: 'userId',
      as: 'user',
    });

    this.quotationModel.belongsTo(sequelizeClient.getModel('Place'), {
      foreignKey: 'originId',
      as: 'origin',
    });

    this.quotationModel.belongsTo(sequelizeClient.getModel('Place'), {
      foreignKey: 'destinationId',
      as: 'destination',
    });


    this.quotationModel.belongsTo(sequelizeClient.getModel('Coverage'), {
      foreignKey: 'coverageId',
      as: 'coverage',
    });

    this.quotationModel.belongsTo(sequelizeClient.getModel('Price'), {
      foreignKey: 'priceId',
      as: 'price',
    });

    sequelizeClient.addModel(this.quotationModel, 'Quotation');
  }

  async getQuotations(include = []) {
    const quotations = await this.quotationModel.findAll({
      include: include,
    });

    return quotations;
  }

  async getQuotation(id, include = []) {
    return await this.quotationModel.findByPk(id, {
      include: include,
    });
  }

  async createQuotation(quotation) {
    const data = await this.quotationModel.create(quotation);
    return data.id;
  }

  async updateQuotation(quotation) {
    const options = {
      where: {
        id: quotation.id,
      },
    };

    await this.quotationModel.update(quotation, options);
  }

  async deleteQuotation(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.quotationModel.destroy(options);
  }

  async getReservationsByCoverageIdAndDate(coverageId, date) {
    const options = {
      where: {
        coverageId: coverageId,
        travelDate: date,
        status: 'RESERVA',
      },
    };

    return await this.quotationModel.findAll(options);
  }

  async getQuotationsByDateRange(startDate, endDate, include = []) {
    const options = {
      include: include,
      where: {
        travelDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    };

    return await this.quotationModel.findAll(options);
  }

  async getQuotationsByUserId(userId, include = []) {
    const options = {
      include: include,
      where: {
        userId: userId,
      },
    };

    return await this.quotationModel.findAll(options);
  }

  async getQuotationsByCoverages(coverages, include = []) {
    const options = {
      include: include,
      where: {
        coverageId: {
          [Op.in]: coverages.map((coverage) => coverage.id),
        },
      },
    };

    return await this.quotationModel.findAll(options);
  }

  async deleteAllQuotations() {
    if(this.test) {
      const options = {
        truncate: true,
      };

      await this.quotationModel.destroy(options);
    }
  }

  async dropQuotationsTable() {
    if (this.test) {
      await this.quotationModel.drop();
    }
  }
}

module.exports = SequelizeQuotationsRepository;
