import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserMenu() {
  const { currentUser, displayName, logout } = useAuth(); // name from global context
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  if (!currentUser) return null;

  const initials = displayName
    ? displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  async function handleLogout() {
    setOpen(false);
    try { await logout(); navigate('/'); } catch {}
  }

  return (
    <div className="user-menu-wrap" ref={menuRef}>
      <button
        id="user-menu-btn"
        className="user-avatar-btn"
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        title={displayName}
      >
        <span className="user-avatar">{initials}</span>
        <span className="user-avatar-name">{displayName}</span>
        <span className="user-avatar-caret">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          <div className="user-dropdown-header">
            <div className="user-dropdown-avatar">{initials}</div>
            <div>
              <div className="user-dropdown-name">{displayName}</div>
              <div className="user-dropdown-email">{currentUser.email}</div>
            </div>
          </div>
          <div className="user-dropdown-divider" />
          <Link to="/profile" className="user-dropdown-item" onClick={() => setOpen(false)} id="usermenu-profile">
            👤 My Profile
          </Link>
          <Link to="/dashboard" className="user-dropdown-item" onClick={() => setOpen(false)} id="usermenu-dashboard">
            🗺️ My Dashboard
          </Link>
          <Link to="/create-roadmap" className="user-dropdown-item" onClick={() => setOpen(false)} id="usermenu-new-roadmap">
            ✨ New Roadmap
          </Link>
          <div className="user-dropdown-divider" />
          <button className="user-dropdown-item user-dropdown-logout" onClick={handleLogout} id="usermenu-logout">
            🚪 Log Out
          </button>
        </div>
      )}
    </div>
  );
}
