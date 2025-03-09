require("dotenv").config();
const faker = require("@faker-js/faker").fakerEN_US;
const Question = require("../../models/Question");
const Category = require("../../models/Category");
const Difficulty = require("../../models/Difficulty");
const User = require("../../models/User");
const FactoryBot = require("factory-bot");

const QUESTION_TYPES = ["multiple-choice", "single-choice", "fill-in"];
const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];
const CATEGORIES = [
  "Science",
  "History",
  "Geography",
  "Technology",
  "Mathematics",
];

const testUserPassword = faker.internet.password();
const factory = FactoryBot.factory;
const factoryAdapter = new FactoryBot.MongooseAdapter();
factory.setAdapter(factoryAdapter);

const options = ["A", "B", "C", "D"].map((letter) => ({
  id: letter,
  text: faker.lorem.words(2),
}));
factory.define("question", Question, {
  questionText: faker.lorem.sentence(),
  options,
  correctAnswer: faker.helpers.arrayElement(options).id,
  type: faker.helpers.arrayElement(QUESTION_TYPES),
});
factory.define("category", Category, {
  name: () => faker.helpers.arrayElement(CATEGORIES),
});
factory.define("difficulty", Difficulty, {
  level: () => faker.helpers.arrayElement(DIFFICULTY_LEVELS),
  pointMultiplier: () => faker.number.int({ min: 1, max: 3 }),
  password: () => faker.internet.password(),
  role: () => "admin",
});
factory.define("user", User, {
  username: () => faker.person.fullName(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
  role: () => "admin",
});

const seedCategories = async () => {
  console.log("🔄 Replacing Categories...");
  await Category.deleteMany({});

  return await factory.createMany("category", 5);
};

const seedDifficulties = async () => {
  console.log("🔄 Replacing Difficulties...");
  await Difficulty.deleteMany({});

  return await factory.createMany("difficulty", 3);
};

const seedAdminUser = async () => {
  console.log("🔄 Replacing Users...");
  await User.deleteMany({});

  return await factory.create("user", { password: testUserPassword });
};

const seedDB = async () => {
  let testUser = null;
  try {
    const categories = await seedCategories();
    const difficulties = await seedDifficulties();
    const testUser = await seedAdminUser();

    await factory.createMany("question", 20, {
      userId: testUser._id,
      categoryId: categories[Math.floor(5 * Math.random())],
      difficultyId: difficulties[Math.floor(3 * Math.random())],
    });
  } catch (e) {
    console.log("database error");
    console.log(e.message);
    throw e;
  }

  return testUser;
};

module.exports = { factory, seedDB, testUserPassword };
