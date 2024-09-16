const Category = require('../entities/category');
const appRoot = require('app-root-path');
const NotFoundException = require(appRoot + '/src/frameworks/http/exceptions/not-found-exception');

class ManageCategoriesUsecase {
  constructor(categoriesRepository) {
    this.categoriesRepository = categoriesRepository;
  }

  async getCategories() {
    return await this.categoriesRepository.getCategories();
  }

  async getCategory(id) {
    const category = await this.categoriesRepository.getCategory(id);

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async createCategory(data) {
    const category = new Category(undefined, data.name);
    const id = await this.categoriesRepository.createCategory(category);
    category.id = id;

    return category;
  }

  async updateCategory(id, data) {
    await this.getCategory(id);
    const category = new Category(id, data.name);
    await this.categoriesRepository.updateCategory(category);

    return category;
  }

  async deleteCategory(id) {
    await this.getCategory(id);
    await this.categoriesRepository.deleteCategory(id);
  }
}

module.exports = ManageCategoriesUsecase;
