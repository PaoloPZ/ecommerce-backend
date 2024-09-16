const express = require('express');
const appRoot = require('app-root-path');
const Coverage = require('../entities/coverage');
const validateSchema = require(appRoot + '/src/frameworks/http/ajv');
const exceptionHandler = require(appRoot + '/src/frameworks/http/exception-handler');

function createCoveragesRouter(manageCoveragesUsecase) {
  const router = express.Router();

  router.get('/coverages/', async (req, res) => {
    try {
      const coverages = await manageCoveragesUsecase.getCoverages();

      res.status(200).json(coverages);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.get('/coverages/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const coverage = await manageCoveragesUsecase.getCoverage(id);

      res.status(200).json(coverage);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.post('/coverages/', async (req, res) => {
    try {
      const validation = validateSchema(Coverage.schema, req);

      if (validation === true) {
        const coverage = await manageCoveragesUsecase.createCoverage(req.body);
        res.status(201).json(coverage);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.put('/coverages/:id', async (req, res) => {
    try {
      const validation = validateSchema(Coverage.schema, req);

      if (validation === true) {
        const id = req.params.id;
        const coverage = await manageCoveragesUsecase.updateCoverage(id, req.body);

        res.status(200).json(coverage);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.delete('/coverages/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await manageCoveragesUsecase.deleteCoverage(id);

      res.status(200).send({ message: `Coverage with id ${id} deleted` });
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  return router;
}

module.exports = createCoveragesRouter;
