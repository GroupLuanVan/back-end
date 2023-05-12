const Company = require ('../models/Company');
exports.getAllCompany = async (req, res, next) => {
    try {
      const company = await Company.find();
      res.status(200).json(company);
    } catch (err) {
        next(err);
    }
  };

  //-------------------------chi tiet cong ty theo Id cong ty-----------------------
  exports.getOneCompany = async (req, res, next) => {
    try {
      
      const company = await Company.findById(req.params.id);
      if(!company)return res.status(400).json("Công ty bạn đang tìm không tồn tại");
      res.status(200).json(company);
    } catch (err) {
        next(err);
    }
  };
//-----------------cap nhat thong tin cong ty---------------------------
  exports.updateCompanyInfo = async (req, res, next) => {
    try {
      const {userId} = req.user;
      console.log(userId);
      const company = await Company.findOneAndUpdate(
        {userId: userId},
        { $set: { ...req.body } },
        { new: true }
      );
      res.status(200).json(company);
    } catch (err) {
        next(err);
    }
  };