const Contact = require ('../models/Contact');
const Jobpost = require ('../models/Jobpost');
const Candidate = require ('../models/Candidate');

// ----------------Lay tat ca cac contact (danh cho admin) ----------------------
exports.getAllContact = async (req, res, next) => {
    try {
      const contact = await Contact.find().populate("jobpostId").populate("candidateId").populate("companyId");
      res.status(200).json(contact);
    } catch (err) {
        next(err);
    }
  };

  //-------------------------Lay contact theo id bai dang (danh cho Recruiter/ danh sach ung vien theo tung bai dang)----------------------------------
  exports.getAllContactBaseOnPostId = async (req, res, next) => {
    try {
      const jobpost = await Jobpost.findById(req.params.id);
      const contact = await Contact.find({jobpostId: jobpost.id}).populate("jobpostId").populate("candidateId").populate("companyId");
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
      const contact1 = await Contact.find({$and: [{candidateId: candidate.id, jobpostId: null}] }).populate("companyId");
      console.log(contact1);
      const contact2 = await Contact.find({$and: [{candidateId: candidate.id, jobpostId:{$ne: null}}]}).populate("jobpostId").populate("companyId");
      if (contact1 || contact2) res.status(200).json([
        {message: "Những bài viết đã bị xóa",
        data: contact1
        },
        {
        data: contact2
        }
      ]
        
      );
      else 
        return res.status(400).json("Bạn chưa ứng tuyển công việc nào cả");
    } catch (err) {
        next(err);
    }
  };

// -----------------------------------------xét duyệt ứng viên------------------------
exports.approvalCandidate = async (req, res, next) => {
  try {
    let contact = await Contact.findById(req.params.id);
    console.log(req.body.process);
    if(!contact) return res.status(400).json("Ứng viên này đã hủy đăng ký"); 
    if (req.body.process == 2) contact = await Contact.findByIdAndUpdate(req.params.id, {process: 2});
    if (req.body.process == 3) contact = await Contact.findByIdAndUpdate(req.params.id, {process: 3});
    
    res.status(200).json(contact);
  } catch (err) {
      next(err);
  }
};
