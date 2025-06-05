import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListingMessages.css';
import { FaUserCircle } from 'react-icons/fa';

const categories = [
  { name: 'All', path: '', icon: null },
  { name: 'Electronics', path: 'electronics', icon: null },
  { name: 'Furniture', path: 'furniture', icon: null },
  { name: 'Clothing', path: 'clothing', icon: null },
  { name: 'Books', path: 'books', icon: null },
  { name: 'Sports', path: 'sports', icon: null },
  { name: 'Vehicles', path: 'vehicles', icon: null },
  { name: 'Toys', path: 'toys', icon: null },
  { name: 'Home Appliances', path: 'home-appliances', icon: null },
  { name: 'Beauty', path: 'beauty', icon: null },
  { name: 'Pets', path: 'pets', icon: null },
];

const ListingMessages = () => {
  const { listingId } = useParams();
  const [messengers, setMessengers] = useState([]);
  const [selectedMessenger, setSelectedMessenger] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
const [username, setUsername] = useState(localStorage.getItem('username') || '');
  useEffect(() => {
    const fetchMessengers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:3001/listing/${listingId}/messengers`, {
          headers: { Authorization: `Bearer ${token}` },
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

   useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
    }, []);

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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedMessenger((prev) => ({
        ...prev,
        messages: [...prev.messages, response.data.data],
      }));
    } catch (err) {
      console.error('Error sending reply:', err);
    }
  };
const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // For displaying the other user's name
  let otherUser = null;
  let otherUsername = '';
  if (selectedMessenger) {
    const currentUserId = localStorage.getItem('userId');
    const sender = selectedMessenger.senderId;
    const receiver = selectedMessenger.receiverId;
    const senderId = typeof sender === 'object' ? sender._id || sender.id : sender;
    if (senderId === currentUserId) {
      otherUser = receiver;
    } else {
      otherUser = sender;
    }
    otherUsername =
      (typeof otherUser === 'object' && (otherUser.username || otherUser.Username)) ||
      (typeof otherUser === 'object' && (otherUser._id || otherUser.id)) ||
      otherUser;
  }

  return (
  <div className="min-vh-100 d-flex flex-column">
    {/* ===== Top Navbar ===== */}
    <nav className="navbar">
      <div className="d-flex align-items-center gap-4">
        <a className="navbar-brand" href="#">Market</a>
        <Link className="nav-link" to="/dashboard">Home</Link>
        <Link className="nav-link" to="/upload">Create Listing</Link>
        <Link className="nav-link" to="/my-messages">Messages</Link>
        <Link className="nav-link" to="/my-listings">My Listings</Link>
      </div>
      <div className="d-flex align-items-center gap-3">
        <Link
          to="/profile"
          className="nav-link p-0 d-flex align-items-center"
          style={{ fontSize: '1.8rem' }}
          title="Profile"
        >
          <FaUserCircle />
          <span style={{ fontSize: '1rem', marginLeft: '8px' }}>
            {username}
          </span>
        </Link>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>
    </nav>

    <div className="flex-grow-1 d-flex">
      {/* ===== Message List ===== */}
      <div className="messages-list" style={{ flexGrow: 1, padding: '20px', maxWidth: '350px', borderRight: '1px solid #ddd' }}>
        <h5 className="mb-3">Users Who Messaged</h5>
        <ul className="list-unstyled">
          {messengers.length > 0 ? (
            messengers.map((messenger) => {
              const sender = messenger.senderId;
              const senderUsername =
                (typeof sender === 'object' && (sender.username || sender.Username)) ||
                (typeof sender === 'object' && (sender._id || sender.id)) ||
                sender;

              // Get first image from listingId.images
              const firstImage =
                messenger.listingId &&
                Array.isArray(messenger.listingId.images) &&
                messenger.listingId.images.length > 0
                  ? (
                      typeof messenger.listingId.images[0] === 'string'
                        ? messenger.listingId.images[0]
                        : (messenger.listingId.images[0].data || '')
                    )
                  : null;

              return (
                <li
                  key={messenger._id}
                  className="message-card d-flex align-items-center justify-content-between mb-3"
                  style={{
                    cursor: 'pointer',
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    padding: '14px 18px',
                    border: '1px solid #e4e6eb'
                  }}
                >
                  <div
                    className="message-content"
                    onClick={() => viewMessageHistory(messenger)}
                    style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}
                  >
                    {firstImage && typeof firstImage === 'string' && firstImage.length > 30 && (
                      <img
                        src={`data:image/jpeg;base64,${firstImage}`}
                        alt={messenger.listingId?.title || 'Listing'}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', marginRight: '12px' }}
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div>
                      <div className="message-title" style={{ fontWeight: 500 }}>
                        {senderUsername}
                      </div>
                      <div className="message-subtitle" style={{ fontSize: '0.97rem', color: '#888' }}>
                        {messenger.listingId?.title || 'Listing'}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <p>No messages found for this listing.</p>
          )}
        </ul>
      </div>

      {/* ===== Selected Message Panel ===== */}
      <div className="flex-grow-1 p-4">
        {selectedMessenger ? (
          <div className="custom-border p-4">
            <h3>Message with {otherUsername}</h3>
            <ul className="list-unstyled">
              {selectedMessenger.messages.map((message) => {
                const currentUserId = localStorage.getItem('userId');
                const senderId = typeof message.senderId === 'object'
                  ? message.senderId._id || message.senderId.id
                  : message.senderId;
                const senderUsername =
                  senderId === currentUserId
                    ? 'You'
                    : (otherUsername) || 'Unknown';
                return (
                  <li key={message._id} className="mb-2">
                    <div>
                      <strong>{senderUsername}:</strong> {message.content}
                    </div>
                  </li>
                );
              })}
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