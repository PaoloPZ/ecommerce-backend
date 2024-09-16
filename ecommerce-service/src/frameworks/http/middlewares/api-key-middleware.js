function apiKeyMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ message: 'API Key is missing' });
  }

  if (apiKey !== process.env.ECOMMERCE_API_KEY) {
    return res.status(403).json({ message: 'Invalid API Key' });
  }

  next();
}

module.exports = apiKeyMiddleware;
