const { User } = require("../../models");
const createError = require("http-errors");

const verifyEmail = async (req, res) => {
  // get verificationToken from params
  const { verificationToken } = req.params;

  // find a user by verificationToken
  const user = await User.findOne({ verificationToken });

  // throw an error if can't find a user with this verificationToken
  if (!user) {
    throw new createError.NotFound("User is not found");
  }
  // if user is found, update database by setting verificationToken: null and verified: true
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({
    status: "success",
    code: 200,
    message: "Verification is successful",
  });
};

module.exports = verifyEmail;
