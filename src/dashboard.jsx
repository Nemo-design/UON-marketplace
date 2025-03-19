import React from 'react';
import { useNavigate } from 'react-router-dom';



const Dashboard = () => {
    const navigate = useNavigate();
    const logOut = () => {
        navigate('/login');
    }
    const createListing = () => {
        navigate('/Upload');
    }
    return (
        <div>
            <h1>University of Newcastle Community Marketplace</h1>
            <button onClick={logOut}>Logout</button>
            <button onClick={createListing}>Create Listing</button>
        </div>
    );
};

export default Dashboard;