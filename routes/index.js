// const express = require('express');
// const Question = require('../models/question');
// const router = express.Router();

// // Landing page
// router.get('/', (req, res) => {
//   res.render('index'); // Render your landing page (index.ejs)
// });

// router.get('/uploadQuiz', async (req, res) => {
//   try {
//     res.render('questions/uploadQuestion'); // Render 'attemptQuiz.ejs' with fetched questions
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // Attempt Quiz
// router.get('/attemptQuiz', async (req, res) => {
//   const questions = await Question.find()
//   console.log(questions)
//   res.render('./questions/attemptQuiz',{questions}); // Render the attempt quiz page (attemptQuiz.ejs)
// });

// // Show Questions
// router.get('/showQuestions', (req, res) => {
//   res.render('questions/showQuestions'); // Render the show questions page (showQuestions.ejs)
// });

// // Quiz Results
// router.get('/quizResult', (req, res) => {
//   res.render('questions/quizResult'); // Render the quiz results page (quizResult.ejs)
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Question = require('../models/question');

// Route to display the home page
router.get('/', (req, res) => {
  res.render('index',{ body: '' }); // Render 'home.ejs'
});
// Route to render upload quiz page
router.get('/uploadQuiz', (req, res) => {
  try {
    res.render('questions/uploadQuestion',{ body: 'layouts/mainLayout' }); // Render 'attemptQuiz.ejs' with fetched questions
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// Route to render the quiz attempt page
router.get('/attemptQuiz', async (req, res) => {
  try {
    const questions = await Question.find(); // Fetch questions from the database
    res.render('questions/attemptQuiz',{ body: 'layouts/mainLayout',questions }); // Render 'attemptQuiz.ejs' with fetched questions
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Show Questions
router.get('/showQuestions',async (req, res) => {
  const questions = await Question.find();
  res.render('questions/showQuestions',{ body: 'layouts/mainLayout',questions }); // Render the show questions page (showQuestions.ejs)
});

// Quiz Results
// Inside your route handler for rendering quiz result
router.get('/quizResult', async (req, res) => {
  try {
    // Fetch all questions from the database
    const questions = await Question.find();

    // Calculate total number of questions
    const totalQuestions = questions.length;

    // Logic to simulate user-submitted answers (replace this with actual user-submitted answers)
    const submittedAnswers = {
      questionId1: 'selectedAnswer1',
      questionId2: 'selectedAnswer2',
      // ... Add all submitted answers here
    };

    // Calculate score based on submitted answers
    let score = 0;
    for (const questionId in submittedAnswers) {
      const selectedAnswer = submittedAnswers[questionId];
      const question = questions.find(q => q.id === questionId); // Assuming question has id property
      if (question && question.correctAnswer === selectedAnswer) {
        score++;
      }
    }

    res.render('questions/quizResult', { body: 'layouts/mainLayout',score, totalQuestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to handle quiz submission
router.post('/submitQuiz', async (req, res) => {
  try {
    const submittedAnswers = req.body; // Submitted answers from the form
    // Logic to evaluate answers and calculate score
    let score = 0;
    for (const questionId in submittedAnswers) {
      const selectedAnswer = submittedAnswers[questionId];
      const question = await Question.findById(questionId);
      if (question && question.correctAnswer === parseInt(selectedAnswer)) {
        score++;
      }
    }
    // Render result page with the calculated score
    res.render('questions/quizResult', { score });
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