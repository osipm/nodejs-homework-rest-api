const { Schema, model } = require("mongoose");
const Joi = require("joi");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
      match: emailRegexp,
    },
    password: {
      type: String,
      require: true,
      minLength: 6,
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

const registerJoiSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const User = model("user", userSchema);
const schemas = {
  register: registerJoiSchema,
};
module.exports = {
  User,
  schemas,
};
