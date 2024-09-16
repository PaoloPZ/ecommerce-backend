const { Sequelize } = require('sequelize');

class SequelizeClient {

  constructor() {
    const dialect = process.env.SEQUELIZE_DIALECT;
    const username = process.env.SEQUELIZE_USERNAME;
    const password = process.env.SEQUELIZE_PASSWORD;
    const database = process.env.SEQUELIZE_DATABASE;

    const host = process.env.SEQUELIZE_HOST;
    const socket = process.env.SEQUELIZE_SOCKET;

    let socketPath = undefined;

    if (host === undefined && socket !== undefined) {
      socketPath = "/cloudsql/" + socket;
    }

    this.sequelize = new Sequelize(database, username, password, {
      dialect: dialect,
      host: host,
      dialectOptions: {
        socketPath: socketPath,
      },
      logging: false,
    });

    this.models = {};

  }

  syncDatabase(repositories) {
    var syncOptions = {
      alter: false,
    };

    this.sequelize.sync(syncOptions)
      .catch(error => {
        console.log("Couldn't sync database", error);
      }).then(async () => {
        for (let repository of repositories) {
          await repository.seed();
        }
      });
  }

  addModel(model, name) {
    this.models[name] = model;
  }

  getModel(name) {
    return this.models[name];
  }
}

module.exports = SequelizeClient;
