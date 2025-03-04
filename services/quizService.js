const Question = require("../models/Question");

const calcResults = (questions, userAnswers) => {
  let score = 0;
  let results = [];

  questions.forEach((question) => {
    const correctAnswer = question.correctAnswer;
    const userAnswer = userAnswers[question._id.toString()];

    results.push({
      question: question.questionText,
      userAnswer,
      correctAnswer,
      isCorrect: userAnswer === correctAnswer,
    });

    if (userAnswer === correctAnswer) {
      score++;
    }
  });
  return { score, results };
};

const processQuiz = async (userAnswers) => {
  const questionIds = Object.keys(userAnswers);
  const questions = await Question.find({ _id: { $in: questionIds } });

  let { score, results } = calcResults(questions, userAnswers);

  return {
    total: questionIds.length,
    score,
    results,
  };
};

module.exports = { processQuiz };
