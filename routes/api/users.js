const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const createError = require("http-errors");

const { User, schemas } = require("../../models/user");
const { authentication, upload } = require("../../middlewares");
const { sendMail } = require("../../helpers");

const router = express.Router();

router.get("/verify/:verificationToken", async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw createError(404);
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: "",
    });
    res.json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
});

router.post("/verify", async (req, res, next) => {
  try {
    const { error } = schemas.varify.validate(req.body);
    if (error) {
      throw createError(400, "missing required field email");
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user.verify) {
      throw createError(400, "Verification has already been passed");
    }

    const mail = {
      to: email,
      subject: "Підтвердіть email",
      html: `<a target='_blank' href="http//localhost:3000/api/users/${user.verificationToken}">Підтвердіть адресу електронної пошти</a>`,
    };
    sendMail(mail);

    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
});

router.get("/current", authentication, async (req, res, next) => {
  res.json({ email: req.user.email });
});

router.get("/logout", authentication, async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).send();
});

const avatarsDir = path.join(__dirname, "../..", "public", "avatars");

router.patch(
  "/avatars",
  authentication,
  upload.single("avatar"),
  async (req, res, next) => {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;
    try {
      const [extention] = filename.split(".").reverse();
      const newFileName = `${_id}.${extention}`;
      const resultUpload = path.join(avatarsDir, newFileName);
      await fs.rename(tempUpload, resultUpload);
      const avatarURL = path.join("avatars", newFileName);
      await User.findByIdAndUpdate(_id, { avatarURL });
      res.json({ avatarURL });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
