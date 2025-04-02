// See messages sent to you and reply to them
import React, { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyMessages = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3001/my-messages', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1>My Messages</h1>
      <div>
        {messages.length > 0 ? (
          <ul>
            {messages.map((message) => (
                <li key={message._id}>
                    <h3>From: {message.sender}</h3>
                    <p>{message.content}</p>
                    <button onClick={() => navigate(`/send-message?recipient=${message.sender}`)}>Reply</button>
                </li>
            ))}
          </ul>
        ) : (
          <p>No messages found.</p>
        )}
      </div>
    </div>
  );
};

export default MyMessages;