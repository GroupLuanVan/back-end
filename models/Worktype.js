const mongoose = require ('mongoose');

    //hinh thuc lam viec (toan thoi gian, ban thoi gian)
const worktypeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },

  { timestamps: true }
);

const Worktype = mongoose.model("Worktype", worktypeSchema);
module.exports = Worktype;