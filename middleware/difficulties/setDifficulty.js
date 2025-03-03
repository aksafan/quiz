const Difficulty = require("../../models/Difficulty");
const CustomError = require("../../errors");

const setDifficulty = async (req, res, next) => {
  try {
    const difficulty = await Difficulty.findOne({ _id: req.params.id });
    if (!difficulty) {
      throw new CustomError.NotFoundError(
        `No difficulty with id ${req.params.id}`,
      );
    }

    req.difficulty = difficulty;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = setDifficulty;
