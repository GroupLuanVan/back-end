const express = require('express');

const {getAllJobcategory} = require('../controllers/jobcategoryController.js');

const jobcategoryRouter = express.Router();


jobcategoryRouter.route('/').get(getAllJobcategory);

module.exports = jobcategoryRouter;