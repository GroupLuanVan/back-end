const Position = require ('../models/Position');
const Jobcategory = require ('../models/Jobcategory');

exports.getAllPosition = async (req, res, next) => {
    try {
      const position = await Position.find();
      res.status(200).json(position);
    } catch (err) {
        next(err);
    }
  };
  
exports.getAllJobcategory = async (req, res, next) => {
    try {
      const jobcategory = await Jobcategory.find();
      res.status(200).json(jobcategory);
    } catch (err) {
        next(err);
    }
  };
  