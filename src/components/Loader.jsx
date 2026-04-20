import React from 'react';

export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="loader-wrap">
      <div className="spinner" aria-label="Loading" />
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{message}</p>
    </div>
  );
}
