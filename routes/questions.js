const express = require("express");
const setEntity = require("../middleware/setEntity");
const authorizeEntity = require("../middleware/auth/authorizeEntity");

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
router.route("/edit/:id").get(
  (req, res, next) => setEntity("question", req, res, next),
  (req, res, next) => authorizeEntity("question", req, res, next),
  editQuestion,
);
router.route("/delete/:id").post(
  (req, res, next) => setEntity("question", req, res, next),
  (req, res, next) => authorizeEntity("question", req, res, next),
  deleteQuestion,
);

router
  .route("/:id")
  .get(
    (req, res, next) => setEntity("question", req, res, next),
    (req, res, next) => authorizeEntity("question", req, res, next),
    getQuestion,
  )
  .post(
    (req, res, next) => setEntity("question", req, res, next),
    (req, res, next) => authorizeEntity("question", req, res, next),
    updateQuestion,
  );

module.exports = router;
