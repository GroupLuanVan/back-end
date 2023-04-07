const express = require('express');
//import cac controller
const {getAllJobposts, getAllJobpostsBaseOnCompany, createOneJobpost, updateOneJobpost, deleteOneJobpost} = require('../controllers/jobpostController.js');

const jobpostRouter = express.Router();
const {verifyToken} = require('../middlewares/verifyToken');

jobpostRouter.route('/').get(getAllJobposts).post(verifyToken, createOneJobpost);

jobpostRouter.route('/all').get(getAllJobpostsBaseOnCompany);
jobpostRouter.route('/:jobpostId').put(verifyToken, updateOneJobpost).delete(verifyToken, deleteOneJobpost);

module.exports = jobpostRouter;
