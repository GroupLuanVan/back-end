const express = require('express');
//import cac controller
const {updateCandidateProfile, createResume, getMyCV, applyJob,cancelapplyjob, getUserProfileCvData, getAllCandidate} = require('../controllers/candidateController.js');
const {verifyToken, verifyTokenAndAdminAuth} = require('../middlewares/verifyToken');
const candidateRouter = express.Router();




candidateRouter.route("/all").get( getAllCandidate);
candidateRouter.route("/:id/profile").put(verifyToken, verifyTokenAndAdminAuth, updateCandidateProfile);

candidateRouter.route("/resume/create").post( verifyToken, createResume)
candidateRouter.route("/resume/:id").get(verifyToken, getMyCV);

candidateRouter.route("/applyjob/:id").post( verifyToken, applyJob);
//cancel apply job
candidateRouter.route("/cancelapplyjob/:id").post(verifyToken, cancelapplyjob);

candidateRouter.route("/:id/getuserprofilecvdata").get( getUserProfileCvData);

module.exports = candidateRouter;
