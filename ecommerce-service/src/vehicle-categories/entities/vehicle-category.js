class VehicleCategory {
  static schema = {
    type: 'object',
    properties: {
      numberOfPassengers: { type: 'number', errorMessage: 'must be of number type' },
      vehicleId: { type: 'number', errorMessage: 'must be of number type' },
      categoryId: { type: 'number', errorMessage: 'must be of number type' },
    },
    required: ['numberOfPassengers', 'vehicleId', 'categoryId'],
    additionalProperties: false,
  }

  constructor(id, numberOfPassengers, vehicleId, categoryId) {
    this.id = id;
    this.numberOfPassengers = numberOfPassengers;
    this.vehicleId = vehicleId;
    this.categoryId = categoryId;
  }
}

module.exports = VehicleCategory;
