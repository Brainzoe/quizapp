const express = require('express');
const router = express.Router();
const Question = require('../models/question');

// Route to display the home page
router.get('/', (req, res) => {
  res.render('index', { body: '' }); // Render 'home.ejs'
});
// Route to render upload quiz page
router.get('/uploadQuiz', (req, res) => {
  try {
    res.render('questions/uploadQuestion', { body: 'layouts/mainLayout' }); // Render 'attemptQuiz.ejs' with fetched questions
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Route to render the quiz attempt page
router.get('/attemptQuiz', async (req, res) => {
  try {
    const questions = await Question.find(); // Fetch questions from the database
    res.render('questions/attemptQuiz', { body: 'layouts/mainLayout', questions }); // Render 'attemptQuiz.ejs' with fetched questions
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Show Questions
router.get('/showQuestions', async (req, res) => {
  const questions = await Question.find();
  res.render('questions/showQuestions', { body: 'layouts/mainLayout', questions }); // Render the show questions page (showQuestions.ejs)
});

// Route to handle quiz submission and calculate score
router.post('/quizResult', async (req, res) => {
  try {
    const submittedAnswers = req.body; // Submitted answers from the form
    const questions = await Question.find(); // Fetch questions from the database

    // Calculate total number of questions
    const totalQuestions = questions.length;

    // Calculate score based on submitted answers
    let score = 0;
    for (const questionId in submittedAnswers) {
      const selectedAnswer = submittedAnswers[questionId];
      const question = questions.find(q => q.id === questionId); // Find question by ID
      if (question && question.correctAnswer.toString() === selectedAnswer) {
        score++;
      }
    }

    res.render('questions/quizResult', { body: 'layouts/mainLayout', score, totalQuestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// Inside your router setup
router.get('/quizResult', async (req, res) => {
  try {
    const questions = await Question.find(); // Fetch questions from the database

    const totalQuestions = questions.length;

    // Get the submitted answers from the request body
    const submittedAnswers = req.body.answers || [];

    let score = 0;
    questions.forEach((question, index) => {
      const correctAnswerIndex = question.correctAnswer; // Assuming correctAnswer holds the index of the correct answer

      // Check if the submitted answer matches the correct answer
      if (submittedAnswers[index] !== undefined && submittedAnswers[index] === String(correctAnswerIndex)) {
        score++;
      }
    });

    // Render the quiz result page with score and total questions
    res.render('questions/quizResult', { body: 'layouts/mainLayout', score, totalQuestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/attemptQuiz', async (req, res) => {
  try {
    const submittedAnswers = req.body.answers; // Get the submitted answers array

    const questions = await Question.find(); // Fetch questions from the database
    const totalQuestions = questions.length;

    let score = 0;
    questions.forEach((question, index) => {
      const correctAnswerIndex = question.correctAnswer; // Assuming correctAnswer holds the index of the correct answer

      // Check if the submitted answer matches the correct answer
      if (submittedAnswers[index] !== undefined && submittedAnswers[index] === String(correctAnswerIndex)) {
        score++;
      }
    });

    res.render('questions/quizResult', { body: 'layouts/mainLayout', score, totalQuestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



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