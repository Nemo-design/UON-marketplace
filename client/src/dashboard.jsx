import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch listings from the backend
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3001/listings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setListings(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const createListing = () => {
    navigate('/upload');
  };
  const myAccount = () => {
    navigate('/account');
  };

  return (
    <div>
      <h1>University of Newcastle Community Marketplace</h1>
      <button onClick={logOut}>Logout</button>
      <button onClick={createListing}>Create Listing</button>
      <button onClick={myAccount}>my Account</button>
      <div>
        <h2>Listings</h2>
        {listings.length > 0 ? (
          <ul>
            {listings.map((listing) => (
              <li key={listing._id}>
                <h3>{listing.title}</h3>
                <p>{listing.description}</p>
                <p>Price: {listing.price}</p>
                <p>{listing.username}</p>
                {listing.image && <img src={listing.image} alt="listing" />}
                <button onClick={() => navigate(`/send-message?recipient=${listing.username}`)}>Send Message</button>
              </li>
            ))} 
          </ul>
        ) : (
          <p>No listings found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;