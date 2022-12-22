const { Contact } = require("../../models");

const getAllContacts = async (req, res, next) => {
  try {
    const { _id } = req.user;

    // Pagination
    const { page = 1, limit = 15 } = req.query;
    const skip = (page - 1) * limit;

    const contacts = await Contact.find({ owner: _id }, "", {
      skip,
      limit: Number(limit),
    }).populate("owner", "_id, name, email");

    res.json({
      status: "success",
      code: 200,
      contacts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllContacts;
