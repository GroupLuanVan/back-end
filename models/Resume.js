const mongoose = require('mongoose');
const Address = require ('./Address.js');

const resumeSchema = new mongoose.Schema(
  {
    activities: String,
    activitiesCv: String,
    addressId: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
      required: true
    },
    avatar: String,
    certifications: String,
    certificationsCv: String,
    dob: String,
    educationCv: String,
    email: String,
    experience: String,
    experienceCv: String,
    fulladdress: String,
    gender: {type: String, enum: ["Nam", "Nữ"]},
    name: String,
    objective: String,
    objectiveCv: String,
    phone: String,
    skills: String,
    skillsCv: String,
    title: String,


    candidateId: {
      type: mongoose.Schema.ObjectId,
      ref: "candidates",
      required: true
    },
    cvTemplate: {
      type: String,
      default: "CV1"
    }

  },

  //createAt and updateAt
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);
module.exports = Resume;


