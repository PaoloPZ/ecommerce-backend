const express = require('express');
const appRoot = require('app-root-path');
const Vehicle = require('../entities/vehicle');
const validateSchema = require(appRoot + '/src/frameworks/http/ajv');
const exceptionHandler = require(appRoot + '/src/frameworks/http/exception-handler');

function createVehiclesRouter(manageVehiclesUsecase) {
  const router = express.Router();

  router.get('/vehicles/', async (req, res) => {
    try {
      const vehicles = await manageVehiclesUsecase.getVehicles();

      res.status(200).json(vehicles);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.get('/vehicles/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const vehicle = await manageVehiclesUsecase.getVehicle(id);

      res.status(200).json(vehicle);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.post('/vehicles/', async (req, res) => {
    try {
      const validation = validateSchema(Vehicle.schema, req);

      if (validation === true) {
        const vehicle = await manageVehiclesUsecase.createVehicle(req.body);
        res.status(201).json(vehicle);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.put('/vehicles/:id', async (req, res) => {
    try {
      const validation = validateSchema(Vehicle.schema, req);

      if (validation === true) {
        const id = req.params.id;
        const vehicle = await manageVehiclesUsecase.updateVehicle(id, req.body);

        res.status(200).json(vehicle);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.delete('/vehicles/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await manageVehiclesUsecase.deleteVehicle(id);

      res.status(200).json({ message: `Vehicle with id ${id} deleted` });
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  return router;
}

module.exports = createVehiclesRouter;
