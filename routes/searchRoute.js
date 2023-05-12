const express = require('express');
const {findJobpostBaseOnTitleAndLocation, findCompany} = require('../controllers/searchController.js');

const searchRouter = express.Router();

//all post base on title or location
searchRouter.route('/jobpost').get(findJobpostBaseOnTitleAndLocation)
searchRouter.route('/company').get(findCompany);

module.exports = searchRouter;