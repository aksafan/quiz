const CustomError = require("../errors");
const mongoose = require("mongoose");

const setEntity = async (entity, req, res, next) => {
  try {
    const Model =
      mongoose.models[entity.charAt(0).toUpperCase() + entity.slice(1)];
    if (!Model) {
      throw new CustomError.CustomError(`Invalid entity: ${entity}`);
    }

    const entityObject = await Model.findOne({ _id: req.params.id });
    if (!entityObject) {
      throw new CustomError.NotFoundError(
        `No ${entity} with id ${req.params.id}`,
      );
    }

    req[entity] = entityObject;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = setEntity;
