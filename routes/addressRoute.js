const express = require('express');

const {getAllAddress} = require('../controllers/addressController.js');

const addressRouter = express.Router();


addressRouter.route('/').get(getAllAddress);

module.exports = addressRouter;