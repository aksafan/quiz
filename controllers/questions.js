const Question = require("../models/Question");
const Category = require("../models/Category");
const Difficulty = require("../models/Difficulty");
const { parseValidationErrors, checkPermissions } = require("../utils");
const validationError = require("../constants/errors");
const { ADMIN } = require("../constants/roles");
const CustomError = require("../errors");

const getAllQuestions = async (req, res) => {
  const questions = await Question.find(
    req.user.role === ADMIN ? {} : { userId: req.user._id },
  )
    .populate("categoryId", "name")
    .populate("difficultyId", "level")
    .sort({ createdAt: -1 });

  return res.render("admin/questions/questions", { questions });
};
const getQuestion = async (req, res) => {
  const question = await Question.findOne({ _id: req.params.id })
    .populate("categoryId", "name")
    .populate("difficultyId", "level");

  if (!question) {
    throw new CustomError.NotFoundError(`No question with id ${req.params.id}`);
  }
  checkPermissions(req.user, question.userId);

  return res.render("admin/questions/question", { question });
};

const newQuestion = async (req, res) => {
  const categories = await Category.find();
  const difficulties = await Difficulty.find();

  res.render("admin/questions/new", {
    question: null,
    categories,
    difficulties,
  });
};

const createQuestion = async (req, res, next) => {
  req.body.userId = req.user._id;

  try {
    const question = await Question.create(req.body);

    return res.redirect(`/admin/questions/${question._id}`);
  } catch (e) {
    if (e.constructor.name === validationError) {
      parseValidationErrors(e, req);
    } else {
      return next(e);
    }
    const question = new Question(req.body);
    const categories = await Category.find();
    const difficulties = await Difficulty.find();

    return res.render("admin/questions/new", {
      errors: req.flash("error"),
      question,
      categories,
      difficulties,
    });
  }
};

const editQuestion = async (req, res) => {
  const question = await Question.findById(req.params.id)
    .populate("categoryId", "name")
    .populate("difficultyId", "level");

  if (!question) {
    throw new CustomError.NotFoundError(`No question with id ${req.params.id}`);
  }
  checkPermissions(req.user, question.userId);

  const categories = await Category.find();
  const difficulties = await Difficulty.find();

  res.render("admin/questions/edit", {
    question,
    categories,
    difficulties,
  });
};

const updateQuestion = async (req, res, next) => {
  const question = await Question.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true, runValidators: true },
  );
  if (!question) {
    throw new CustomError.NotFoundError(`No question with id ${req.params.id}`);
  }
  checkPermissions(req.user, question.userId);

  try {
    await Question.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true },
    );
  } catch (e) {
    if (e.constructor.name === validationErrors.ERROR) {
      parseValidationErrors(e, req);
    } else {
      return next(e);
    }
    const categories = await Category.find();
    const difficulties = await Difficulty.find();

    return res.render("edit", {
      errors: req.flash("error"),
      question,
      categories,
      difficulties,
    });
  }

  return res.redirect(`/admin/questions${question._id}`);
};

const deleteQuestion = async (req, res) => {
  const question = await Question.findByIdAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!question) {
    throw new CustomError.NotFoundError(`No question with id ${req.user.id}`);
  }
  checkPermissions(req.user, question.userId);

  return res.redirect(`/admin/questions`);
};

module.exports = {
  getAllQuestions,
  getQuestion,
  newQuestion,
  createQuestion,
  editQuestion,
  updateQuestion,
  deleteQuestion,
};
