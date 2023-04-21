const Candidate = require ('../models/Candidate');
const Resume = require ('../models/Resume');

// ----------------Lay tat ca cac CV (danh cho admin/ recruiter) ----------------------
exports.getAllResume = async (req, res, next) => {
    try {
      const resume = await Resume.find().populate("addressId");
      res.status(200).json(resume);
    } catch (err) {
        next(err);
    }
  };

//-----------------------Xem CV theo ID Resume (danh cho Recruiter)------------------------------------
exports.viewCV = async (req, res, next) => {
    try {
        let cvId = req.params.id;
        const cv = await Resume.findById(cvId).populate("addressId");
        if (!cv) {
            return res.status(400).json("CV này không tồn tại trên hệ thống");
        }
        res.status(200).json({ cv });
      } catch (e) {
        next(e);
    
      }
  };