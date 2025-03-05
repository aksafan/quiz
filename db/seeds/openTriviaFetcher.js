const axios = require("axios");
const { decode } = require("html-entities");

const decodeEntities = (text) => decode(text);

const fetchOpenTriviaQuestions = async (amount = 20) => {
  try {
    const response = await axios.get(
      `https://opentdb.com/api.php?amount=${amount}&type=multiple`,
    );

    return response.data.results.map((q) => ({
      questionText: decodeEntities(q.question),
      options: [...q.incorrect_answers, q.correct_answer].map((answer, i) => ({
        id: String.fromCharCode(65 + i), // A, B, C, D
        text: decodeEntities(answer),
      })),
      correctAnswer: String.fromCharCode(65 + q.incorrect_answers.length),
      category: decodeEntities(q.category),
      difficulty: q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1),
      type: "multiple-choice",
    }));
  } catch (error) {
    console.error("Error fetching questions:", error);

    return [];
  }
};

module.exports = { fetchOpenTriviaQuestions };
