const { Schema, model } = require("mongoose");
const joi = require("joi");
const Joi = require("joi");
const contactSchema = Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const joiContactsShema = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  phone: joi.string().required(),
  favorite: Joi.boolean(),
});

const joiContactsFavoriteShema = Joi.object({
  favorite: Joi.boolean().required(),
});

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  schemas: {
    add: joiContactsShema,
    updateFavorite: joiContactsFavoriteShema,
  },
};
