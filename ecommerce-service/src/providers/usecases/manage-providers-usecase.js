const Provider = require('../entities/provider');
const appRoot = require('app-root-path');
const NotFoundException = require(appRoot + '/src/frameworks/http/exceptions/not-found-exception');

class ManageProvidersUsecase {
  constructor(providersRepository) {
    this.providersRepository = providersRepository;
  }

  async getProviders() {
    return await this.providersRepository.getProviders();
  }

  async getProvider(id) {
    const provider = await this.providersRepository.getProvider(id);

    if (!provider) {
      throw new NotFoundException(`Provider with id ${id} not found`);
    }

    return provider;
  }

  async createProvider(data) {
    const provider = new Provider(undefined, data.name, data.email, data.phone);
    const id = await this.providersRepository.createProvider(provider);
    provider.id = id;

    return provider;
  }

  async updateProvider(id, data) {
    await this.getProvider(id);
    const provider = new Provider(id, data.name, data.email, data.phone);
    await this.providersRepository.updateProvider(provider);

    return provider;
  }

  async deleteProvider(id) {
    await this.getProvider(id);
    await this.providersRepository.deleteProvider(id);
  }
}

module.exports = ManageProvidersUsecase;
