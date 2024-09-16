const HttpException = require('./exceptions/http-exception');

function exceptionHandler(error, res) {
  if (error instanceof HttpException) {
    res.status(error.statusCode).json({ message: error.message });
  } else {
    res.status(500).json({ message: 'Internal server error' });
    console.error(error);
  }
}

module.exports = exceptionHandler;
