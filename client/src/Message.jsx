import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Message.css'; // Import custom CSS for styling]

function SendMessage() {
  const [message, setMessage] = useState(''); // State for the message input
  const [feedback, setFeedback] = useState(''); // State for user feedback

  const location = useLocation(); // Access the current location
  const queryParams = new URLSearchParams(location.search); // Parse the query string
  const recipient = queryParams.get('recipient'); // Get the 'recipient' parameter

  const username = localStorage.getItem('username'); // Get the username from local storage

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const formData = {
      recipient,
      message,
      username,
    };

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3001/message', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Message sent successfully:', response.data);
      setFeedback('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      setFeedback('Failed to send the message. Please try again.');
    }
  };

  return (
    <div>
      <h1>Send Message</h1>
      <p>Sending a message to: <strong>{recipient}</strong></p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            required
            value={message} // Bind the value to state
            onChange={(e) => setMessage(e.target.value)} // Update state on input change
          ></textarea>
        </div>
        <button type="submit">Send</button>
      </form>
      {feedback && <p>{feedback}</p>} {/* Display feedback to the user */}
    </div>
  );
}

export default SendMessage;