const express = require("express");
const setQuestion = require("../middleware/questions/setQuestion");
const authorizeQuestion = require("../middleware/questions/authorizeQuestion");

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
router.route("/edit/:id").get(setQuestion, authorizeQuestion, editQuestion);
router
  .route("/delete/:id")
  .post(setQuestion, authorizeQuestion, deleteQuestion);

router
  .route("/:id")
  .get(setQuestion, authorizeQuestion, getQuestion)
  .post(setQuestion, authorizeQuestion, updateQuestion);

module.exports = router;
