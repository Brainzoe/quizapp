const express = require('express');
const router = express.Router();

// Landing page
router.get('/', (req, res) => {
  res.render('index'); // Render your landing page (index.ejs)
});

router.get('/uploadQuiz', async (req, res) => {
  try {
    res.render('questions/uploadQuestion'); // Render 'attemptQuiz.ejs' with fetched questions
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Attempt Quiz
router.get('/attemptQuiz', (req, res) => {
  res.render('./questions/attemptQuiz'); // Render the attempt quiz page (attemptQuiz.ejs)
});

// Show Questions
router.get('/showQuestions', (req, res) => {
  res.render('questions/showQuestions'); // Render the show questions page (showQuestions.ejs)
});

// Quiz Results
router.get('/quizResult', (req, res) => {
  res.render('questions/quizResult'); // Render the quiz results page (quizResult.ejs)
});

module.exports = router;
