import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MyMessages.css';
import {
  FaThLarge, FaLaptop, FaCouch, FaTshirt, FaBook,
  FaBasketballBall, FaCar, FaPuzzlePiece,
  FaBlender, FaHeart, FaDog, FaUserCircle
} from 'react-icons/fa';

const MyMessages = () => {
  const [messengers, setMessengers] = useState([]);
  const [selectedMessenger, setSelectedMessenger] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const categories = [
    { name: 'All', path: '', icon: <FaThLarge /> },
    { name: 'Electronics', path: 'electronics', icon: <FaLaptop /> },
    { name: 'Furniture', path: 'furniture', icon: <FaCouch /> },
    { name: 'Clothing', path: 'clothing', icon: <FaTshirt /> },
    { name: 'Books', path: 'books', icon: <FaBook /> },
    { name: 'Sports', path: 'sports', icon: <FaBasketballBall /> },
    { name: 'Vehicles', path: 'vehicles', icon: <FaCar /> },
    { name: 'Toys', path: 'toys', icon: <FaPuzzlePiece /> },
    { name: 'Home Appliances', path: 'home-appliances', icon: <FaBlender /> },
    { name: 'Beauty', path: 'beauty', icon: <FaHeart /> },
    { name: 'Pets', path: 'pets', icon: <FaDog /> },
  ];

  useEffect(() => {
    const fetchMessengers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/my-messengers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessengers(response.data);
      } catch (err) {
        console.error('Error fetching messengers:', err);
      }
    };
    fetchMessengers();
  }, []);

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

  const handleDeleteConversation = async (messengerId) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
          `http://localhost:3001/delete-messenger/${messengerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessengers((prev) => prev.filter((m) => m._id !== messengerId));
      setSelectedMessenger(null);
      alert('Conversation deleted successfully!');
    } catch (err) {
      alert('Failed to delete conversation');
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };
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
        {/* ===== 顶部导航栏 ===== */}
        <nav className="navbar">
          <div className="d-flex align-items-center gap-4">
            <a className="navbar-brand" href="#">Market</a>
            <Link className="nav-link" to="/dashboard">Home</Link>
            <Link className="nav-link" to="/upload">Create Listing</Link>
            <Link className="nav-link" to="/my-messages">Messages</Link>
            <Link className="nav-link" to="/my-listings">My Listings</Link>
          </div>
          <div className="d-flex align-items-center gap-3">
            <form className="search-form d-flex align-items-center" onSubmit={e => e.preventDefault()}>
              <input className="search-input" type="search" placeholder="Search" aria-label="Search" />
              <button className="search-btn" type="submit">Search</button>
            </form>
            <Link
                to="/profile"
                className="nav-link p-0 d-flex align-items-center"
                style={{ fontSize: '1.8rem' }}
                title="Profile"
            >
              <FaUserCircle />
            </Link>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        <div className="flex-grow-1 d-flex">
          {/* ===== 分类栏 ===== */}
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

          {/* ===== 消息列表 ===== */}
          <div className="messages-list" style={{ flexGrow: 1, padding: '20px', maxWidth: '350px', borderRight: '1px solid #ddd' }}>
            <h5 className="mb-3">My Messages</h5>
            <ul className="list-unstyled">
              {messengers.length > 0 ? (
                messengers.map((messenger) => {
                  const currentUserId = localStorage.getItem('userId');

                  // Normalize sender and receiver IDs and objects
                  const sender = messenger.senderId;
                  const receiver = messenger.receiverId;

                  // Get sender and receiver IDs as strings
                  const senderId = typeof sender === 'object' ? sender._id || sender.id : sender;
                  const receiverId = typeof receiver === 'object' ? receiver._id || receiver.id : receiver;
                  
                  // Determine the "other" user object
                  let otherUser;
                  if (senderId === currentUserId) {
                    otherUser = receiver;
                    
                  } else {
                    otherUser = sender;
                  }

                  // Get the username or fallback to ID
                  const otherUsername =
                    (typeof otherUser === 'object' && (otherUser.username || otherUser.Username)) ||
                    (typeof otherUser === 'object' && (otherUser._id || otherUser.id)) ||
                    otherUser;
                
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
                        style={{ flex: 1, minWidth: 0 }}
                      >
                        <div className="message-title" style={{ fontWeight: 500 }}>
                         {otherUsername}
                       </div>
                        <div className="message-subtitle" style={{ fontSize: '0.97rem', color: '#888' }}>
                          {messenger.listingId?.image && (
                            <img
                              src={`data:image/jpeg;base64,${messenger.listingId.image}`}
                              alt={messenger.listingId?.title || 'Listing'}
                              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', marginRight: '12px' }}
                            />
                          )}
                          {messenger.listingId?.title || 'Deleted Listing'}
                        </div>
                      </div>
                      <button
                        className="delete-messenger-button "
                        onClick={() => handleDeleteConversation(messenger._id)}
                        title="Delete Conversation"
                      >
                        ×
                      </button>
                    </li>
                  );
                })
              ) : (
                <p>No messages found.</p>
              )}
            </ul>
          </div>

          {/* ===== 选中消息面板 ===== */}
          <div className="flex-grow-1 p-4">
            
            {selectedMessenger ? (
              
                <div className="custom-border p-4">
                  <h3>Message with {otherUsername}</h3>
                    <ul className="list-unstyled">
                      {selectedMessenger.messages.map((message) => {
                        const currentUserId = localStorage.getItem('userId');

                        // Get senderId as string
                        const senderId = typeof message.senderId === 'object'
                          ? message.senderId._id || message.senderId.id
                          : message.senderId;

                        // Get sender object from selectedMessenger if available
                        let senderObj = null;
                        if (
                          typeof selectedMessenger.senderId === 'object' &&
                          (selectedMessenger.senderId._id === senderId || selectedMessenger.senderId.id === senderId)
                        ) {
                          senderObj = selectedMessenger.senderId;
                        }

                        // Get sender username
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
                  {/* 回复表单 */}
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

export default MyMessages;
