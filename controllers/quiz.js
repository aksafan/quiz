const Question = require("../models/Question");
const Category = require("../models/Category");
const CustomError = require("../errors");
const quizService = require("../services/quizService");

const index = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  return res.render("quiz/index", { categories });
};

const getQuizHistory = async (req, res) => {
  throw new CustomError.CustomError(`History is not implemented yet`);
};

const startQuiz = async (req, res) => {
  const questions = await Question.find({
    categoryId: req.body.categoryId,
  }).limit(10);
  if (questions.length === 0) {
    throw new CustomError.NotFoundError(
      `No questions were found for this category. Try another one.`,
    );
  }

  return res.render("quiz/progress", {
    questions,
  });
};

const submitQuiz = async (req, res) => {
  try {
    const results = await quizService.processQuiz(req.body.answers);

    return res.render("quiz/results", results);
  } catch (error) {
    throw new CustomError.BadRequestError(
      `Error occurred while processing quiz`,
    );
  }
};

module.exports = {
  index,
  getQuizHistory,
  startQuiz,
  submitQuiz,
};
