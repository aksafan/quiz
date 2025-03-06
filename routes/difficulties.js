const express = require("express");
const setEntity = require("../middleware/setEntity");
const authorizeEntity = require("../middleware/auth/authorizeEntity");

const router = express.Router();

const {
  getAllDifficulties,
  getDifficulty,
  newDifficulty,
  createDifficulty,
  editDifficulty,
  updateDifficulty,
  deleteDifficulty,
} = require("../controllers/difficulties");

router.route("/").get(getAllDifficulties).post(createDifficulty);

router.route("/new").get(newDifficulty);
router.route("/edit/:id").get(
  (req, res, next) => setEntity("difficulty", req, res, next),
  (req, res, next) => authorizeEntity("difficulty", req, res, next),
  editDifficulty,
);
router.route("/delete/:id").post(
  (req, res, next) => setEntity("difficulty", req, res, next),
  (req, res, next) => authorizeEntity("difficulty", req, res, next),
  deleteDifficulty,
);

router
  .route("/:id")
  .get(
    (req, res, next) => setEntity("difficulty", req, res, next),
    (req, res, next) => authorizeEntity("difficulty", req, res, next),
    getDifficulty,
  )
  .post(
    (req, res, next) => setEntity("difficulty", req, res, next),
    (req, res, next) => authorizeEntity("difficulty", req, res, next),
    updateDifficulty,
  );

module.exports = router;
