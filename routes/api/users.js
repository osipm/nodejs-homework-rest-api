const express = require("express");

const { User } = require("../../models/user");
const { authentication } = require("../../middlewares/index");

const router = express.Router();

router.get("/current", authentication, async (req, res, next) => {
  res.json({ email: req.user.email });
});

router.get("/logout", authentication, async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).send();
});

module.exports = router;

// authentication
