class Price {
  static schema = {
    type: 'object',
    properties: {
      amount: { type: 'number', errorMessage: 'must be of number type' },
      effectiveStartDate: { type: 'string', format: 'date-time', errorMessage: 'must be of date-time type' },
      effectiveEndDate: { type: 'string', format: 'date-time', errorMessage: 'must be of date-time type' },
      coverageId: { type: 'number', errorMessage: 'must be of number type' },
    },
    required: ['amount', 'effectiveStartDate', 'effectiveEndDate', 'coverageId'],
    additionalProperties: false,
  }

  constructor(id, amount, effectiveStartDate, effectiveEndDate, coverageId) {
    this.id = id;
    this.amount = amount;
    this.effectiveStartDate = effectiveStartDate;
    this.effectiveEndDate = effectiveEndDate;
    this.coverageId = coverageId;
  }
}

module.exports = Price;
