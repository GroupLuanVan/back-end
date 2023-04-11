const express = require('express');
//import cac controller
const {getAllUsers, deleteUser } = require('../controllers/userController.js');

const userRouter = express.Router();
const {verifyToken, checkAdmin, verifyTokenAndAdminAuth} = require('../middlewares/verifyToken');

userRouter.route('/').get(verifyToken, checkAdmin, getAllUsers);
userRouter.route('/:id').delete(verifyToken, verifyTokenAndAdminAuth, deleteUser);


module.exports = userRouter;