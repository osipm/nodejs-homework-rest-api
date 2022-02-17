const express = require("express");
const { User, schemas } = require("../../models/user");
const CreateError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { v4 } = require("uuid");

const router = express.Router();
const sendMail = require("../../helpers");

const { SECRET_KEY } = process.env;

router.post("/signup", async (req, res, next) => {
  try {
    const { error } = schemas.register.validate(req.body);
    if (error) {
      throw new CreateError(400, error.message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw new CreateError(409, "Email in use");
    }
    const solt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, solt);
    const avatarURL = gravatar.url(email);
    const verificationToken = v4();
    await User.create({
      email,
      password: hashPassword,
      verificationToken,
      avatarURL,
    });
    const mail = {
      to: email,
      subject: "Підтвердіть email",
      html: `<a target='_blank' href="http//localhost:3000/api/users/${verificationToken}">Підтвердіть адресу електронної пошти</a>`,
    };

    await sendMail(mail);

    res.status(201).json({
      user: {
        email,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { error } = schemas.register.validate(req.body);
    if (error) {
      throw new CreateError(400, error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new CreateError(401, "Email or password is wrong");
    }

    if (!user.verify) {
      throw new CreateError(401, "Email not verify");
    }

    const compareResult = await bcrypt.compare(password, user.password);
    if (!compareResult) {
      throw new CreateError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: { email },
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
