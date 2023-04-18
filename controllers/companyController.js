const Company = require ('../models/Company');
exports.getAllCompany = async (req, res, next) => {
    try {
      const company = await Company.find();
      res.status(200).json(company);
    } catch (err) {
        next(err);
    }
  };