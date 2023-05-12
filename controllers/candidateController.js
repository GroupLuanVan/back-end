const Candidate = require ('../models/Candidate');
const Resume = require ('../models/Resume');
const User = require ('../models/User');
const Jobpost = require ('../models/Jobpost');
const {filterSkipField} = require('../middlewares/common');


//-------------------------cap nhat / chinh sua thogn thin candidate-----------------------------------------
exports.updateCandidateInfo = async (req, res, next) => {
  try {
      //for candidate
  
  const { title, name, dob, gender, email, phone, addressId, fullAddress } = req.body;
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

  let profile = {
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

    const {userId} = req.user;
    console.log(userId);
    
    let updatedCandidate = await Candidate.findOneAndUpdate(
      { userId: userId },
      {$set: { ...candidateData}},
      { new: true }
    );
    // updatedCandidate = filterSkipField(updatedCandidate._doc, "_id");


    return res
      .status(200)
      .json({ updatedData: { updatedCandidate } });
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
    data: {jobpostId:jobpost.id, applyJobs: candidate3.applyJobs}
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
    const candidate3 = await Candidate.findOne({ userId: loggedUser.id })
    res.status(200).json({
      message: "Đã hủy ứng tuyển",
      data: {applyJobs: candidate3.applyJobs}
  });
  } catch (err) {
    console.log(err);
    next(err);
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

  //-------------------------chi tiet cong ty theo Id cong ty-----------------------
  exports.getOneCandidate = async (req, res, next) => {
    try {
      const candidate = await Candidate.findById(req.params.id);
      if(!candidate)return res.status(400).json("Ứng viên bạn đang tìm không tồn tại");
      res.status(200).json(candidate);
    } catch (err) {
        next(err);
    }
  };
//-----------------cap nhat thong tin cong ty---------------------------
  // exports.updateCandidateInfo = async (req, res, next) => {
  //   try {
  //     const {userId} = req.user;
  //     console.log(userId);
  //     const candidate = await Candidate.findOneAndUpdate(
  //       {userId: userId},
  //       { $set: { ...req.body } },
  //       { new: true }
  //     );
  //     res.status(200).json(candidate);
  //   } catch (err) {
  //       next(err);
  //   }
  // };