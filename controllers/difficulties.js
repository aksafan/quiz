const Difficulty = require("../models/Difficulty");
const { parseValidationErrors, parseDuplicationErrors } = require("../utils");
const customErrorsConstants = require("../constants/customErrors");
const { ADMIN } = require("../constants/roles");
const CustomError = require("../errors");

const getAllDifficulties = async (req, res) => {
  const difficulties = await Difficulty.find(
    req.user.role === ADMIN ? {} : { userId: req.user._id },
  ).sort({ createdAt: -1 });

  return res.render("admin/difficulties/difficulties", { difficulties });
};

const getDifficulty = async (req, res) => {
  return res.render("admin/difficulties/difficulty", {
    difficulty: req.difficulty,
  });
};

const newDifficulty = async (req, res) => {
  res.render("admin/difficulties/new", { difficulty: null });
};

const createDifficulty = async (req, res, next) => {
  req.body.userId = req.user._id;

  try {
    const difficulty = await Difficulty.create(req.body);

    return res.redirect(`/admin/difficulties/${difficulty._id}`);
  } catch (e) {
    if (e.constructor.name === customErrorsConstants.VALIDATION_ERROR) {
      parseValidationErrors(e, req);
    } else if (e.code && e.code === 11000) {
      parseDuplicationErrors(e, req);
    } else {
      return next(e);
    }
    const difficulty = new Difficulty(req.body);

    return res.render("admin/difficulties/new", {
      errors: req.flash("error"),
      difficulty,
    });
  }
};

const editDifficulty = async (req, res) => {
  res.render("admin/difficulties/edit", { difficulty: req.difficulty });
};

const updateDifficulty = async (req, res, next) => {
  try {
    Object.assign(req.difficulty, req.body);

    await req.difficulty.validate();
    await req.difficulty.save();
  } catch (e) {
    if (e.constructor.name === customErrorsConstants.VALIDATION_ERROR) {
      parseValidationErrors(e, req);
    } else if (e.code && e.code === 11000) {
      parseDuplicationErrors(e, req);
    } else {
      return next(e);
    }

    return res.render("admin/difficulties/edit", {
      errors: req.flash("error"),
      difficulty: req.difficulty,
    });
  }

  return res.redirect(`/admin/difficulties/${req.difficulty._id}`);
};

const deleteDifficulty = async (req, res) => {
  const result = await req.difficulty.deleteOne();
  if (!result) {
    throw new CustomError.NotFoundError(
      `No difficulty with id ${req.params.id} was deleted`,
    );
  }

  return res.redirect(`/admin/difficulties`);
};

module.exports = {
  getAllDifficulties,
  getDifficulty,
  newDifficulty,
  createDifficulty,
  editDifficulty,
  updateDifficulty,
  deleteDifficulty,
};
