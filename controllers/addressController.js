const Address = require ('../models/Address');
exports.getAllAddress = async (req, res, next) => {
    try {
      const address = await Address.find();
      res.status(200).json(address);
    } catch (err) {
        next(err);
    }
  };