const express = require('express');

const {getAllPosition} = require('../controllers/positionController.js');

const positionRouter = express.Router();


positionRouter.route('/').get(getAllPosition);

module.exports = positionRouter;