const express = require('express');
const router = express.Router();
const Question = require('../models/question');

// Route to display the home page
router.get('/', (req, res) => {
  res.render('index'); // Render 'home.ejs'
});
//Route to render upload quiz page
router.get('/uploadQuiz', async (req, res) => {
  try {
    res.render('uploadQuestion'); // Render 'attemptQuiz.ejs' with fetched questions
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// Route to render the quiz attempt page
router.get('/attemptQuiz', async (req, res) => {
  try {
    const questions = await Question.find(); // Fetch questions from the database
    res.render('attemptQuiz', { questions }); // Render 'attemptQuiz.ejs' with fetched questions
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to handle quiz submission
router.post('/submitQuiz', async (req, res) => {
  try {
    const submittedAnswers = req.body; // Submitted answers from the form
    // Logic to evaluate answers and calculate score
    // Update this logic according to your scoring system
    // For example:
    let score = 0;
    for (const questionId in submittedAnswers) {
      const selectedAnswer = submittedAnswers[questionId];
      const question = await Question.findById(questionId);
      if (question && question.correctAnswer === parseInt(selectedAnswer)) {
        score++;
      }
    }
    // Render result page with the calculated score
    res.render('quizResult', { score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Other routes for managing questions (e.g., creating, editing, deleting)

// Route to render the create question form
router.get('/createQuestion', (req, res) => {
  res.render('questions/createQuestion'); // Render 'createQuestion.ejs'
});

// Route to handle form submission for creating a new question
router.post('/createQuestion', async (req, res) => {
  try {
    // Extract question details from the form body
    const { question, answers, correctAnswer } = req.body;
    // Create a new question in the database
    const newQuestion = new Question({ question, answers, correctAnswer });
    await newQuestion.save(); // Save the new question
    res.redirect('/attemptQuiz'); // Redirect to the quiz attempt page
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
