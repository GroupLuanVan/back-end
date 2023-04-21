const express = require('express');

const {getAllResume, viewCV } = require('../controllers/resumeController.js');
const {verifyToken, checkAdmin} = require('../middlewares/verifyToken');

const resumeRouter = express.Router();

// ----------------Lay tat ca cac contact (danh cho admin) ----------------------
resumeRouter.route('/all').get(verifyToken, getAllResume);

//-----------------------Xem CV theo ID Resume (danh cho Recruiter)------------------------------------
resumeRouter.route('/viewcv/:id').get(verifyToken, viewCV);

module.exports = resumeRouter;