const express = require("express");

const router = express.Router();

const {
  index,
  getQuizHistory,
  startQuiz,
  submitQuiz,
} = require("../controllers/quiz");

router.route("/").get(index);

router.route("/history").get(getQuizHistory);

router.route("/start").post(startQuiz);
router.route("/submit").post(submitQuiz);

module.exports = router;
