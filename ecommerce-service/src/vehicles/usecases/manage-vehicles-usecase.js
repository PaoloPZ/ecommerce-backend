const Vehicle = require('../entities/vehicle');
const appRoot = require('app-root-path');
const NotFoundException = require(appRoot +
  '/src/frameworks/http/exceptions/not-found-exception');

class ManageVehiclesUsecase {
  constructor(
    vehiclesRepository,
    providersRepository,
    vehicleCategoriesRepository,
    categoriesRepository
  ) {
    this.vehiclesRepository = vehiclesRepository;
    this.providersRepository = providersRepository;
    this.vehicleCategoriesRepository = vehicleCategoriesRepository;
    this.categoriesRepository = categoriesRepository;
  }

  async getVehicles() {
    const include = [
      { model: this.providersRepository.providerModel, as: 'provider' },
    ];
    const vehicles = await this.vehiclesRepository.getVehicles(include);
    return vehicles;
  }

  async getVehicle(id) {
    const vehiclesInclude = [
      { model: this.providersRepository.providerModel, as: 'provider' },
    ];
    const vehicle = await this.vehiclesRepository.getVehicle(
      id,
      vehiclesInclude
    );

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${id} not found`);
    }

    const vehicleCategoriesInclude = [
      { model: this.categoriesRepository.categoryModel, as: 'category' },
    ];

    const vehicleCategories =
      await this.vehicleCategoriesRepository.getVehicleCategoriesByVehicleId(
        vehicle.id,
        vehicleCategoriesInclude
      );
    vehicle.dataValues.categories = vehicleCategories;

    return vehicle;
  }

  async createVehicle(data) {
    const vehicle = new Vehicle(
      undefined,
      data.name,
      data.capacity,
      data.providerId
    );
    const provider = await this.providersRepository.getProvider(
      data.providerId
    );

    if (!provider) {
      throw new NotFoundException(
        `Provider with id ${data.providerId} not found`
      );
    }

    const id = await this.vehiclesRepository.createVehicle(vehicle);
    vehicle.id = id;

    return vehicle;
  }

  async updateVehicle(id, data) {
    await this.getVehicle(id);
    const vehicle = new Vehicle(id, data.name, data.capacity, data.providerId);
    const provider = await this.providersRepository.getProvider(
      data.providerId
    );

    if (!provider) {
      throw new NotFoundException(
        `Provider with id ${data.providerId} not found`
      );
    }

    await this.vehiclesRepository.updateVehicle(vehicle);

    return vehicle;
  }

  async deleteVehicle(id) {
    await this.getVehicle(id);
    await this.vehiclesRepository.deleteVehicle(id);
  }
}

module.exports = ManageVehiclesUsecase;
