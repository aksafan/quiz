const express = require("express");
const setDifficulty = require("../middleware/difficulties/setDifficulty");
const authorizeDifficulty = require("../middleware/difficulties/authorizeDifficulty");

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
router
  .route("/edit/:id")
  .get(setDifficulty, authorizeDifficulty, editDifficulty);
router
  .route("/delete/:id")
  .post(setDifficulty, authorizeDifficulty, deleteDifficulty);

router
  .route("/:id")
  .get(setDifficulty, authorizeDifficulty, getDifficulty)
  .post(setDifficulty, authorizeDifficulty, updateDifficulty);

module.exports = router;
