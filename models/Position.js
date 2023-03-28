const mongoose = require ('mongoose');

  //vi tri lam viec (fresher, intern,... )
const positionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },

  { timestamps: true }
);

const Position = mongoose.model("Position", positionSchema);
module.exports = Position;