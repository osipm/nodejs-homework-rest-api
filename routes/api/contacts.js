const express = require("express");
const CreateError = require("http-errors");

const { Contact, schemas } = require("../../models/contact");

const { authentication } = require("../../middlewares");

const router = express.Router();

router.get("/", authentication, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { _id } = req.user;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner: _id }, "", {
      skip,
      limit: +limit,
    }).populate("owner", "email");
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw new CreateError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    if (error.message.includes("Cast to ObjectId failed")) {
      error.status = 400;
    }
    next(error);
  }
});

router.post("/", authentication, async (req, res, next) => {
  try {
    const { error } = schemas.add.validate(req.body);
    if (error) {
      throw new CreateError(400, error.massege);
    }
    const data = { ...req.body, owner: req.user._id };
    const result = await Contact.create(data);
    res.status(201).json(result);
  } catch (error) {
    if (error.message.includes("validation failed")) {
      error.status = 400;
    }
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
      throw new CreateError(404, "Not found");
    }
    res.json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const { error } = schemas.updateFavorite.validate(req.body);
    if (error) {
      throw new CreateError(400, "missing field favorite");
    }
    const { contactId } = req.params;

    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw new CreateError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = schemas.add.validate(req.body);
    if (error) {
      throw new CreateError(400, error.massege);
    }
    const { contactId } = req.params;

    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw new CreateError(404, "Not found");
    }
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
