const express = require('express');
const appRoot = require('app-root-path');
const Category = require('../entities/category');
const validateSchema = require(appRoot + '/src/frameworks/http/ajv');
const exceptionHandler = require(appRoot + '/src/frameworks/http/exception-handler');

function createCategoriesRouter(manageCategoriesUsecase) {
  const router = express.Router();

  router.get('/categories/', async (req, res) => {
    try {
      const categories = await manageCategoriesUsecase.getCategories();

      res.status(200).json(categories);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.get('/categories/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const category = await manageCategoriesUsecase.getCategory(id);

      res.status(200).json(category);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.post('/categories/', async (req, res) => {
    try {
      const validation = validateSchema(Category.schema, req);

      if(validation === true) {
        const category = await manageCategoriesUsecase.createCategory(req.body);
        res.status(201).json(category);
      } else {
        res.status(422).json(validation);
      }

    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.put('/categories/:id', async (req, res) => {
    try {
      const validation = validateSchema(Category.schema, req);

      if(validation === true) {
        const id = req.params.id;
        const category = await manageCategoriesUsecase.updateCategory(id, req.body);

        res.status(200).json(category);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.delete('/categories/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await manageCategoriesUsecase.deleteCategory(id);

      res.status(200).json({ message: `Category with id ${id} deleted` });
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  return router;
}

module.exports = createCategoriesRouter;
