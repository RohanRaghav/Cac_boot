import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionPaper = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [username, setUsername] = useState('');
  const [UID, setUID] = useState('');
  const [course, setCourse] = useState('');
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const questionsPerPage = 1; // Show one question at a time

  useEffect(() => {
    // Fetch questions from API when component mounts
    const fetchQuestions = async () => {
      try {
        console.log('Fetching questions...');
        const response = await axios.get('http://localhost:3001/api/questions');
        console.log('Questions fetched:', response.data);
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    // Reset the start time when the page changes
    setStartTime(new Date());
  }, [currentPage]);

  const handleNext = () => {
    if ((currentPage + 1) * questionsPerPage < questions.length) {
      const endTime = new Date();
      const timeTaken = (endTime - startTime) / 1000; // Time in seconds
      setAnswers([...answers, { questionTitle: questions[currentPage].title, answer, timeTaken }]);
      setAnswer('');
      setCurrentPage(currentPage + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setAnswer('');
    }
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = async () => {
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // Time in seconds
    const allAnswers = [...answers, { questionTitle: questions[currentPage].title, answer, timeTaken }];

    try {
      await axios.post('http://localhost:3001/submit-test', { username, UID, course, answers: allAnswers });
      alert('Test submitted successfully!');
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  const startIndex = currentPage * questionsPerPage;
  const currentQuestion = questions[startIndex];

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            UID:
            <input
              type="text"
              value={UID}
              onChange={(e) => setUID(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Course:
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
          </label>
          <br />
        </form>
      </div>
      {currentQuestion ? (
        <div>
          <h2>{currentQuestion.title}</h2>
          <p>{currentQuestion.description}</p>
          <textarea
            value={answer}
            onChange={handleAnswerChange}
            placeholder="Write your answer here..."
            rows="4"
            cols="50"
          />
          <div>
            <button onClick={handlePrevious} disabled={currentPage === 0}>
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={(currentPage + 1) * questionsPerPage >= questions.length}
            >
              Next
            </button>
          </div>
          {currentPage === questions.length - 1 && (
            <button onClick={handleSubmit}>
              Submit
            </button>
          )}
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default QuestionPaper;
