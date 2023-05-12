const express = require('express');

const {getAllCompany, getOneCompany, updateCompanyInfo} = require('../controllers/companyController.js');
const {verifyToken, checkAdmin} = require('../middlewares/verifyToken');
const companyRouter = express.Router();


companyRouter.route('/').get(getAllCompany);
//---------------------------------------chi tiet cong ty (lay theo ID cong ty)---------------------
companyRouter.route('/:id').get(getOneCompany);
//---------------------------------------cap nhat/chinh sua thong tin chi tiet cong ty----------------------
companyRouter.route('/updateinfo').post(verifyToken, updateCompanyInfo);
module.exports = companyRouter;