require("dotenv").config();
const mongoose = require("mongoose");
const faker = require("@faker-js/faker").faker;
const Question = require("../../models/Question");
const Category = require("../../models/Category");
const Difficulty = require("../../models/Difficulty");
const User = require("../../models/User");
const openTriviaFetcher = require("./openTriviaFetcher");

require("../connection")(process.env.MONGO_DB_CONNECTING_STRING)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const DEFAULT_QUESTION_AMOUNT = 20;

const args = process.argv.slice(2);
const questionAmount = parseInt(args[0]) || DEFAULT_QUESTION_AMOUNT;

const QUESTION_TYPES = ["multiple-choice", "single-choice", "fill-in"];
const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];
const CATEGORIES = [
  "General",
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

  console.log("🔄 Fetching quiz questions from Open Trivia...");
  const fetchedQuestions =
    await openTriviaFetcher.fetchOpenTriviaQuestions(questionAmount);

  if (fetchedQuestions.length === 0) {
    console.log("❌ No real questions fetched. Keeping dummy data.");

    return;
  }

  console.log("🔄 Replacing Questions...");
  await Question.deleteMany({});

  const questions = fetchedQuestions.map((q) => {
    const category =
      categories.find((c) => c.name === q.category) || categories[0];
    const difficulty =
      difficulties.find(
        (d) => d.level.toLowerCase() === q.difficulty.toLowerCase(),
      ) || difficulties[0];

    return {
      userId: admin._id,
      categoryId: category._id,
      difficultyId: difficulty._id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      type: q.type,
    };
  });

  await Question.insertMany(questions);
  console.log("✅ Database seeded with questions!");
};

seedQuestions().then(() => mongoose.disconnect());
