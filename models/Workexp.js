const mongoose = require ('mongoose');

//kinh nghiem lam viec
const workexpSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },

  { timestamps: true }
);

const Workexp = mongoose.model("Salarytype", workexppeSchema);
module.exports = Workexp;