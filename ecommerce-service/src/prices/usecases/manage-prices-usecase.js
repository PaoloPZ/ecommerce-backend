const Price = require('../entities/price');
const appRoot = require('app-root-path');
const NotFoundException = require(appRoot + '/src/frameworks/http/exceptions/not-found-exception');
const BadRequestException = require(appRoot + '/src/frameworks/http/exceptions/bad-request-exception');

class ManagePricesUsecase {
  constructor(pricesRepository, coveragesRepository) {
    this.pricesRepository = pricesRepository;
    this.coveragesRepository = coveragesRepository;
  }

  async getPrices() {
    const include = [
      { model: this.coveragesRepository.coverageModel, as: 'coverage' },
    ];
    const prices = await this.pricesRepository.getPrices(include);
    return prices;
  }

  async getPrice(id) {
    const include = [
      { model: this.coveragesRepository.coverageModel, as: 'coverage' },
    ];
    const price = await this.pricesRepository.getPrice(id, include);

    if (!price) {
      throw new NotFoundException(`Price with id ${id} not found`);
    }

    return price;
  }

  async createPrice(data) {
    const price = new Price(
      undefined,
      data.amount,
      data.effectiveStartDate,
      data.effectiveEndDate,
      data.coverageId
    );
    const coverage = await this.coveragesRepository.getCoverage(
      data.coverageId
    );

    if (!coverage) {
      throw new NotFoundException(
        `Coverage with id ${data.coverageId} not found`
      );
    }

    // Validate if the effective start date is before the effective end date
    if (price.effectiveStartDate > price.effectiveEndDate) {
      throw new BadRequestException(
        'Effective start date must be before the effective end date'
      );
    }

    // Validate if exists a price with the same coverage and between the same date
    const prices = await this.pricesRepository.getPricesByCoverageIdAndDates(
      data.coverageId,
      data.effectiveStartDate,
      data.effectiveEndDate,
    );

    if (prices.length > 0) {
      throw new BadRequestException(
        `Price for coverage with id ${data.coverageId} already exists between these dates`
      );
    }

    const id = await this.pricesRepository.createPrice(price);
    price.id = id;

    return price;
  }

  async updatePrice(id, data) {
    await this.getPrice(id);
    const price = new Price(
      id,
      data.amount,
      data.effectiveStartDate,
      data.effectiveEndDate,
      data.coverageId
    );
    const coverage = await this.coveragesRepository.getCoverage(
      data.coverageId
    );

    if (!coverage) {
      throw new NotFoundException(
        `Coverage with id ${data.coverageId} not found`
      );
    }

    // Validate if the effective start date is before the effective end date
    if (price.effectiveStartDate > price.effectiveEndDate) {
      throw new BadRequestException(
        'Effective start date must be before the effective end date'
      );
    }

    // Validate if exists a price with the same coverage and between the same date
    let prices = await this.pricesRepository.getPricesByCoverageIdAndDates(
      data.coverageId,
      data.effectiveStartDate,
      data.effectiveEndDate,
    );

    // Remove the current price from the list
    prices = prices.filter((p) => p.id !== id);

    if (prices.length > 0) {
      throw new BadRequestException(
        `Price for coverage with id ${data.coverageId} already exists between these dates`
      );
    }

    await this.pricesRepository.updatePrice(price);

    return price;
  }

  async deletePrice(id) {
    await this.getPrice(id);
    await this.pricesRepository.deletePrice(id);
  }
}

module.exports = ManagePricesUsecase;
