const Candidate = require ('../models/Candidate');
const Resume = require ('../models/Resume');

exports.updateCandidateProfile = async (req, res, next) => {
  //for candidate
  const { avatar } = req.body;
  const { title, name, dob, gender, email, phone, addressId, fullAddress } =
    req.body;
  //for candidate.profile
  const {
    aboutMe,

    skills,
    objective,
    education,
    experience,
    activities,
    certifications,

    objectiveCv,
    educationCv,
    experienceCv,
    skillsCv,
    activitiesCv,
    certificationsCv,
  } = req.body;

  const profile = {
    aboutMe,

    objective,
    education,
    experience,
    skills,
    activities,
    certifications,

    objectiveCv,
    educationCv,
    experienceCv,
    skillsCv,
    activitiesCv,
    certificationsCv,
  };
  let candidateData = {
    title,
    name,
    dob,
    gender,
    email,
    phone,
    addressId,
    fullAddress,
    profile,
  };

  let loggedUserId = "";
  if (req.user) {
    loggedUserId = req.user.id;
  } else {
    const decodeTokenData = getDecodedTokenData(req);
    loggedUserId = decodeTokenData.id;
  }

  try {
    let avatarLink = "";
    if (gender == "Nam") {
      avatarLink =
        "https://res.cloudinary.com/djnekmzdf/image/upload/v1670878877/ifo/maledefault_fechep.jpg";
    } else {
      avatarLink =
        "https://res.cloudinary.com/djnekmzdf/image/upload/v1670878938/ifo/74182470-default-female-avatar-profile-picture-icon-grey-woman-photo-placeholder-vector-illustration_iu7kdj.webp";
    }
    if (avatar) {
      const upRs = await uploadImage(avatar, "ifo999");
      avatarLink = upRs.secure_url;
    }

    const loggedUser = await User.findById(loggedUserId);

    if (!loggedUser) {
      return next(createError(404, "Không tìm thấy ứng viên"));
    }

    let updatedCandidate = await Candidate.findOneAndUpdate(
      { userId: loggedUserId },
      {
        $set: { ...candidateData, avatar: avatarLink },
      },
      { new: true }
    );
    updatedCandidate = filterSkipField(updatedCandidate._doc, "_id");

    console.log({ ...loggedUser._doc, ...updatedCandidate });
    return res
      .status(200)
      .json({ updatedData: { ...loggedUser._doc, ...updatedCandidate } });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.createResume = async (req, res, next) => {
  try {
    let loggedUserId = req.user.id;

    let candidate = await Candidate.findOne({ userId: loggedUserId });

    const oldResume = await Resume.findOne({ candidateId: candidate._id });
    let savedResume;
    if (oldResume) {
      savedResume = await Resume.findOneAndUpdate(
        { candidateId: candidate._id },
        { $set: { ...req.body } },
        { new: true }
      );
    } else {
      let resumeToSave = new Resume({
        ...req.body,
        candidateId: candidate._id,
      });
      savedResume = await resumeToSave.save();
    }
    // let url = `${process.env.DJANGOSERVER}/updateCvsFile`;
    // const djg = await axios.get(url);
    // console.log("update db success...");
    //---

    await Candidate.findOneAndUpdate(
      { _id: candidate._id },
      {
        $set: { activatedCvId: savedResume._id },
      },
      { new: true }
    );

    res.status(200).json({ savedResumeId: savedResume._id });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.getMyCV = async (req, res, next) => {
  try {
    let loggedUserId = req.params.id;
    const candidate = await Candidate.findOne({ userId: loggedUserId });
    if (!candidate) {
      return next(createError(404, "Ứng viên không tồn tại trong hệ thống"));
    }

    const cv = await Resume.findOne({ candidateId: candidate.id });

    if (!cv || cv == undefined) {
      return next(createError(404, "Cv không tồn tại trong hệ thống"));
    }

    res.status(200).json({ cv });
  } catch (e) {
    next(e);
    // next(createError(400, "Tạo cv thất bại"));
  }
};

exports.applyJob = async (req, res, next) => {
  //create a contact

  try {
    //req: jobId, recId, resumeId, hrId
    const { jobId } = req.body;
    console.log(req.user);
    const loggedUser = await User.findById(req.user.id);
    if (!loggedUser) return next(createError(400, "Không tìm thấy user"));
    const job = await JobPost.findById(jobId);
    let candidate = await Candidate.findOneAndUpdate(
      { userId: loggedUser.id },
      { $push: { applyJobs: job._id } },
      { new: true }
    );

    const resume = await Resume.findOne({ candidateId: candidate.id });
    let contact;
    if (resume) {
      contact = await Contact.create({
        jobPostId: jobId,
        recId: job.recId,
        candidateId: candidate._id,
        resumeId: resume._id,
      });
    } else {
      contact = await Contact.create({
        jobPostId: jobId,
        recId: job.recId,
        candidateId: candidate._id,
      });
    }

    //

    res.status(200).json({ applyJobs: [...candidate.applyJobs] });
  } catch (err) {
    next(err);
  }
};
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


// hiển thị tất cả candidate
exports.getAllCandidate = async (req, res, next) => {
  try {
    const allCandidate = await Candidate.find();
    
    res.status(200).json(allCandidate);
  } catch (err) {
    console.log(err);
    next(err);
  }
}