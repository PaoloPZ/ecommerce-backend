const VehicleCategory = require('../entities/vehicle-category');
const appRoot = require('app-root-path');
const NotFoundException = require(appRoot + '/src/frameworks/http/exceptions/not-found-exception');
const BadRequestException = require(appRoot + '/src/frameworks/http/exceptions/bad-request-exception');

class ManageVehicleCategoriesUsecase {
  constructor(vehicleCategoriesRepository, vehiclesRepository, categoriesRepository) {
    this.vehicleCategoriesRepository = vehicleCategoriesRepository;
    this.vehiclesRepository = vehiclesRepository;
    this.categoriesRepository = categoriesRepository;
  }

  async assignCategoryToVehicle(data) {
    const vehicleCategory = new VehicleCategory(undefined, data.numberOfPassengers, data.vehicleId, data.categoryId);
    const vehicle = await this.vehiclesRepository.getVehicle(data.vehicleId);
    const category = await this.categoriesRepository.getCategory(data.categoryId);

    if (!vehicle) {
      throw new NotFoundException(
        `Vehicle with id ${data.vehicleId} not found`
      );
    }

    if (!category) {
      throw new NotFoundException(
        `Category with id ${data.categoryId} not found`
      );
    }

    // Find the vehicle categories
    const vehicleCategories = await this.vehicleCategoriesRepository.getVehicleCategoriesByVehicleId(data.vehicleId);

    // Validate the number of passengers
    let totalPassengers = 0;
    for(const vc of vehicleCategories) {
      totalPassengers += vc.numberOfPassengers;
    }

    if (totalPassengers + data.numberOfPassengers > vehicle.capacity) {
      throw new BadRequestException(
        `The total number of passengers exceeds the vehicle capacity`
      );
    }

    // Assign the category to the vehicle
    const id = await this.vehicleCategoriesRepository.createVehicleCategory(vehicleCategory);
    vehicleCategory.id = id;

    return vehicleCategory;
  }
}

module.exports = ManageVehicleCategoriesUsecase;
