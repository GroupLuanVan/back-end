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

    res.status(200).json({ savedResumeId: savedResume.id , message: "Tạo CV thành công"});
  } catch (e) {
    console.log(e);
    next(e);
  }
};

//----------------------------------------------------------------Hien thi CV-------------------------------------------------
exports.getMyCV = async (req, res, next) => {
  try {
    const {userId} = req.user;
    const candidate = await Candidate.findOne({userId});
    if (!candidate) {
      return res.status(400).json("Không tìm thấy người dùng");
    }

    const cv = await Resume.findOne({ candidateId: candidate.id }).populate("addressId");

    if (!cv || cv == undefined) {
      return res.status(400).json("Chưa tạo CV");
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
  // console.log(jobpost.id); 
  const {userId} = req.user;
  const candidate = await Candidate.findOne({userId});
  
  const contact = await Contact.findOne({$and: [{candidateId: candidate.id, jobpostId: jobpost.id}] });
  if(contact) return res.status(400).json({message: "Đã ứng tuyển vào bài đăng này", data: contact});;
  const candidate2 = await Candidate.findOneAndUpdate(
    {userId} ,
    { $push: { applyJobs: jobpost.id } },
    
  );
  const candidate3 = await Candidate.findOne({userId})
  // console.log(candidate2);
  const resume = await Resume.findOne({candidateId: candidate.id });
  if (resume) {
    const newcontact = await Contact.create({
      jobpostId: jobpost.id,
      companyId: jobpost.companyId,
      candidateId: candidate._id,
      resumeId: resume._id
      
    })
  } else {
    const newcontact = await Contact.create({
      jobpostId: jobpost.id,
      companyId: jobpost.companyId,
      candidateId: candidate.id
      
    });
  }

  res.status(200).json({
    message: "Ứng tuyển thành công",
    data: {jobpostId:jobpost.id, applyJobs: [candidate3.applyJobs]}
  }
    );
} catch (err) {
  console.log(err);
  next(err);
}
};

//--------------------------------------------------------------------------Huy ung tuyen-----------------------------------------------------
exports.cancelapplyjob = async (req, res, next) => {
  //delete a contact
  try {
    
    const contact = await Contact.findById(req.params.id);
    const jobpost = await Jobpost.findById(contact.jobpostId);
    console.log(contact._id);
    const loggedUser = await User.findById(req.user.userId);  
    if (!loggedUser) return res.status(400).json("Không tìm thấy người dùng");

    
    if (!contact) return res.status(200).json("Bạn chưa ứng tuyển vào công việc này"); 
    
    //find and remove contact
    await Contact.findByIdAndDelete(
      contact._id
    );
    const candidate = await Candidate.findOneAndUpdate(
      { userId: loggedUser.id },
      { $pull: { applyJobs: jobpost.id } },
      { new: true }
    );
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


//----------------------------------------------------hiển thị tất cả candidate------------------------------------------------
exports.getAllCandidate = async (req, res, next) => {
  try {
    const allCandidate = await Candidate.find();
    
    res.status(200).json(allCandidate);
  } catch (err) {
    console.log(err);
    next(err);
  }
}