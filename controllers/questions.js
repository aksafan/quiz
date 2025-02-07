const Question = require("../models/Question");
const Category = require("../models/Category");
const Difficulty = require("../models/Difficulty");
const validationErrorsParser = require("../utils/parseValidationErrs");
const validationError = require("../constants/validationError");

const getAllQuestions = async (req, res) => {
  const questions = await Question.find({ userId: req.user._id })
    .populate("categoryId", "name")
    .populate("difficultyId", "level")
    .sort({ createdAt: -1 });

  return res.render("questions", { questions });
};
const getQuestion = async (req, res) => {
  const question = await Question.findOne({
    _id: req.params.id,
    userId: req.user._id,
  })
    .populate("categoryId", "name")
    .populate("difficultyId", "level");

  if (!question) {
    throw new Error(`No question with id ${req.params.id}`);
  }

  return res.render("questionDetail", { question });
};

const newQuestion = async (req, res) => {
  const categories = await Category.find();
  const difficulties = await Difficulty.find();

  res.render("question", { question: null, categories, difficulties });
};

const createQuestion = async (req, res, next) => {
  req.body.userId = req.user._id;

  try {
    const question = await Question.create(req.body);

    return res.redirect(`/admin/questions/${question._id}`);
  } catch (e) {
    if (e.constructor.name === validationError) {
      validationErrorsParser(e, req);
    } else {
      return next(e);
    }
    const question = new Question(req.body);
    const categories = await Category.find();
    const difficulties = await Difficulty.find();

    return res.render("question", {
      errors: req.flash("error"),
      question: question,
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
    throw new Error(`No question with id ${req.params.id}`);
  }

  const categories = await Category.find();
  const difficulties = await Difficulty.find();

  res.render("question", { question, categories, difficulties });
};

const updateQuestion = async (req, res, next) => {
  const question = await Question.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true },
  );

  try {
    const question = await Question.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true },
    );
  } catch (e) {
    if (e.constructor.name === validationErrors.ERROR) {
      validationErrorsParser(e, req);
    } else {
      return next(e);
    }
    const categories = await Category.find();
    const difficulties = await Difficulty.find();

    return res.render("question", {
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
    throw new Error(`No question with id ${req.user.id}`);
  }

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
