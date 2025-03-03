const express = require("express");
const setCategory = require("../middleware/categories/setCategory");
const authorizeCategory = require("../middleware/categories/authorizeCategory");

const router = express.Router();

const {
  getAllCategories,
  getCategory,
  newCategory,
  createCategory,
  editCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

router.route("/").get(getAllCategories).post(createCategory);

router.route("/new").get(newCategory);
router.route("/edit/:id").get(setCategory, authorizeCategory, editCategory);
router
  .route("/delete/:id")
  .post(setCategory, authorizeCategory, deleteCategory);

router
  .route("/:id")
  .get(setCategory, authorizeCategory, getCategory)
  .post(setCategory, authorizeCategory, updateCategory);

module.exports = router;
