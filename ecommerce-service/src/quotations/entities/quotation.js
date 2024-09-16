class Quotation {
  static schema = {
    type: 'object',
    properties: {
      userId: { type: 'number', errorMessage: 'must be of number type' },
      travelDate: { type: 'string', format: 'date-time', errorMessage: 'must be of string type' },
      numberOfPassengers: {  type: 'number', errorMessage: 'must be of number type' },
      originId: { type: 'number', errorMessage: 'must be of number type' },
      destinationId: { type: 'number', errorMessage: 'must be of number type' },
      categoryId: { type: 'number', errorMessage: 'must be of number type' },
    },
    required: [
      'userId',
      'travelDate',
      'numberOfPassengers',
      'originId',
      'destinationId',
    ],
    additionalProperties: false,
  };

  constructor(
    id,
    userId,
    travelDate,
    numberOfPassengers,
    originId,
    destinationId,
    coverageId,
    priceId,
    status = 'CREADO'
  ) {
    this.id = id;
    this.userId = userId;
    this.travelDate = travelDate;
    this.numberOfPassengers = numberOfPassengers;
    this.originId = originId;
    this.destinationId = destinationId;
    this.coverageId = coverageId;
    this.priceId = priceId;
    this.status = status;
  }
}

module.exports = Quotation;
