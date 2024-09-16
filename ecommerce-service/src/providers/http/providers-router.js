const express = require('express');
const appRoot = require('app-root-path');
const Provider = require('../entities/provider');
const validateSchema = require(appRoot + '/src/frameworks/http/ajv');
const exceptionHandler = require(appRoot + '/src/frameworks/http/exception-handler');

function createProvidersRouter(manageProvidersUsecase) {
  const router = express.Router();

  router.get('/providers/', async (req, res) => {
    try {
      const providers = await manageProvidersUsecase.getProviders();

      res.status(200).json(providers);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.get('/providers/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const provider = await manageProvidersUsecase.getProvider(id);

      res.status(200).json(provider);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.post('/providers/', async (req, res) => {
    try {
      const validation = validateSchema(Provider.schema, req);

      if(validation === true) {
        const provider = await manageProvidersUsecase.createProvider(req.body);
        res.status(201).json(provider);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.put('/providers/:id', async (req, res) => {
    try {
      const validation = validateSchema(Provider.schema, req);

      if(validation === true) {
        const id = req.params.id;
        const provider = await manageProvidersUsecase.updateProvider(id, req.body);
        res.status(200).json(provider);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.delete('/providers/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await manageProvidersUsecase.deleteProvider(id);

      res.status(200).json({ message: `Provider with id ${id} deleted` });
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  return router;
}

module.exports = createProvidersRouter;
