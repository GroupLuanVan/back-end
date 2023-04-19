const express = require('express');
//import cac controller
const {getAllJobposts, getAllJobpostsBaseOnCompanyId, createOneJobpost, updateOneJobpost, deleteOneJobpost, getJobpostsBaseOnPostId} = require('../controllers/jobpostController.js');

const jobpostRouter = express.Router();
const {verifyToken} = require('../middlewares/verifyToken');

jobpostRouter.route('/all').get(getAllJobposts).post(verifyToken, createOneJobpost);

jobpostRouter.route('/:id').get(getAllJobpostsBaseOnCompanyId);
jobpostRouter.route('/:id').put(verifyToken, updateOneJobpost).delete(verifyToken, deleteOneJobpost).get(getJobpostsBaseOnPostId);

module.exports = jobpostRouter;
