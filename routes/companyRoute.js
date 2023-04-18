const express = require('express');

const {getAllCompany} = require('../controllers/companyController.js');

const companyRouter = express.Router();


companyRouter.route('/').get(getAllCompany);

module.exports = companyRouter;