const HttpException = require('./http-exception');

class NofFoundException extends HttpException {
  constructor(message) {
    super(404, message);
  }
}

module.exports = NofFoundException;
