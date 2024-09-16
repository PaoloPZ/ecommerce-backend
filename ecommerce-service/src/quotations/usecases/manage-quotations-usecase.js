const Quotation = require('../entities/quotation');
const appRoot = require('app-root-path');
const NotFoundException = require(appRoot + '/src/frameworks/http/exceptions/not-found-exception');
const BadRequestException = require(appRoot + '/src/frameworks/http/exceptions/bad-request-exception');

class ManageQuotationsUsecase {
  constructor(
    quotationsRepository,
    usersRepository,
    placesRepository,
    coveragesRepository,
    providersRepository,
    pricesRepository,
    vehiclesRepository,
    categoriesRepository,
    vehicleCategoriesRepository
  ) {
    this.quotationsRepository = quotationsRepository;
    this.usersRepository = usersRepository;
    this.placesRepository = placesRepository;
    this.coveragesRepository = coveragesRepository;
    this.providersRepository = providersRepository;
    this.pricesRepository = pricesRepository;
    this.vehiclesRepository = vehiclesRepository;
    this.categoriesRepository = categoriesRepository;
    this.vehicleCategoriesRepository = vehicleCategoriesRepository;

    this.changeQuotationStatusSchema = {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['RESERVA', 'RESERVA_CANCELADA'],
          errorMessage: 'must be one of RESERVA, RESERVA_CANCELADA',
        },
        coverageId: { type: 'number', errorMessage: 'must be of number type' },
        priceId: { type: 'number', errorMessage: 'must be of number type' },
      },
      required: ['status', 'coverageId', 'priceId'],
      additionalProperties: false,
    };

    this.getQuotationsByDateRangeSchema = {
      type: 'object',
      properties: {
        startDate: { type: 'string', format: 'date-time', errorMessage: 'must be of string type' },
        endDate: { type: 'string', format: 'date-time', errorMessage: 'must be of string type' },
      },
      required: ['startDate', 'endDate'],
      additionalProperties: false,
    };
  }

  async getQuotations() {
    const include = [
      { model: this.usersRepository.userModel, as: 'user' },
      { model: this.placesRepository.placeModel, as: 'origin' },
      { model: this.placesRepository.placeModel, as: 'destination' },
      { model: this.coveragesRepository.coverageModel, as: 'coverage' },
      { model: this.pricesRepository.priceModel, as: 'price' },
    ];
    const quotations = await this.quotationsRepository.getQuotations(include);
    return quotations;
  }

  async getQuotation(id) {
    const include = [
      { model: this.usersRepository.userModel, as: 'user' },
      { model: this.placesRepository.placeModel, as: 'origin' },
      { model: this.placesRepository.placeModel, as: 'destination' },
      { model: this.coveragesRepository.coverageModel, as: 'coverage' },
      { model: this.pricesRepository.priceModel, as: 'price' },
    ];
    const quotation = await this.quotationsRepository.getQuotation(id, include);

    if (!quotation) {
      throw new NotFoundException(`Quotation with id ${id} not found`);
    }

    return quotation;
  }

  async createQuotation(data) {
    const quotation = new Quotation(
      undefined,
      data.userId,
      data.travelDate,
      data.numberOfPassengers,
      data.originId,
      data.destinationId,
      null,
      null
    );

    const user = await this.usersRepository.getUser(data.userId);
    const origin = await this.placesRepository.getPlace(data.originId);
    const destination = await this.placesRepository.getPlace(
      data.destinationId
    );

    if (!user) {
      throw new NotFoundException(`User with id ${data.userId} not found`);
    }

    if (!origin) {
      throw new NotFoundException(`Place with id ${data.originId} not found`);
    }

    if (!destination) {
      throw new NotFoundException(
        `Place with id ${data.destinationId} not found`
      );
    }

    let category = null;

    if (data.categoryId) {
      category = await this.categoriesRepository.getCategory(data.categoryId);

      if (!category) {
        throw new NotFoundException(
          `Category with id ${data.categoryId} not found`
        );
      }
    }

    // Validate if exists a coverage for the travel
    const coveragesInclude = [
      { model: this.vehiclesRepository.vehicleModel, as: 'vehicle' },
    ];
    let coverages =
      await this.coveragesRepository.getCoveragesByOriginAndDestination(
        data.originId,
        data.destinationId,
        coveragesInclude
      );

    if (coverages.length === 0) {
      throw new NotFoundException(
        `Coverage not found for origin ${data.originId} and destination ${data.destinationId}`
      );
    }

    // Validate if exists a price for the travel
    const prices = await this.pricesRepository.getPricesByCoveragesAndDate(
      coverages,
      data.travelDate
    );

    if (prices.length === 0) {
      throw new NotFoundException(
        `Price not found for origin ${data.originId}, destination ${data.destinationId} and date ${data.travelDate}`
      );
    }

    // Match the prices with the coverages
    for (const coverage of coverages) {
      const price = prices.find((price) => price.coverageId === coverage.id);

      if (price) {
        coverage.dataValues.price = price;
      }
    }

    // Filter the coverages without price
    coverages = coverages.filter((coverage) => coverage.dataValues.price);

    // If exists a category, filter the coverages by category
    if (category) {
      const vehiclesIds = coverages.map((coverage) => coverage.vehicleId);
      const vehicleCategories =
        await this.vehicleCategoriesRepository.getVehicleCategoriesByVehiclesIds(
          vehiclesIds
        );

      if (vehicleCategories.length === 0) {
        throw new NotFoundException(
          `Vehicle categories not found for vehicles ${vehiclesIds.join(', ')}`
        );
      }

      // Filter the vehicle categories by category
      const vehicleCategoriesFiltered = vehicleCategories.filter(
        (vehicleCategory) => vehicleCategory.categoryId === category.id
      );

      if (vehicleCategoriesFiltered.length === 0) {
        throw new NotFoundException(
          `Vehicle categories not found for category ${category.id}`
        );
      }

      // Filter the coverages by vehicle categories
      coverages = coverages.filter((coverage) =>
        vehicleCategoriesFiltered.find(
          (vehicleCategory) => vehicleCategory.vehicleId === coverage.vehicleId
        )
      );
    }

    const id = await this.quotationsRepository.createQuotation(quotation);
    quotation.id = id;

    return { quotation: quotation, coverages: coverages };
  }

  async changeQuotationStatus(id, data) {
    const foundQuotation = await this.getQuotation(id);
    const quotation = new Quotation(
      foundQuotation.id,
      foundQuotation.userId,
      foundQuotation.travelDate,
      foundQuotation.numberOfPassengers,
      foundQuotation.originId,
      foundQuotation.destinationId,
      data.coverageId,
      data.priceId,
      data.status
    );

    if (foundQuotation.status === 'CREADO' && data.status === 'RESERVA') {
      // Validate the coverage
      const coverage = await this.coveragesRepository.getCoverage(data.coverageId);
      const price = await this.pricesRepository.getPrice(data.priceId);

      if (!coverage) {
        throw new NotFoundException(`Coverage with id ${data.coverageId} not found`);
      }

      if (!price) {
        throw new NotFoundException(`Price with id ${data.priceId} not found`);
      }

      // Validate if the price belongs to the coverage
      if (price.coverageId !== coverage.id) {
        throw new NotFoundException(
          `Price with id ${data.priceId} does not belong to coverage with id ${data.coverageId}`
        );
      }

      // Validate if the price is for the travel date
      if (price.effectiveStartDate > quotation.travelDate || price.effectiveEndDate <quotation.travelDate) {
        throw new NotFoundException(
          `Price with id ${data.priceId} is not for the travel date ${quotation.travelDate}`
        );
      }

      // Validate if there are enough sit available
      const vehicle = await this.vehiclesRepository.getVehicle(coverage.vehicleId);
      const reservations = await this.quotationsRepository.getReservationsByCoverageIdAndDate(coverage.id, quotation.travelDate);

      // Validate if there are enough sit available
      let totalPassengers = 0;
      for (const reservation of reservations) {
        totalPassengers += reservation.numberOfPassengers;
      }

      if (totalPassengers + quotation.numberOfPassengers > vehicle.capacity) {
        throw new NotFoundException('There are not enough sits available');
      }

      await this.quotationsRepository.updateQuotation(quotation);
    } else if (foundQuotation.status === 'RESERVA' && data.status === 'RESERVA_CANCELADA') {
      quotation.status = data.status;
      await this.quotationsRepository.updateQuotation(quotation);
    } else {
      throw new BadRequestException('Invalid status change');
    }

    return quotation;

  }

  async getQuotationsByDateRange(data) {
    const include = [
      { model: this.usersRepository.userModel, as: 'user' },
      { model: this.placesRepository.placeModel, as: 'origin' },
      { model: this.placesRepository.placeModel, as: 'destination' },
      { model: this.coveragesRepository.coverageModel, as: 'coverage' },
      { model: this.pricesRepository.priceModel, as: 'price' },
    ];
    const quotations = await this.quotationsRepository.getQuotationsByDateRange(data.startDate, data.endDate, include);
    return quotations;
  }

  async getQuotationsByUserId(userId) {
    const include = [
      { model: this.usersRepository.userModel, as: 'user' },
      { model: this.placesRepository.placeModel, as: 'origin' },
      { model: this.placesRepository.placeModel, as: 'destination' },
      { model: this.coveragesRepository.coverageModel, as: 'coverage' },
      { model: this.pricesRepository.priceModel, as: 'price' },
    ];
    const quotations = await this.quotationsRepository.getQuotationsByUserId(userId, include);
    return quotations;
  }

  async getQuotationsByProviderId(providerId) {
    const coverages = await this.coveragesRepository.getCoveragesByProviderId(providerId);
    const include = [
      { model: this.usersRepository.userModel, as: 'user' },
      { model: this.placesRepository.placeModel, as: 'origin' },
      { model: this.placesRepository.placeModel, as: 'destination' },
      { model: this.coveragesRepository.coverageModel, as: 'coverage' },
      { model: this.pricesRepository.priceModel, as: 'price' },
    ];
    const quotations = await this.quotationsRepository.getQuotationsByCoverages(coverages, include);
    return quotations;
  }
}

module.exports = ManageQuotationsUsecase;
