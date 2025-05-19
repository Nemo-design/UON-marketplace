import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css';
import {
    FaThLarge, FaLaptop, FaCouch, FaTshirt, FaBook,
    FaBasketballBall, FaCar, FaPuzzlePiece,
    FaBlender, FaHeart, FaDog, FaUserCircle
} from 'react-icons/fa';

function Profile() {
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
    });
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showView, setShowView] = useState(false); // 是否显示“查看模式”
    const navigate = useNavigate();

    const username = localStorage.getItem('username') || '';

    // 页面加载时，优先从数据库读取 profile 信息
    useEffect(() => {
        if (username) {
            axios.get('http://localhost:3001/profile', { params: { Username: username } })
                .then(res => {
                    const userProfile = res.data;
                    if (userProfile) {
                        setProfile({
                            fullName: userProfile.Username || '',
                            email: userProfile.Email || '',
                            phone: userProfile.Phone || '',
                            address: userProfile.Address || '',
                        });
                        setShowView(true);
                    } else {
                        setShowView(false);
                    }
                })
                .catch(() => {
                    setProfile({
                        fullName: '',
                        email: '',
                        phone: '',
                        address: '',
                    });
                    setShowView(false);
                });
        }
    }, [username]);

    // 保存到数据库
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/profile', {
                originalUsername: username, // 旧用户名
                Username: profile.fullName, // 新用户名
                Email: profile.email,
                Phone: profile.phone,
                Address: profile.address,
            });
            // 登录信息需要同步
            localStorage.setItem('username', profile.fullName);
            setShowView(true);
            alert('Profile saved to database!');
        } catch (err) {
            alert('Failed to save profile.');
        }
    };

    const handleEdit = () => setShowView(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

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

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
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
                                        fontWeight: name !== 'All' && selectedCategory === name.toLowerCase() ? 'bold' : 'normal',
                                        background: 'none',
                                    }}
                                    onClick={() => handleCategoryClick(name.toLowerCase())}
                                >
                                    {icon} {name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="custom-border p-4" style={{ maxWidth: 420, width: '100%' }}>
                        <h2 className="mb-4">My Profile</h2>
                        {showView ? (
                            <div>
                                <div style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                                    <div><b>Full Name：</b>{profile.fullName}</div>
                                    <div><b>Email：</b>{profile.email}</div>
                                    <div><b>Phone：</b>{profile.phone}</div>
                                    <div><b>Address：</b>{profile.address}</div>
                                </div>
                                <button
                                    className="btn btn-primary btn-lg"
                                    style={{ fontSize: '1.1rem', borderRadius: '6px', width: '100%' }}
                                    onClick={handleEdit}
                                >
                                    Edit
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={profile.fullName}
                                    onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={profile.email}
                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Phone"
                                    value={profile.phone}
                                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={profile.address}
                                    onChange={e => setProfile({ ...profile, address: e.target.value })}
                                />
                                <button type="submit" className="btn btn-success btn-lg" style={{ fontSize: '1.2rem', borderRadius: '6px' }}>
                                    Save
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
