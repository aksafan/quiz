const express = require("express");

const router = express.Router();

const {
  getAllQuestions,
  getQuestion,
  newQuestion,
  createQuestion,
  editQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questions");

router.route("/").get(getAllQuestions).post(createQuestion);

router.route("/new").get(newQuestion);
router.route("/edit/:id").get(editQuestion);
// router.route("/delete/:id").post(deleteQuestion); // this is a fix

router.route("/:id").get(getQuestion).post(updateQuestion).post(deleteQuestion);

module.exports = router;
