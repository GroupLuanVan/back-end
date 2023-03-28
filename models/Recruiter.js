const mongoose = require('mongoose');
const Resume = require('./Resume.js');




const recruiterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },

    avatar: { type: String },
    saveCvs: [{
      type: mongoose.Schema.ObjectId,
      ref: "Resume"
    }],

    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",

    },

    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true
    },


  },
  { timestamps: true }
);

const Recruiter = mongoose.model("Recruiter", recruiterSchema);
module.exports = Recruiter;
