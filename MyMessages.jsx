import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'; // Custom CSS


const MyMessages = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const [selectedMessage, setSelectedMessage] = useState(null); 
  const [reply, setReply] = useState(''); // State for the reply input

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
  const handleReplySubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const formData = {
      recipient: selectedMessage.sender,
      message: reply,
      listingTitle: selectedMessage.listingTitle,
    };

    try {
      const response = await axios.post('http://localhost:3001/message', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Reply sent successfully:', response.data);
      setReply(''); // Clear the reply input
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleDeleteMessage = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/message/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // 删除成功后更新本地状态
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      // 如果删除的是当前选中的消息，也清除
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
      alert('Message deleted successfully!');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete message.');
    }
  };


  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Market</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/upload">Create Listing</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/my-messages">Messages</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/my-listings">My Listings</Link>
              </li>
            </ul>

            {/* Search Bar */}
            <form className="d-flex mx-auto search-form" role="search">
              <input
                className="form-control me-2 search-input"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn search-btn" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex">
        {/* Categories */}
        <div className="category-sidebar bg-light p-3" style={{ width: '250px' }}>
          <h5 className="mb-3">Categories</h5>
          <ul className="list-unstyled">
            <li className="category-item">
              <Link to="/category/electronics" className="text-decoration-none">
                Electronics
              </Link>
            </li>
            <li className="category-item">
              <Link to="/category/furniture" className="text-decoration-none">
                Furniture
              </Link>
            </li>
            <li className="category-item">
              <Link to="/category/clothing" className="text-decoration-none">
                Clothing
              </Link>
            </li>
            <li className="category-item">
              <Link to="/category/books" className="text-decoration-none">
                Books
              </Link>
            </li>
            <li className="category-item">
              <Link to="/category/sports" className="text-decoration-none">
                Sports
              </Link>
            </li>
            <li className="category-item">
              <Link to="/category/vehicles" className="text-decoration-none">
                Vehicles
              </Link>
            </li>
            <li className="category-item">
              <Link to="/category/toys" className="text-decoration-none">
                Toys
              </Link>
            </li>
            <li className="category-item">
              <Link to="/category/home-appliances" className="text-decoration-none">
                Home Appliances
              </Link>
            </li>
            <li className="category-item">
              <Link to="/category/beauty" className="text-decoration-none">
                Beauty
              </Link>
            </li>
            <li className="category-item">
              <Link to="/category/pets" className="text-decoration-none">
                Pets
              </Link>
            </li>
          </ul>
        </div>

        {/* Main Content */}
      <div className="messages-list" style={{ flexGrow: 1, padding: '20px' }}>
          <h5 className="mb-3">My Messages</h5>
          <ul className="list-unstyled">
            {messages.length > 0 ? (
              messages.map((message) => (
                <li
                  key={message._id}
                  className="category-item mb-3"
                  onClick={() => setSelectedMessage(message)} // Set the selected message
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div onClick={() => setSelectedMessage(message)} style={{ cursor: 'pointer' }}>
                      <h6>From: {message.sender}</h6>
                      <p>Regarding: {message.listingTitle}</p>
                    </div>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => {
                          e.stopPropagation(); // 避免触发 message 选中
                          handleDeleteMessage(message._id);
                        }}
                    >
                      Delete
                    </button>
                  </div>

                </li>
              ))
            ) : (
              <p>No messages found.</p>
            )}
          </ul>
        </div>

        {/* Selected Message Panel */}
        <div className="flex-grow-1 p-4">
          {selectedMessage ? (
            <div className="custom-border p-4">
              <h3>Message Details</h3>
              <p>
                <strong>From:</strong> {selectedMessage.sender}
              </p>
              <p>
                <strong>Regarding:</strong> {selectedMessage.listingTitle}
              </p>
              <p>
                <strong>Sent on:</strong> {new Date(selectedMessage.timestamp).toLocaleString()}
              </p>
              <p>{selectedMessage.content}</p>

              {/* Reply Form */}
              <form onSubmit={handleReplySubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="reply" className="form-label">
                    Reply
                  </label>
                  <textarea
                    id="reply"
                    name="reply"
                    rows="3"
                    className="form-control"
                    required
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Send Reply
                </button>
              </form>
            </div>
          ) : (
            <p>Select a message to view its details.</p>
          )}
        </div>
      </div> 
    </div>
  );
};

export default MyMessages;