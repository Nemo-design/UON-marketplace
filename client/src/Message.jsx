import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Message.css';

import {
  FaThLarge, FaLaptop, FaCouch, FaTshirt, FaBook,
  FaBasketballBall, FaCar, FaPuzzlePiece,
  FaBlender, FaHeart, FaDog
} from 'react-icons/fa';

function SendMessage() {
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sender = localStorage.getItem('username');
  const receiver = queryParams.get('recipient');
  const listingTitle = queryParams.get('listingTitle');
  const listingId = queryParams.get('listingId');
  const receiverId = queryParams.get('receiverId');
  const senderId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  // 分类栏
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = [
    { name: 'All', icon: <FaThLarge /> },
    { name: 'Electronics', icon: <FaLaptop /> },
    { name: 'Furniture', icon: <FaCouch /> },
    { name: 'Clothing', icon: <FaTshirt /> },
    { name: 'Books', icon: <FaBook /> },
    { name: 'Sports', icon: <FaBasketballBall /> },
    { name: 'Vehicles', icon: <FaCar /> },
    { name: 'Toys', icon: <FaPuzzlePiece /> },
    { name: 'Home Appliances', icon: <FaBlender /> },
    { name: 'Beauty', icon: <FaHeart /> },
    { name: 'Pets', icon: <FaDog /> },
  ];

  // 登出
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleCategoryClick = (category) => setSelectedCategory(category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      receiverId,
      senderId,
      message,
      listingTitle,
      listingId,
    };
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:3001/send-message', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedback('Message sent successfully!');
    } catch (error) {
      setFeedback('Failed to send the message. Please try again.');
    }
    navigate('/my-messages'); // 发送后跳转
    setMessage('');
  };

  return (
      <div className="min-vh-100 d-flex flex-column">
        {/* === 顶部导航栏 === */}
        <nav className="navbar">
          <div className="d-flex align-items-center gap-4">
            <a className="navbar-brand" href="#">Market</a>
            <Link className="nav-link" to="/dashboard">Home</Link>
            <Link className="nav-link" to="/upload">Create Listing</Link>
            <Link className="nav-link" to="/my-messages">Messages</Link>
            <Link className="nav-link" to="/my-listings">My Listings</Link>
            <Link className="nav-link" to="/profile">Profile</Link>
          </div>
          <div className="d-flex align-items-center gap-3">
            <form className="search-form d-flex align-items-center" onSubmit={e => e.preventDefault()}>
              <input className="search-input" type="search" placeholder="Search" aria-label="Search" />
              <button className="search-btn" type="submit">Search</button>
            </form>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        <div className="flex-grow-1 d-flex">
          {/* === 分类栏 === */}
          <div className="category-sidebar bg-light p-3">
            <h5 className="mb-3">Categories</h5>
            <ul className="list-unstyled">
              {categories.map(({ name, icon }) => (
                  <li className="category-item" key={name}>
                    <button
                        type="button"
                        className={
                            "category-btn d-inline-flex align-items-center gap-2 text-decoration-none" +
                            (name !== 'All' && selectedCategory === name.toLowerCase() ? ' text-primary' : '')
                        }
                        style={{
                          fontWeight: name !== 'All' && selectedCategory === name.toLowerCase() ? 'bold' : 'normal'
                        }}
                        onClick={() => handleCategoryClick(name.toLowerCase())}
                    >
                      {icon}
                      {name}
                    </button>
                  </li>
              ))}
            </ul>
          </div>

          <div className="flex-grow-1 p-4">
            <div className="custom-border p-4">
              <h3 className="mb-4">Send Message</h3>
              <p className="text-muted">You can send a message to the seller regarding this listing.</p>
              <p>Sending a message to: <strong>{receiver}</strong></p>
              {listingTitle && (
                  <p>Regarding item: <strong>{listingTitle}</strong></p>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                      id="message"
                      name="message"
                      rows="5"
                      className="form-control"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary w-50">
                    Send
                  </button>
                </div>
              </form>
              {feedback && (
                  <div className="alert alert-info mt-4">
                    {feedback}
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default SendMessage;
