// filepath: c:\Users\owenh\Documents\Codes\Signup\client\src\Account.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Account = () => {
  return (
    <div>
      <h1>Account Page</h1>
      <nav>
        <ul>
          <li>
            <Link to="/my-messages">Messages</Link>
          </li>
          <li>
            <Link to="/my-listings">Listings</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Account;