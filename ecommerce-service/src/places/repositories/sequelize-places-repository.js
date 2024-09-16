const { DataTypes } = require('sequelize');

class SequelizePlacesRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    const tableName = test ? 'Places_test' : 'Places';

    const columns = {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      longitude: DataTypes.FLOAT,
      latitude: DataTypes.FLOAT,
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.placeModel = sequelizeClient.sequelize.define(
      'Place',
      columns,
      options
    );

    sequelizeClient.addModel(this.placeModel, 'Place');
  }

  async getPlaces() {
    const places = await this.placeModel.findAll({
      raw: true,
    });

    return places;
  }

  async getPlace(id) {
    return await this.placeModel.findByPk(id);
  }

  async createPlace(place) {
    const data = await this.placeModel.create(place);
    return data.id;
  }

  async updatePlace(place) {
    const options = {
      where: {
        id: place.id
      }
    }

    await this.placeModel.update(place, options);
  }

  async deletePlace(id) {
    const options = {
      where: {
        id: id
      }
    }

    await this.placeModel.destroy(options);
  }

  async deleteAllPlaces() {
    if(this.test) {
      const options = {
        truncate: true
      }

      await this.placeModel.destroy(options);
    }
  }

  async dropPlacesTable() {
    if(this.test) {
      await this.placeModel.drop();
    }
  }

  async seed() {
    if((await this.placeModel.findAll()).length > 0) {
      return;
    }

    await this.placeModel.bulkCreate([
      {
        name: 'Place 1',
        address: 'Address 1',
        longitude: 1.1,
        latitude: 1.1,
      },
      {
        name: 'Place 2',
        address: 'Address 2',
        longitude: 2.2,
        latitude: 2.2,
      },
      {
        name: 'Place 3',
        address: 'Address 3',
        longitude: 3.3,
        latitude: 3.3,
      },
    ]);
  }
}

module.exports = SequelizePlacesRepository;
