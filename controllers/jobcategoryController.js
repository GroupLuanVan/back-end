const Jobcategory = require ('../models/Jobcategory');
exports.getAllJobcategory = async (req, res, next) => {
    try {
      const jobcategory = await Jobcategory.find();
      res.status(200).json(jobcategory);
    } catch (err) {
        next(err);
    }
  };