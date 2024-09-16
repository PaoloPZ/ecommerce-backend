class Provider {
  static schema = {
    type: 'object',
    properties: {
      name: { type: 'string', errorMessage: 'must be of string type' },
      email: { type: 'string', errorMessage: 'must be of string type' },
      phone: { type: 'string', errorMessage: 'must be of string type' },
    },
    required: ['name', 'email', 'phone'],
    additionalProperties: false,
  };

  constructor(id, name, email, phone) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
}

module.exports = Provider;
