import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContentForm = () => {
  const [username, setUsername] = useState('');
  const [UID, setUID] = useState('');
  const [course, setCourse] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    // Capture the start time when the component mounts
    setStartTime(new Date());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endTime = new Date();
    const responseTime = (endTime - startTime) / 1000; // Response time in seconds

    try {
      const response = await axios.post('http://localhost:3001/submit', {
        username,
        UID,
        course,
        responseTime, // Send response time to the server
      });

      if (response.status === 201) {
        setMessage('Content submitted successfully!');
        setMessageType('success');
        setUsername(''); // Optionally reset form fields
        setUID(''); // Optionally reset form fields
        setCourse(''); // Optionally reset form fields
      }
    } catch (error) {
      console.error('There was an error submitting the content!', error);
      setMessage('Failed to submit content.');
      setMessageType('error');
    }
  };

  return (
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
            value={UID}
            onChange={(e) => setUID(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Course:
          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ContentForm;
