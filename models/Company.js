const mongoose = require ('mongoose');

const companySchema = new mongoose.Schema({
  userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
  email: { type: String, required: true },
  nameCompany: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },

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
