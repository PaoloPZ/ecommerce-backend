class Coverage {
  static schema = {
    type: 'object',
    properties: {
      startHour: { type: 'string', errorMessage: 'must be of string type' },
      travelDuration: { type: 'number', errorMessage: 'must be of number type' },
      originId: { type: 'number', errorMessage: 'must be of number type'},
      destinationId: { type: 'number', errorMessage: 'must be of number type'},
      providerId: { type: 'number', errorMessage: 'must be of number type'},
      vehicleId: { type: 'number', errorMessage: 'must be of number type'},
    },
    required: ['startHour', 'travelDuration', 'originId', 'destinationId', 'providerId', 'vehicleId'],
    additionalProperties: false,
  }

  constructor(id, startHour, travelDuration, originId, destinationId, providerId, vehicleId) {
    this.id = id;
    this.startHour = startHour;
    this.travelDuration = travelDuration;
    this.originId = originId;
    this.destinationId = destinationId;
    this.providerId = providerId;
    this.vehicleId = vehicleId;
  }
}

module.exports = Coverage;
