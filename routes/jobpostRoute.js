const express = require('express');
//import cac controller
const {getAllPost,  getAllJobpostsBaseOnCompanyId, createOneJobpost, updateOneJobpost, deleteOneJobpost, getJobpostsBaseOnPostId, getJobpostsBaseOnPostIdWhenLogin, findJobpostBaseOnTitleAndLocation} = require('../controllers/jobpostController.js');

const jobpostRouter = express.Router();


const {verifyToken} = require('../middlewares/verifyToken');
//all post no limit
jobpostRouter.route('/all/home').get(getAllPost)

jobpostRouter.route('/').post(verifyToken, createOneJobpost);

jobpostRouter.route('/showallpost/:id').get(getAllJobpostsBaseOnCompanyId);
jobpostRouter.route('/:id').put(verifyToken, updateOneJobpost).delete(verifyToken, deleteOneJobpost).get(getJobpostsBaseOnPostId);

jobpostRouter.route('/detail/:id').get(verifyToken, getJobpostsBaseOnPostIdWhenLogin);

module.exports = jobpostRouter;

