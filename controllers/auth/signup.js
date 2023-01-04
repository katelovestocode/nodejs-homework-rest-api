const { User } = require("../../models");
const { joiRegistrationSchema } = require("../../models");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const { v4 } = require("uuid");
const sendEmail = require("../../services/sendgrid");

const signup = async (req, res, next) => {
  try {
    // check input thr Joi validation
    const { error } = joiRegistrationSchema.validate(req.body);
    if (error) {
      error.status = 400;
      throw error;
    }

    const { email, password, subscription } = req.body;

    // check if email is already in the database
    const user = await User.findOne({ email });
    if (user) {
      throw new createError.Conflict(`This ${email} email in use`);
    }

    // create verificationToken using uuid
    const verificationToken = v4();

    // set hashPassword using bcrypt
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // get a random avatar when a new user signup
    const avatarURL = gravatar.url(email);

    // save email, hashed password, subscription and avatar URL, verificationToken into database:
    User.create({
      email,
      password: hashPassword,
      subscription,
      avatarURL,
      verificationToken,
    });

    // OR OPTION#2 Set hash password via methods in Schema
    // const newUser = new User({ email, password, subscription });
    // newUser.setPassword(password);
    // /* newUser = {
    //     email,
    //     subscription,
    //     password,
    //     setPassword(password){
    //     this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    //     }
    // } */
    // newUser.save();

    // create body of the verification email to confirm email
    const mail = {
      to: email,
      subject: "Confirmation of the registration",
      html: `<a target=_blank href="http://localhost:3000/users/verify/${verificationToken}">Confirm your email</a>`,
    };

    // send email to confirm email once the user is created
    await sendEmail(mail);

    // Postman
    res.status(201).json({
      status: "success",
      code: 201,
      user: {
        result: {
          email,
          password,
          subscription,
          verificationToken,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = signup;
