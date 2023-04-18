const Jobcategory = require ('../models/Jobcategory');

exports.getAllJobcategory = async (req, res, next) => {
    try {
      const jobcategory = await Jobcategory.find();
      res.status(200).json(jobcategory);
    } catch (err) {
        next(err);
    }
  };

  exports.createAJobcategory = async (req, res, next) => {
    try {
      const jobcategory = new Jobcategory(req.body)
      await jobcategory.save();
      res.status(200).json(jobcategory);
    } catch (err) {
      next(err);
    }
  };

  exports.deleteJobcategory = async (req, res, next) => {
    try {
      const deletedCategory = await Jobcategory.findByIdAndDelete(req.params.id);
      if (deletedCategory == null)
        return res.status(404).json("Không tìm thấy loại công việc");

      return res.status(200).json("Loại công việc này đã được xóa");
    } catch (err) {
      console(err); 
      next(err);
    }
  };