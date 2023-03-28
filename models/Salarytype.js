const mongoose = require ('mongoose');

    //muc luong ( thoa thuan, trong khoan)
const salarytypeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },

  { timestamps: true }
);

const Salarytype = mongoose.model("Salarytype", salarytypeSchema);
module.exports = Salarytype;