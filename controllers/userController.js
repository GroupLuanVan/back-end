const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Company = require('../models/Company');

//GET ALL USER (trừ admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });
    res.status(200).json(users);
  } catch (err) {
      next(err);
  }
};

//DELETE USER

exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser === null)
    return res.status(404).json("Không tìm thấy user rồi");

    if (deletedUser.role !== "admin") {
      try {
        if (deletedUser.role === "candidate") {
          let deletedCandidate = await Candidate.deleteOne({
            userId: req.params.id,
          });
        } else if (deletedUser.role === "recruiter") {
          let deletedRecruiter = await Recruiter.deleteOne({
            userId: req.params.id,
          });
        }
      } catch (e) {
        next(e);
      }
    }

    return res.status(200).json("Người dùng này đã được xóa");
  } catch (err) {
    next(err);
  }
};