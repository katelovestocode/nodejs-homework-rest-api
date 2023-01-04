const { reVerificationSchema } = require("../../models");
const createError = require("http-errors");
const { User } = require("../../models");
const sendEmail = require("../../services/sendgrid");

const reVerificationEmail = async (req, res, next) => {
  try {
    // validate body of the request via Joi schema
    const { error } = reVerificationSchema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }

    const { email } = req.body;

    // find a user with this email in database
    const user = await User.findOne({ email });

    if (!user) {
      throw new createError.NotFound(`User with this email is not found`);
    }

    // if user.verify is true, throw an error that it has been already verified
    if (user.verify) {
      throw new createError.BadRequest(`Verification has already been passed`);
    }

    // otherwise create an email letter
    const mail = {
      to: email,
      subject: "Confirmation of the registration",
      html: `<a target=_blank href="http://localhost:3000/users/verify/${user.verificationToken}">Confirm your email</a>`,
    };

    // resend an email letter to verify email address
    await sendEmail(mail);

    res.json({
      status: "success",
      code: 200,
      message: "Verification email resent",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = reVerificationEmail;
