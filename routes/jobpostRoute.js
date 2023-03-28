const express = require('express');
//import cac controller
const {getAllJobposts, createOneJobpost, updateOneJobpost, deleteOneJobpost} = require('../controllers/jobpostController.js');

const Router = express.Router();
const {verifyToken} = require('../middlewares/verifyToken');

Router.route('/').get(getAllJobposts).post(verifyToken, createOneJobpost);

Router.route('/:jobpostId').put(verifyToken, updateOneJobpost).delete(verifyToken, deleteOneJobpost);

module.exports = Router;
