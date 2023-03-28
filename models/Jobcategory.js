const mongoose = require ('mongoose');

//loai cong viec (Back-end,...)
const jobcategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
  },

  { timestamps: true }
);

const Jobcategory = mongoose.model("Jobcategory", jobCategorySchema);
export default Jobcategory;
