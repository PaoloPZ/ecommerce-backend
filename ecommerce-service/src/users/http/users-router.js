const express = require('express');
const appRoot = require('app-root-path');
const User = require('../entities/user');
const validateSchema = require(appRoot + '/src/frameworks/http/ajv');
const exceptionHandler = require(appRoot + '/src/frameworks/http/exception-handler');

function createUsersRouter(manageUsersUsecase) {
  const router = express.Router();

  router.get('/users/', async (req, res) => {
    try {
      const users = await manageUsersUsecase.getUsers();

      res.status(200).json(users);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.get('/users/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const user = await manageUsersUsecase.getUser(id);

      res.status(200).json(user);
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.post('/users/', async (req, res) => {
    try {
      const validation = validateSchema(User.schema, req);

      if(validation === true) {
        const user = await manageUsersUsecase.createUser(req.body);
        res.status(201).json(user);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.put('/users/:id', async (req, res) => {
    try {
      const validation = validateSchema(User.schema, req);

      if(validation === true) {
        const id = req.params.id;
        const user = await manageUsersUsecase.updateUser(id, req.body);
        res.status(200).json(user);
      } else {
        res.status(422).json(validation);
      }
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  router.delete('/users/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await manageUsersUsecase.deleteUser(id);

      res.status(200).json({ message: `User with id ${id} deleted` });
    } catch (error) {
      exceptionHandler(error, res);
    }
  });

  return router;
}

module.exports = createUsersRouter;
