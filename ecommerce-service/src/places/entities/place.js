// Entidad Lugar.

class Place {
  static schema = {
    type: 'object',
    properties: {
      name: { type: 'string', errorMessage: 'must be of string type' },
      address: { type: 'string', errorMessage: 'must be of string type' },
      longitude: { type: 'number', errorMessage: 'must be of number type' },
      latitude: { type: 'number', errorMessage: 'must be of number type' },
    },
    required: ['name', 'address', 'longitude', 'latitude'],
    additionalProperties: false,
  };

  constructor(id, name, address, longitude, latitude) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.longitude = longitude;
    this.latitude = latitude;
  }
}

module.exports = Place;
