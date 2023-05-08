const Address = require ('../models/Address');
exports.getAllAddress = async (req, res, next) => {
    try {
      const address = await Address.find().sort({'title':1});
      res.status(200).json(address);
      
    } catch (err) {
        next(err);
    }
  };

  // exports.createAAddress = async (req, res, next) => {
  //   try {
  //     const address = new Address(req.body)
  //     await address.save();
  //     res.status(200).json(address);
  //   } catch (err) {
  //     next(err);
  //   }
  // };