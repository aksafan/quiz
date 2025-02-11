require("dotenv").config();
const mongoose = require("mongoose");
const faker = require("@faker-js/faker").faker;
const Question = require("../models/Question");
const Category = require("../models/Category");
const Difficulty = require("../models/Difficulty");
const User = require("../models/User");

require("../config/db")(process.env.MONGO_DB_CONNECTING_STRING)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const QUESTION_TYPES = ["multiple-choice", "single-choice", "fill-in"];
const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];
const CATEGORIES = [
  "Science",
  "History",
  "Geography",
  "Technology",
  "Mathematics",
];

const generateOptions = () => {
  return ["A", "B", "C", "D"].map((letter) => ({
    id: letter,
    text: faker.lorem.words(2),
  }));
};

const seedCategories = async () => {
  console.log("🔄 Replacing Categories...");
  await Category.deleteMany({});

  return await Category.insertMany(CATEGORIES.map((name) => ({ name })));
};

const seedDifficulties = async () => {
  console.log("🔄 Replacing Difficulties...");
  await Difficulty.deleteMany({});

  return await Difficulty.insertMany(
    DIFFICULTY_LEVELS.map((level, index) => ({
      level,
      pointMultiplier: index + 1,
    })),
  );
};

const seedAdminUser = async () => {
  console.log("🔄 Replacing Users...");
  await User.deleteMany({});

  return await User.create({
    username: "admin",
    email: "admin@example.com",
    password: "admin@example.com",
    role: "admin",
  });
};

const seedQuestions = async () => {
  const categories = await seedCategories();
  const difficulties = await seedDifficulties();
  const admin = await seedAdminUser();

  if (!admin) {
    console.log("No admin user found! Please create an admin user first.");

    return;
  }

  console.log("🔄 Replacing Questions...");
  await Question.deleteMany({});

  const questions = [];

  for (let i = 0; i < 20; i++) {
    const category = faker.helpers.arrayElement(categories);
    const difficulty = faker.helpers.arrayElement(difficulties);
    const options = generateOptions();
    const correctAnswer = faker.helpers.arrayElement(options).id;

    questions.push({
      userId: admin._id,
      categoryId: category._id,
      difficultyId: difficulty._id,
      questionText: faker.lorem.sentence(),
      options,
      correctAnswer,
      type: faker.helpers.arrayElement(QUESTION_TYPES),
    });
  }

  await Question.insertMany(questions);

  console.log("✅ Database seeded with sample questions!");
};

seedQuestions().then(() => mongoose.disconnect());
