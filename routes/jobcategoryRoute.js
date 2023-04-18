const express = require('express');

const {getAllJobcategory, createAJobcategory, deleteJobcategory} = require('../controllers/jobcategoryController.js');
const {verifyToken, checkAdmin, verifyTokenAndAdminAuth} = require('../middlewares/verifyToken');
const jobcategoryRouter = express.Router();


jobcategoryRouter.route('/').get(getAllJobcategory).post(verifyToken, checkAdmin, createAJobcategory);
jobcategoryRouter.route('/:id').delete(verifyToken, verifyTokenAndAdminAuth, deleteJobcategory);

module.exports = jobcategoryRouter;