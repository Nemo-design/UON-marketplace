import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyMessages.css'; // Reuse the same CSS as MyMessages

const ListingMessages = () => {
  const { listingId } = useParams(); // Get the listing ID from the URL
  const [messengers, setMessengers] = useState([]);
  const [selectedMessenger, setSelectedMessenger] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessengers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:3001/listing/${listingId}/messengers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessengers(response.data);
      } catch (err) {
        console.error('Error fetching messengers:', err); 
      }
    };

    fetchMessengers();
  }, [listingId]);

  const viewMessageHistory = (messenger) => {
    setSelectedMessenger(messenger);
  };

  const handleReply = async (messageContent) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://localhost:3001/reply-message',
        {
          messengerId: selectedMessenger._id,
          message: messageContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Reply sent successfully:', response.data);

      // Update the selected messenger with the new message
      setSelectedMessenger((prev) => ({
        ...prev,
        messages: [...prev.messages, response.data.data],
      }));
    } catch (err) {
      console.error('Error sending reply:', err);
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

        {/* Messages List */}
        <div className="messages-list" style={{ flexGrow: 1, padding: '20px' }}>
          <h5 className="mb-3">Users Who Messaged</h5>
          <ul className="list-unstyled">
            {messengers.length > 0 ? (
              messengers.map((messenger) => (
                <li
                  key={messenger._id}
                  className="category-item mb-3"
                  onClick={() => viewMessageHistory(messenger)} // Set the selected messenger
                  style={{ cursor: 'pointer' }}
                >
                  <h6>From: {messenger.senderId.Username}</h6>
                </li>
              ))
            ) : (
              <p>No messages found for this listing.</p>
            )}
          </ul>
        </div>

        {/* Selected Messenger Panel */}
        <div className="flex-grow-1 p-4">
          {selectedMessenger ? (
            <div className="custom-border p-4">
              <h3>Message History</h3>
              <ul>
                {selectedMessenger.messages.map((message) => (
                  <li key={message._id}>
                    <p>
                      <strong>
                        {message.senderId === localStorage.getItem('userId') ? 'You' : 'Them'}:
                      </strong>{' '}
                      {message.content}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Reply Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const messageContent = e.target.elements.reply.value;
                  handleReply(messageContent);
                  e.target.reset();
                }}
              >
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
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Send Reply
                </button>
              </form>
            </div>
          ) : (
            <p>Select a user to view their messages.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingMessages;