import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';

export default function Navbar() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  // Close menu when location changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Prevent scrolling when menu is open on mobile
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <i className="fa-solid fa-location-arrow" style={{ color: 'var(--saffron)', fontSize: '1.25rem', marginRight: '6px' }}></i>
          PathFinder
        </Link>

        {/* 1. Core Page Links (Collapsible on Mobile) */}
        <ul className={`navbar-links ${menuOpen ? 'mobile-open' : ''}`}>
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          <li><Link to="/explore" className={isActive('/explore')}>Explore</Link></li>
          {currentUser && (
            <>
              <li><Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link></li>
              <li>
                <Link to="/create-roadmap" className="btn btn-primary btn-sm" style={{ margin: '0 8px' }}>
                  + New Roadmap
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* 2. User Actions (Always Visible on the Right) */}
        <div className="navbar-actions">
          {currentUser ? (
            <UserMenu />
          ) : (
            <div className="auth-actions-desktop">
              <Link to="/login" className={isActive('/login')}>Log In</Link>
              <Link to="/signup" className="btn btn-primary btn-sm" style={{ marginLeft: '12px' }}>
                Get Started
              </Link>
            </div>
          )}

          {/* Hamburger Icon */}
          <button 
            className="navbar-toggle" 
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
