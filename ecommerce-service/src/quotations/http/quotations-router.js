const express = require('express');
const appRoot = require('app-root-path');
const Quotation = require('../entities/quotation');
const validateSchema = require(appRoot + '/src/frameworks/http/ajv');
const exceptionHandler = require(appRoot + '/src/frameworks/http/exception-handler');

function createQuotationsRouter(manageQuotationsUsecase) {
  const router = express.Router();

  router.get('/quotations/', async (req, res) => {
    try {
      // Get the query parameters
      const { userId, providerId } = req.query;
      let quotations = [];

      if(userId) {
        quotations = await manageQuotationsUsecase.getQuotationsByUserId(userId);
      } else if(providerId) {
        quotations = await manageQuotationsUsecase.getQuotationsByProviderId(providerId);
      } else {
        quotations = await manageQuotationsUsecase.getQuotations();
      }

      res.status(200).json(quotations);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.get('/quotations/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const quotation = await manageQuotationsUsecase.getQuotation(id);

      res.status(200).json(quotation);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.post('/quotations/', async (req, res) => {
    try {
      const validation = validateSchema(Quotation.schema, req);

      if (validation === true) {
        const quotation = await manageQuotationsUsecase.createQuotation(req.body);
        res.status(201).json(quotation);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.put('/quotations/:id/change-status', async (req, res) => {
    try {
      const validation = validateSchema(manageQuotationsUsecase.changeQuotationStatusSchema, req);

      if (validation === true) {
        const id = req.params.id;
        const quotation = await manageQuotationsUsecase.changeQuotationStatus(id, req.body);

        res.status(200).json(quotation);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.post('/quotations/get-by-date-range', async (req, res) => {
    try {
      const validation = validateSchema(manageQuotationsUsecase.getQuotationsByDateRangeSchema, req);

      if (validation === true) {
        const quotations = await manageQuotationsUsecase.getQuotationsByDateRange(req.body);

        res.status(200).json(quotations);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  return router;
}

module.exports = createQuotationsRouter;
