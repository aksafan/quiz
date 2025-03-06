const express = require("express");
const setEntity = require("../middleware/setEntity");
const authorizeEntity = require("../middleware/auth/authorizeEntity");

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
router.route("/edit/:id").get(
  (req, res, next) => setEntity("category", req, res, next),
  (req, res, next) => authorizeEntity("category", req, res, next),
  editCategory,
);
router.route("/delete/:id").post(
  (req, res, next) => setEntity("category", req, res, next),
  (req, res, next) => authorizeEntity("category", req, res, next),
  deleteCategory,
);

router
  .route("/:id")
  .get(
    (req, res, next) => setEntity("category", req, res, next),
    (req, res, next) => authorizeEntity("category", req, res, next),
    getCategory,
  )
  .post(
    (req, res, next) => setEntity("category", req, res, next),
    (req, res, next) => authorizeEntity("category", req, res, next),
    updateCategory,
  );

module.exports = router;
