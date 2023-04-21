const Contact = require ('../models/Contact');
const Jobpost = require ('../models/Jobpost');
const Candidate = require ('../models/Candidate');

// ----------------Lay tat ca cac contact (danh cho admin) ----------------------
exports.getAllContact = async (req, res, next) => {
    try {
      const contact = await Contact.find();
      res.status(200).json(contact);
    } catch (err) {
        next(err);
    }
  };

  //-------------------------Lay contact theo id bai dang (danh cho Recruiter/ danh sach ung vien theo tung bai dang)----------------------------------
  exports.getAllContactBaseOnPostId = async (req, res, next) => {
    try {
      const jobpost = await Jobpost.findById(req.params.id);
      const contact = await Contact.find({jobpostId: jobpost.id}).populate("candidateId");
      if (contact) res.status(200).json(contact);
      else 
        return res.status(400).json("Chưa có ai ứng tuyển bài viết của bạn");
    } catch (err) {
        next(err);
    }
  };

  //-------------------------Lay contact theo id Candidate (danh cho Candidate/ danh sach nhung bai dang da ung tuyen)----------------------------------
  exports.getAllContactBaseOnCandidatetId = async (req, res, next) => {
    try {
      const {userId} = req.user;
      const candidate = await Candidate.findOne({userId});
      const contact = await Contact.find({candidateId: candidate.id}).populate("jobpostId").populate("companyId");
      if (contact) res.status(200).json(contact);
      else 
        return res.status(400).json("Bạn chưa ứng tuyển công việc nào cả");
    } catch (err) {
        next(err);
    }
  };

