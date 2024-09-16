const { DataTypes } = require('sequelize');

class SequelizeCategoriesRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    let tableName = test ? 'Categories_test' : 'Categories';

    const columns = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: DataTypes.STRING,
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.categoryModel = sequelizeClient.sequelize.define('Category', columns, options);

    sequelizeClient.addModel(this.categoryModel, 'Category');
  }

  async getCategories(include = []) {
    return await this.categoryModel.findAll({
      include: include,
    });
  }

  async getCategory(id, include = []) {
    return await this.categoryModel.findByPk(id, {
      include: include,
    });
  }

  async createCategory(category) {
    const data = await this.categoryModel.create(category);
    return data.id;
  }

  async updateCategory(category) {
    const options = {
      where: {
        id: category.id,
      },
    };

    await this.categoryModel.update(category, options);
  }

  async deleteCategory(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.categoryModel.destroy(options);
  }

  async deleteAllCategories() {
    if(this.test){
      const options = {
        truncate: true,
      };

      await this.categoryModel.destroy(options);
    }
  }

  async dropCategoriesTable() {
    if(this.test){
      await this.categoryModel.drop();
    }
  }

  async seed() {
    if ((await this.getCategories()).length > 0) {
      return;
    }

    await this.categoryModel.bulkCreate([
      { name: 'Standard' },
      { name: 'Plus' },
    ]);
  }
}

module.exports = SequelizeCategoriesRepository;
