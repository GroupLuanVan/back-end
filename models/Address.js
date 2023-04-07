const mongoose = require ('mongoose');
//tim bang ID

const addressSchema = new mongoose.Schema(
  {
    title: String,
   
  },
  { timestamps: true }
  //createAt and updateAt
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;