const express = require('express');
const appRoot = require('app-root-path');
const Price = require('../entities/price');
const validateSchema = require(appRoot + '/src/frameworks/http/ajv');
const exceptionHandler = require(appRoot + '/src/frameworks/http/exception-handler');

function createPricesRouter(managePricesUsecase) {
  const router = express.Router();

  router.get('/prices/', async (req, res) => {
    try {
      const prices = await managePricesUsecase.getPrices();

      res.status(200).json(prices);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.get('/prices/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const price = await managePricesUsecase.getPrice(id);

      res.status(200).json(price);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.post('/prices/', async (req, res) => {
    try {
      const validation = validateSchema(Price.schema, req);

      if (validation === true) {
        const price = await managePricesUsecase.createPrice(req.body);
        res.status(201).json(price);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.put('/prices/:id', async (req, res) => {
    try {
      const validation = validateSchema(Price.schema, req);

      if (validation === true) {
        const id = req.params.id;
        const price = await managePricesUsecase.updatePrice(id, req.body);

        res.status(200).json(price);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.delete('/prices/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await managePricesUsecase.deletePrice(id);

      res.status(200).json({ message: `Price with id ${id} deleted` });
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  return router;
}

module.exports = createPricesRouter;
