const express = require('express');
//import cac controller
const {updateCandidateProfile, createResume, getMyCV, applyJob,cancelapplyjob, getUserProfileCvData, getAllCandidate} = require('../controllers/candidateController.js');
const {verifyToken, verifyTokenAndAdminAuth} = require('../middlewares/verifyToken');
const candidateRouter = express.Router();




candidateRouter.route("/all").get( getAllCandidate);
candidateRouter.route("/:id/profile").put(verifyTokenAndAdminAuth, updateCandidateProfile);
candidateRouter.route("/:id/resume").post( createResume).get(verifyToken, getMyCV);
candidateRouter.route("/applyjob/:id").post( verifyToken, applyJob);
candidateRouter.route("/:id/cancelapplyjob").post( verifyTokenAndAdminAuth, cancelapplyjob);
candidateRouter.route("/:id/getuserprofilecvdata").get( getUserProfileCvData);

module.exports = candidateRouter;
