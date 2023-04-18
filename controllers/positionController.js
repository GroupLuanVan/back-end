const Position = require ('../models/Position');


exports.getAllPosition = async (req, res, next) => {
    try {
      const position = await Position.find();
      res.status(200).json(position);
    } catch (err) {
        next(err);
    }
  };

  exports.createAPosition = async (req, res, next) => {
    try {
      const position = new Position(req.body)
      await position.save();
      res.status(200).json(position);
    } catch (err) {
      next(err);
    }
  };

  exports.deletePosition = async (req, res, next) => {
    try {
      const deletedPosition = await Position.findByIdAndDelete(req.params.id);
      if (deletedPosition == null)
        return res.status(404).json("Không tìm thấy vị trí công việc");

      return res.status(200).json("Vị trí công việc này đã được xóa");
    } catch (err) {
      console(err); 
      next(err);
    }
  };