const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Question = require('./models/question'); // Import your Question model here

const app = express();

// Middleware setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection setup
mongoose.connect('mongodb://localhost/quizApp');
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Routes setup
const indexRouter = require('./routes/index');
const quizRouter = require('./routes/quizRouter'); // Change to your quiz router file name

app.use('/', indexRouter);
app.use('/questions/', quizRouter);



// Handle form submission for creating a question
app.post('/questions/createQuestion', async (req, res) => {
  try {
    const { question, answers, correctAnswer } = req.body;

    const newQuestion = new Question({
      question,
      answers,
      correctAnswer
    });

    const savedQuestion = await newQuestion.save();

    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
