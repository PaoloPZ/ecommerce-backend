class Vehicle {
  static schema = {
    type: 'object',
    properties: {
      name: { type: 'string', errorMessage: 'must be of string type' },
      capacity: { type: 'number', errorMessage: 'must be of number type' },
      providerId: { type: 'number', errorMessage: 'must be of number type'},
    },
    required: ['name', 'capacity', 'providerId'],
    additionalProperties: false,
  };

  constructor(id, name, capacity, providerId) {
    this.id = id;
    this.name = name;
    this.capacity = capacity;
    this.providerId = providerId;
  }
}

module.exports = Vehicle;
