const mongoose = require ('mongoose');
// const Jobpost = require ('./Jobpost.js');
// const Company = require ('./Company.js');
// const Candidate = require ('./Candidate.js');
// const Resume = require ('./Resume.js');
// const Workexp = require ('./Workexp.js');
// const Position = require ('./Position.js');


const contactSchema = new mongoose.Schema(
    {
        jobPostId: { type: mongoose.Schema.ObjectId, ref: "Jobpost", required: true },
        resumeId: {
          type: mongoose.Schema.ObjectId,
          ref: "Resume",
    
        },
        candidateId: {
          type: mongoose.Schema.ObjectId,
          ref: "Candidate",
          required: true,
        },
        recId: { type: mongoose.Schema.ObjectId, ref: "Company", required: true },
    
        process: {
          type: Number,
          enum: [1, 2, 3, 0],
          default: 1,
        },
        price: {
          type: Number
        },
}, {timestamps: true})

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;