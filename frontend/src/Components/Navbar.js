import React from 'react';
import './Navbar.css'; // Import CSS file for styling
import { useUser } from "../user-context";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useUser();
    const navigate=useNavigate();
    const handleSignOut = () => {
        // Call logout function when sign-out button is clicked
        logout();
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">Todo List</div>
            <div className="user-info">
                <span className="username">{user.name}</span>
                <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
            </div>
        </nav>
    );
};

export default Navbar;
