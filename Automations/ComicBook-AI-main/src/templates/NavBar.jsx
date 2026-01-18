import React from 'react';
import './NavBar.css';

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar__item">
                <a href="/" className="navbar__link">Home</a>
            </div>
            <div className="navbar__item">
                <a href="/comicbook" className="navbar__link">Comic Book</a>
            </div>
            <div className="navbar__item">
                <a href="/upload" className="navbar__link">Upload</a>
            </div>
            <div className="navbar__item">
                <a href="/search" className="navbar__link">Search</a>
            </div>
        </nav>
    );
}

export default NavBar;