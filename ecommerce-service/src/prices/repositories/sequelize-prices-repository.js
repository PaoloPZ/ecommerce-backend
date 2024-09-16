const { DataTypes } = require('sequelize');
const { Op } = require('sequelize');

class SequelizePricesRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    let tableName = test ? 'Prices_test' : 'Prices';

    const columns = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      amount: DataTypes.DECIMAL,
      effectiveStartDate: DataTypes.DATE,
      effectiveEndDate: DataTypes.DATE,
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.priceModel = sequelizeClient.sequelize.define(
      'Price',
      columns,
      options
    );

    this.priceModel.belongsTo(sequelizeClient.getModel('Coverage'), {
      foreignKey: 'coverageId',
      as: 'coverage',
    });

    sequelizeClient.addModel(this.priceModel, 'Price');
  }

  async getPrices(include = []) {
    const prices = await this.priceModel.findAll({
      include: include,
    });

    return prices;
  }

  async getPrice(id, include = []) {
    return await this.priceModel.findByPk(id, {
      include: include,
    });
  }

  async createPrice(price) {
    const data = await this.priceModel.create(price);

    return data.id;
  }

  async updatePrice(price) {
    const options = {
      where: {
        id: price.id,
      },
    };

    await this.priceModel.update(price, options);
  }

  async deletePrice(id) {
    const options = {
      where: {
        id: id
      },
    };

    await this.priceModel.destroy(options);
  }

  async getPricesByCoveragesAndDate(coverages, date) {
    const options = {
      where: {
        coverageId: { [Op.in]: coverages.map((coverage) => coverage.id) },
        effectiveStartDate: { [Op.lte]: date },
        effectiveEndDate: { [Op.gte]: date },
      },
    };

    const prices = await this.priceModel.findAll(options);

    return prices;
  }

  async getPricesByCoverageIdAndDates(coverageId, startDate, endDate) {
    const options = {
      where: {
        coverageId: coverageId,
        [Op.or]: [
          { effectiveStartDate: { [Op.lte]: startDate }, effectiveEndDate: { [Op.gte]: startDate } },
          { effectiveStartDate: { [Op.lte]: endDate }, effectiveEndDate: { [Op.gte]: endDate } },
        ],
      },
    };

    const prices = await this.priceModel.findAll(options);

    return prices;
  }

  async deleteAllPrices() {
    if(this.test) {
      const options = {
        truncate: true,
      };

      await this.priceModel.destroy(options);
    }
  }

  async dropPricesTable() {
    if(this.test) {
      await this.priceModel.drop();
    }
  }

  async seed() {
    if((await this.priceModel.findAll()).length > 0) {
      return;
    }

    await this.priceModel.bulkCreate([
      {
        amount: 100,
        effectiveStartDate: new Date('2024-01-01'),
        effectiveEndDate: new Date('2024-05-31'),
        coverageId: 1,
      },
      {
        amount: 200,
        effectiveStartDate: new Date('2024-06-01'),
        effectiveEndDate: new Date('2024-12-31'),
        coverageId: 1,
      },
      {
        amount: 100,
        effectiveStartDate: new Date('2024-01-01'),
        effectiveEndDate: new Date('2024-05-31'),
        coverageId: 2,
      },
      {
        amount: 200,
        effectiveStartDate: new Date('2024-06-01'),
        effectiveEndDate: new Date('2024-12-31'),
        coverageId: 2,
      },
      {
        amount: 100,
        effectiveStartDate: new Date('2024-01-01'),
        effectiveEndDate: new Date('2024-05-31'),
        coverageId: 3,
      },
      {
        amount: 200,
        effectiveStartDate: new Date('2024-06-01'),
        effectiveEndDate: new Date('2024-12-31'),
        coverageId: 3,
      },
      {
        amount: 100,
        effectiveStartDate: new Date('2024-01-01'),
        effectiveEndDate: new Date('2024-05-31'),
        coverageId: 4,
      },
      {
        amount: 200,
        effectiveStartDate: new Date('2024-06-01'),
        effectiveEndDate: new Date('2024-12-31'),
        coverageId: 4,
      },
      {
        amount: 400,
        effectiveStartDate: new Date('2024-01-01'),
        effectiveEndDate: new Date('2024-05-31'),
        coverageId: 5,
      },
      {
        amount: 600,
        effectiveStartDate: new Date('2024-06-01'),
        effectiveEndDate: new Date('2024-12-31'),
        coverageId: 5,
      },
      {
        amount: 400,
        effectiveStartDate: new Date('2024-01-01'),
        effectiveEndDate: new Date('2024-05-31'),
        coverageId: 6,
      },
      {
        amount: 600,
        effectiveStartDate: new Date('2024-06-01'),
        effectiveEndDate: new Date('2024-12-31'),
        coverageId: 6,
      }
    ]);
  }
}

module.exports = SequelizePricesRepository;
