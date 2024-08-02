const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors()); // Enable CORS

mongoose.connect('mongodb://localhost:27017/BootCamp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

// Define schema for questions
const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const Question = mongoose.model('Question', questionSchema);

// Define schema for answers
const answerSchema = new mongoose.Schema({
  questionTitle: String,
  answer: String,
  timeTaken: Number, // Time in seconds
  username: String,
  UID: String,
  course: String,
});

const Answer = mongoose.model('Answer', answerSchema);

// Endpoint to get all questions
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).send('Error fetching questions: ' + error.message);
  }
});

// Endpoint to submit test
app.post('/submit-test', async (req, res) => {
  const { username, UID, course, answers } = req.body;

  const answerDocuments = answers.map((answer) => ({
    ...answer,
    username,
    UID,
    course,
  }));

  try {
    await Answer.insertMany(answerDocuments);
    res.status(201).send('Test submitted successfully!');
  } catch (error) {
    res.status(400).send('Error submitting test: ' + error.message);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
