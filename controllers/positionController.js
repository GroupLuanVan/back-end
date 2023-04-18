const Position = require ('../models/Position');


exports.getAllPosition = async (req, res, next) => {
    try {
      const position = await Position.find();
      res.status(200).json(position);
    } catch (err) {
        next(err);
    }
  };