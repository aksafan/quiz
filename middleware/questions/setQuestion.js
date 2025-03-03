const Question = require("../../models/Question");
const CustomError = require("../../errors");

const setQuestion = async (req, res, next) => {
  try {
    const question = await Question.findOne({ _id: req.params.id })
      .populate("categoryId", "name")
      .populate("difficultyId", "level");

    if (!question) {
      throw new CustomError.NotFoundError(
        `No question with id ${req.params.id}`,
      );
    }

    req.question = question;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = setQuestion;
