const Category = require("../../models/Category");
const CustomError = require("../../errors");

const setCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    if (!category) {
      throw new CustomError.NotFoundError(
        `No category with id ${req.params.id}`,
      );
    }

    req.category = category;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = setCategory;
