const express = require('express');

const {getAllAddress, createAAddress} = require('../controllers/addressController.js');

const addressRouter = express.Router();


addressRouter.route('/').get(getAllAddress);
// addressRouter.route('/add').post(createAAddress);

module.exports = addressRouter;