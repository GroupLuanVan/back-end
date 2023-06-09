const mongoose = require ("mongoose");
const { Schema } = mongoose;
const profileSchema = mongoose.Schema({

    //FOR PROFILE 
    aboutMe: String,

    objective: String,
    education: String,
    experience: String,
    skills: String,
    activities: String,
    certifications: String,

    //FOR CV
    objectiveCv: String,
    educationCv: String,
    experienceCv: String,
    skillsCv: String,
    activitiesCv: String,
    certificationsCv: String,


});


const candidateSchema = new Schema(
    //cap nhat thong tin candidate chinh la capnhatprofile
    //voi mot so truong la contact, mot so truong thuoc ve profile
    //rieng dia chi thi se luu duoi dang khoa ngoai toi bang address
    {
    title: String,
    //contact info
    nameCandidate: {type: String, trim: true, required: [true, 'Tên người dùng không được để trống']},
    dob: Date,
    
    gender: {
      type: String,
      enum: ["Nam", "Nữ"],
    },
    avatarLink: String,
    email: String,
    phone: String,
    addressId: {
        type: mongoose.Schema.ObjectId,
        ref: "Address"
    },

    fullAddress: String,

    avatar: String,

    profile: {
        type: profileSchema
    },

    activatedCvId: {
      type: String,
      default: ""
    },
    resumeId: { type: mongoose.Schema.ObjectId, ref: "Resume" },
    applyJobs: [{ type: mongoose.Schema.ObjectId, ref: "Jobpost" }],

    //one to one
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
  },
  { timestamps: true }
  //createAt and updateAt
);

const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate;
