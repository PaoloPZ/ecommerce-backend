const express = require('express');
const appRoot = require('app-root-path');
const Place = require('../entities/place');
const validateSchema = require(appRoot + '/src/frameworks/http/ajv');
const exceptionHandler = require(appRoot + '/src/frameworks/http/exception-handler');

function createPlacesRouter(managePlacesUsecase) {
  const router = express.Router();

  router.get('/places/', async (req, res) => {
    try {
      const places = await managePlacesUsecase.getPlaces();
      res.status(200).json(places);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.get('/places/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const place = await managePlacesUsecase.getPlace(id);

      res.status(200).json(place);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.post('/places/', async (req, res) => {
    try {
      const validation = validateSchema(Place.schema, req);

      if(validation === true) {
        const place = await managePlacesUsecase.createPlace(req.body);
        res.status(201).json(place);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.put('/places/:id', async (req, res) => {
    try {
      const validation = validateSchema(Place.schema, req);

      if(validation === true) {
        const id = req.params.id;
        const place = await managePlacesUsecase.updatePlace(id, req.body);
        res.status(200).json(place);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.delete('/places/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await managePlacesUsecase.deletePlace(id);

      res.status(200).json({ message: `Place with id ${id} deleted` });
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  return router;

}

module.exports = createPlacesRouter;
