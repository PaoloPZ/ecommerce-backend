const Coverage = require('../entities/coverage');
const appRoot = require('app-root-path');
const NotFoundException = require(appRoot + '/src/frameworks/http/exceptions/not-found-exception');

class ManageCoverageUsecase {
  constructor(
    coveragesRepository,
    placesRepository,
    providersRepository,
    vehiclesRepository
  ) {
    this.coveragesRepository = coveragesRepository;
    this.placesRepository = placesRepository;
    this.providersRepository = providersRepository;
    this.vehiclesRepository = vehiclesRepository;
  }

  async getCoverages() {
    const include = [
      { model: this.placesRepository.placeModel, as: 'origin' },
      { model: this.placesRepository.placeModel, as: 'destination' },
      { model: this.providersRepository.providerModel, as: 'provider' },
      { model: this.vehiclesRepository.vehicleModel, as: 'vehicle' },
    ];
    const coverages = await this.coveragesRepository.getCoverages(include);
    return coverages;
  }

  async getCoverage(id) {
    const include = [
      { model: this.placesRepository.placeModel, as: 'origin' },
      { model: this.placesRepository.placeModel, as: 'destination' },
      { model: this.providersRepository.providerModel, as: 'provider' },
      { model: this.vehiclesRepository.vehicleModel, as: 'vehicle' },
    ];
    const coverage = await this.coveragesRepository.getCoverage(id, include);

    if (!coverage) {
      throw new NotFoundException(`Coverage with id ${id} not found`);
    }

    return coverage;
  }

  async createCoverage(data) {
    const coverage = new Coverage(
      undefined,
      data.startHour,
      data.travelDuration,
      data.originId,
      data.destinationId,
      data.providerId,
      data.vehicleId
    );

    const origin = await this.placesRepository.getPlace(data.originId);
    const destination = await this.placesRepository.getPlace(data.destinationId);
    const provider = await this.providersRepository.getProvider(data.providerId);
    const vehicle = await this.vehiclesRepository.getVehicle(data.vehicleId);

    if (!origin) {
      throw new NotFoundException(`Place with id ${data.originId} not found`);
    }

    if (!destination) {
      throw new NotFoundException(
        `Place with id ${data.destinationId} not found`
      );
    }

    if (!provider) {
      throw new NotFoundException(
        `Provider with id ${data.providerId} not found`
      );
    }

    if (!vehicle) {
      throw new NotFoundException(
        `Vehicle with id ${data.vehicleId} not found`
      );
    }

    const id = await this.coveragesRepository.createCoverage(coverage);
    coverage.id = id;

    return coverage;
  }

  async updateCoverage(id, data) {
    await this.getCoverage(id);
    const coverage = new Coverage(
      id,
      data.startHour,
      data.travelDuration,
      data.originId,
      data.destinationId,
      data.providerId,
      data.vehicleId
    );

    const origin = await this.placesRepository.getPlace(data.originId);
    const destination = await this.placesRepository.getPlace(data.destinationId);
    const provider = await this.providersRepository.getProvider(data.providerId);
    const vehicle = await this.vehiclesRepository.getVehicle(data.vehicleId);

    if (!origin) {
      throw new NotFoundException(`Origin with id ${data.originId} not found`);
    }

    if (!destination) {
      throw new NotFoundException(
        `Destination with id ${data.destinationId} not found`
      );
    }

    if (!provider) {
      throw new NotFoundException(
        `Provider with id ${data.providerId} not found`
      );
    }

    if (!vehicle) {
      throw new NotFoundException(
        `Vehicle with id ${data.vehicleId} not found`
      );
    }

    await this.coveragesRepository.updateCoverage(coverage);
    return coverage;
  }

  async deleteCoverage(id) {
    await this.getCoverage(id);
    await this.coveragesRepository.deleteCoverage(id);
  }
}

module.exports = ManageCoverageUsecase;
