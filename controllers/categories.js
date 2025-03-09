const Category = require("../models/Category");
const { parseValidationErrors, parseDuplicationErrors } = require("../utils");
const customErrorsConstants = require("../constants/customErrors");
const { ADMIN } = require("../constants/roles");
const CustomError = require("../errors");

const getAllCategories = async (req, res) => {
  const categories = await Category.find(
    req.user.role === ADMIN ? {} : { userId: req.user._id },
  ).sort({ createdAt: -1 });

  return res.render("admin/categories/categories", { categories });
};

const getCategory = async (req, res) => {
  return res.render("admin/categories/category", { category: req.category });
};

const newCategory = async (req, res) => {
  res.render("admin/categories/new", { category: null });
};

const createCategory = async (req, res, next) => {
  req.body.userId = req.user._id;

  try {
    const category = await Category.create(req.body);

    return res.redirect(`/admin/categories/${category._id}`);
  } catch (e) {
    if (e.constructor.name === customErrorsConstants.VALIDATION_ERROR) {
      parseValidationErrors(e, req);
    } else if (e.code && e.code === 11000) {
      parseDuplicationErrors(e, req);
    } else {
      return next(e);
    }
    const category = new Category(req.body);

    return res.render("admin/categories/new", {
      errors: req.flash("error"),
      category,
    });
  }
};

const editCategory = async (req, res) => {
  res.render("admin/categories/edit", { category: req.category });
};

const updateCategory = async (req, res, next) => {
  try {
    Object.assign(req.category, req.body);

    await req.category.validate();
    await req.category.save();
  } catch (e) {
    if (e.constructor.name === customErrorsConstants.VALIDATION_ERROR) {
      parseValidationErrors(e, req);
    } else if (e.code && e.code === 11000) {
      parseDuplicationErrors(e, req);
    } else {
      return next(e);
    }

    return res.render("admin/categories/edit", {
      errors: req.flash("error"),
      category: req.category,
    });
  }

  return res.redirect(`/admin/categories/${req.category._id}`);
};

const deleteCategory = async (req, res) => {
  const result = await req.category.deleteOne();
  if (!result) {
    throw new CustomError.NotFoundError(
      `No category with id ${req.params.id} was deleted`,
    );
  }

  return res.redirect(`/admin/categories`);
};

module.exports = {
  getAllCategories,
  getCategory,
  newCategory,
  createCategory,
  editCategory,
  updateCategory,
  deleteCategory,
};
