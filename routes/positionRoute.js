const express = require('express');

const {getAllPosition, deletePosition, createAPosition} = require('../controllers/positionController.js');
const {verifyToken, checkAdmin, verifyTokenAndAdminAuth} = require('../middlewares/verifyToken');

const positionRouter = express.Router();


positionRouter.route('/').get(getAllPosition).post(verifyToken, checkAdmin, createAPosition);
positionRouter.route('/:id').delete(verifyToken, verifyTokenAndAdminAuth, deletePosition);

module.exports = positionRouter;