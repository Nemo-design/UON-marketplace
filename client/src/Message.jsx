import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'; // Custom CSS

function SendMessage() {
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const recipient = queryParams.get('recipient');
  const listingTitle = queryParams.get('listingTitle');
  const listingPrice = queryParams.get('listingPrice'); // Extract listingPrice

  const username = localStorage.getItem('username');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      recipient,
      message,
      username,
      listingTitle,
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

        {/* Send Message */}
        <div className="flex-grow-1 p-4">
            <div className="custom-border p-4">
                <h3 className="mb-4">Send Message</h3>
                <p className="text-muted">You can send a message to the seller regarding this listing.</p>
                <p>Sending a message to: <strong>{recipient}</strong></p>
                {listingTitle && (
                    <p>Regarding item: <strong>{listingTitle}</strong></p>
                )}
                {listingPrice && (
                    <p>Price: <strong>${listingPrice}</strong></p>
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