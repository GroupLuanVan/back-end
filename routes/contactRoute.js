const express = require('express');

const {getAllContact, } = require('../controllers/contactController.js');
const {verifyToken, checkAdmin} = require('../middlewares/verifyToken');

const contactRouter = express.Router();

contactRouter.use(verifyToken);
contactRouter.use(checkAdmin);
contactRouter.route('/').get(getAllContact);


module.exports = contactRouter;