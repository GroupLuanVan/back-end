const Candidate = require ('../models/Candidate');
const Resume = require ('../models/Resume');
const User = require ('../models/User');
const Jobpost = require ('../models/Jobpost');
const Contact = require ('../models/Contact');

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

//---------------------------------------------Tao CV---------------------------------
exports.createResume = async (req, res, next) => {
  try {
    console.log(req.user);
    const {userId} = req.user;
    console.log(userId);
    let candidate = await Candidate.findOne({userId});
    console.log(candidate.id)
    const oldResume = await Resume.findOne({candidateId: candidate.id} );
    console.log(oldResume)
    let savedResume;
    if (oldResume) {
      savedResume = await Resume.findOneAndUpdate(
        { candidateId: candidate.id },
        { $set: { ...req.body } },
        { new: true }
      );
    } else {
      let resumeToSave = new Resume({
        ...req.body,
        candidateId: candidate.id,
      });
      savedResume = await resumeToSave.save();
    }
    
    await Candidate.findOneAndUpdate(
      { _id: candidate.id },
      {
        $set: { activatedCvId: savedResume.id },
      },
      { new: true }
    );

    res.status(200).json({ savedResumeId: savedResume.id });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

//----------------------------------------------------------------Hien thi CV-------------------------------------------------
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

//--------------------------------------------------------------Ung tuyen bai dang tuyen dung--------------------------------
exports.applyJob = async (req, res, next) => {
try {
  const jobpost = await Jobpost.findById(req.params.id);
  // console.log(req.user);
  const {userId} = req.user;
  const loggedUser = await User.findById(userId);  
  if (!loggedUser) return res.status(400).json("Không tìm thấy người dùng");
  
  const candidate = await Candidate.findOneAndUpdate(
    userId ,
    { $push: { applyJobs: jobpost.id } },
    
  );
  // console.log(candidate);

  const resume = await Resume.findOne(candidate._id );
  if (resume) {
    const newcontact = await Contact.create({
      jobpostId: jobpost.id,
      companycId: jobpost.companyId,
      candidateId: candidate._id,
      resumeId: resume._id,
    })
  } else {
    const newcontact = await Contact.create({
      jobpostId: jobpost.id,
      companyId: jobpost.companyId,
      candidateId: candidate._id,
    });
  }
  console.log(candidate);
  res.status(200).json({
    message: "Đã ứng tuyển",
    applyJobs: [candidate.applyJobs] 
  }
    );
} catch (err) {
  console.log(err);
  next(err);
}
};

//--------------------------------------------------------------------------Huy ung tuyen-----------------------------------------------------
exports.cancelapplyjob = async (req, res, next) => {
  //create a contact
  try {
    //req: jobId, companyId, resumeId, userId
    const jobpost = await Jobpost.findById(req.params.id);
    console.log(req.params.id);
    console.log(req.user);
    
    const {userId} = req.user;
    const loggedUser = await User.findById(userId);  
    if (!loggedUser) return res.status(400).json("Không tìm thấy người dùng");

    const candidate = await Candidate.findOneAndUpdate(
      { userId: loggedUser.id },
      { $pull: { applyJobs: jobpost.id } },
      { new: true }
    );
    console.log(candidate);
    //find and remove contact
    await Contact.deleteOne({
      candidateId: candidate.id,
      jobpostId: jobpost.id,
    });
    res.status(200).json("Đã hủy ứng tuyển");
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