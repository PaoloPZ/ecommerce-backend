const Place = require('../entities/place');
const appRoot = require('app-root-path');
const NotFoundException = require(appRoot + '/src/frameworks/http/exceptions/not-found-exception');

class ManagePlacesUsecase {
  constructor(placesRepository) {
    this.placesRepository = placesRepository;
  }

  async getPlaces() {
    return await this.placesRepository.getPlaces();
  }

  async getPlace(id) {
    const place = await this.placesRepository.getPlace(id);

    if (!place) {
      throw new NotFoundException(`Place with id ${id} not found`);
    }

    return place;
  }

  async createPlace(data) {
    const place = new Place(undefined, data.name, data.address, data.longitude, data.latitude);
    const id = await this.placesRepository.createPlace(place);
    place.id = id;

    return place;
  }

  async updatePlace(id, data) {
    await this.getPlace(id);
    const place = new Place(id, data.name, data.address, data.longitude, data.latitude);
    await this.placesRepository.updatePlace(place);

    return place;
  }

  async deletePlace(id) {
    await this.getPlace(id);
    await this.placesRepository.deletePlace(id);
  }
}

module.exports = ManagePlacesUsecase;
