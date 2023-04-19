const Candidate = require ('../models/Candidate');

exports.cancelapplyjob = async (req, res, next) => {
    //create a contact
  try {
    //req: jobId, recId, resumeId, hrId
    const { jobId } = req.body;
    console.log(req.user);
    const loggedUser = await User.findById(req.user.id);
    if (!loggedUser) return next(createError(400, "Không tìm thấy user"));

    let candidate = await Candidate.findOneAndUpdate(
      { userId: loggedUser.id },
      { $pull: { applyJobs: jobId } },
      { new: true }
    );
    //find and remove contact
    await Contact.deleteOne({
      candidateId: candidate._id,
      jobPostId: jobId._id,
    });
    res.status(200).json({ applyJobs: [...candidate.applyJobs] });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
  
exports.getUserProfileCvData = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user === null) return next(createError(404, "Khong tim thay User"));
    let userDetail = {};
    let candidate = await Candidate.findOne({ userId: user._id });
    let candidateProfile = candidate.profile;

    if (candidateProfile) {
      candidate = filterSkipField(candidate._doc, "profile");
      candidateProfile = filterSkipField(candidateProfile._doc, "_id");
      userDetail = { ...candidate, ...candidateProfile };
    } else {
      userDetail = { ...candidate };
    }
    res.status(200).json({ ...user._doc, ...userDetail });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const allCandidate = await Candidate.find();

    res.status(200).json(allCandidate);
  } catch (err) {
    next(err);
  }
}