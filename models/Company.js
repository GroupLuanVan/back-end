const mongoose = require ('mongoose');

const companySchema = new mongoose.Schema({
    name: {
      type: String,

    },
    location: { type: String },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    foundingAt: {
      type: Date
    },
    introduce: {
      type: String
    },
    linkToLogo: {
      type: String
    },
    members: {
      type: String
    },



  },

  //createAt and updateAt
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
