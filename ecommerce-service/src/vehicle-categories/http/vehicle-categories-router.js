const express = require('express');
const appRoot = require('app-root-path');
const VehicleCategory = require('../entities/vehicle-category');
const validateSchema = require(appRoot + '/src/frameworks/http/ajv');
const exceptionHandler = require(appRoot + '/src/frameworks/http/exception-handler');

function createVehicleCategoriesRouter(manageVehicleCategoriesUsecase) {
  const router = express.Router();

  router.post('/vehicle-categories/', async (req, res) => {
    try {
      const validation = validateSchema(VehicleCategory.schema, req);

      if (validation === true) {
        const vehicleCategory = await manageVehicleCategoriesUsecase.assignCategoryToVehicle(req.body);
        res.status(201).json(vehicleCategory);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  return router;
}

module.exports = createVehicleCategoriesRouter;
