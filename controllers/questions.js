const Question = require("../models/Question");
const Category = require("../models/Category");
const Difficulty = require("../models/Difficulty");
const { parseValidationErrors } = require("../utils");
const customErrorsConstants = require("../constants/customErrors");
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
  return res.render("admin/questions/question", { question: req.question });
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
    if (e.constructor.name === customErrorsConstants.VALIDATION_ERROR) {
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
  const categories = await Category.find();
  const difficulties = await Difficulty.find();

  res.render("admin/questions/edit", {
    question: req.question,
    categories,
    difficulties,
  });
};

const updateQuestion = async (req, res, next) => {
  try {
    Object.assign(req.question, req.body);

    await req.question.validate();
    await req.question.save();
  } catch (e) {
    if (e.constructor.name === customErrorsConstants.VALIDATION_ERROR) {
      parseValidationErrors(e, req);
    } else {
      return next(e);
    }
    const categories = await Category.find();
    const difficulties = await Difficulty.find();

    return res.render("admin/questions/edit", {
      errors: req.flash("error"),
      question: req.question,
      categories,
      difficulties,
    });
  }

  return res.redirect(`/admin/questions/${req.question._id}`);
};

const deleteQuestion = async (req, res) => {
  const result = await req.question.deleteOne();
  if (!result) {
    throw new CustomError.NotFoundError(
      `No question with id ${req.params.id} was deleted`,
    );
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
