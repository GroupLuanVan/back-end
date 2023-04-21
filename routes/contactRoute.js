const express = require('express');

const {getAllContact, getAllContactBaseOnPostId, getAllContactBaseOnCandidatetId} = require('../controllers/contactController.js');
const {verifyToken, checkAdmin} = require('../middlewares/verifyToken');

const contactRouter = express.Router();

// ----------------Lay tat ca cac contact (danh cho admin) ----------------------
contactRouter.route('/').get(verifyToken, checkAdmin, getAllContact);

//---------------Lay contact theo id bai dang (danh cho Recruiter) (danh sach ung tuyen/ candidate list)----------------------------------
contactRouter.route('/candidatelist/:id').get(verifyToken, getAllContactBaseOnPostId);

//-------------------------Lay contact theo id Candidate (danh cho Candidate) (danh sach nhung bai dang da ung tuyen/ apply list)----------------------------------
contactRouter.route('/applylist').get(verifyToken, getAllContactBaseOnCandidatetId);

module.exports = contactRouter;