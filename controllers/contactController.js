const Contact = require ('../models/Contact');


exports.getAllContact = async (req, res, next) => {
    try {
      const contact = await Contact.find();
      res.status(200).json(contact);
    } catch (err) {
        next(err);
    }
  };