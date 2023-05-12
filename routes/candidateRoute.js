const express = require('express');
//import cac controller
const {updateCandidateProfile, createResume, getMyCV, applyJob,cancelapplyjob, getOneCandidate, getAllCandidate, updateCandidateInfo} = require('../controllers/candidateController.js');
const {verifyToken, verifyTokenAndAdminAuth} = require('../middlewares/verifyToken');
const candidateRouter = express.Router();




candidateRouter.route("/all").get( getAllCandidate);

candidateRouter.route("/resume/create").post( verifyToken, createResume)

//hien thi CV
candidateRouter.route("/resume").get(verifyToken, getMyCV);

candidateRouter.route("/applyjob/:id").post( verifyToken, applyJob);

//cancel apply job
candidateRouter.route("/cancelapplyjob/:id").post(verifyToken, cancelapplyjob);

//---------------------------------------chi tiet cong ty (lay theo ID cong ty)---------------------
candidateRouter.route('/:id').get(getOneCandidate);
//---------------------------------------cap nhat/chinh sua thong tin chi tiet cong ty----------------------
candidateRouter.route('/updateinfo').post(verifyToken, updateCandidateInfo);

module.exports = candidateRouter;
