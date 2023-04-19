const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');


const app = express();

app.use(bodyParser.json());

const Quiz = require('./model/quiz')

require("dotenv").config(); 
require("./config/database").connect(); 

// Create a rate limiter to prevent abuse of the API
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10 // Max 10 requests per minute per IP
});
app.use(limiter);

// Create a cache to store frequently accessed data
const cache = new NodeCache({ stdTTL: 60 });

// Helper function to update the status of a quiz
function updateQuizStatus() {
    Quiz.find()
      .then(quizzes => {
        const now = moment();
        quizzes.forEach(quiz => {
          if (now.isBefore(quiz.startDate)) {
            quiz.status = 'inactive';
          } else if (now.isBetween(quiz.startDate, quiz.endDate)) {
            quiz.status = 'active';
          } else {
            quiz.status = 'finished';
          }
          quiz.save();
        });
      })
      .catch(error => {
        console.log('Failed to update quiz status', error);
      });
  }

setInterval(updateQuizStatus, 60 * 1000);

app.get('/', (req, res) => {
    res.send("Welcome to Quiz App!")
})

// Create a quiz
app.post('/quizzes', (req, res) => {
  const { question, options, rightAnswer, startDate, endDate } = req.body;

  // Validate quiz data
  if (!question || !options || !rightAnswer || !startDate || !endDate) {
    return res.status(400).json({ message: 'Quiz data is incomplete' });
  }

  const quiz = new Quiz({
    question,
    options,
    rightAnswer,
    startDate: moment(startDate),
    endDate: moment(endDate),
    status: 'inactive'
  });


  quiz.save()
    .then(savedQuiz => {
      // Update quiz status
      updateQuizStatus(savedQuiz);
      res.json(savedQuiz);
    })
    .catch(error => {
      res.status(500).json({ message: 'Failed to save quiz' });
    });
});

// Get all quizzes
app.get('/quizzes', (req, res) => {
  Quiz.find()
    .then(quizzes => {
      res.json(quizzes);
    })
    .catch(error => {
      res.status(500).json({ message: 'Failed to fetch quizzes' });
    });
});

// Get active quiz
app.get('/quizzes/active', (req, res) => {
  const activeQuiz = cache.get("activeQuiz");
  if (activeQuiz) {
    return res.json(activeQuiz);
  }

  Quiz.findOne({ status: 'active' })
    .then(quiz => {
      if (!quiz) {
        return res.status(404).json({ message: 'No active quizzes found' });
      }

      cache.set("activeQuiz", quiz);
      res.json(quiz);
    })
    .catch(error => {
      res.status(500).json({ message: 'Failed to fetch active quiz' });
    });
});

// Get quiz result
app.get('/quizzes/:id/result', (req, res) => {
  const { id } = req.params;
  Quiz.findById(id)
    .then(quiz => {
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      if (quiz.status !== 'finished') {
        return res.status(400).json({ message: 'Quiz result is not available yet'})
      }
      res.json({ rightAnswer: quiz.rightAnswer });
    })
});

module.exports = app;