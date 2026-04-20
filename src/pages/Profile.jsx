import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import Loader from '../components/Loader';

const LEVELS = [
  'Class 6–8 (Middle School)',
  'Class 9–10 (Secondary)',
  'Class 11–12 (Higher Secondary)',
  'Undergraduate / College',
  'Postgraduate',
  'Working Professional',
];

export default function Profile() {
  const { currentUser, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    displayName: '',
    bio: '',
    currentLevel: '',
    institution: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // useEffect — load profile from Firestore on mount
  // If the doc doesn't exist yet (new user) or rules deny read, just show blank form
  useEffect(() => {
    if (!currentUser) { setLoading(false); return; }
    getDoc(doc(db, 'userProfiles', currentUser.uid))
      .then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            displayName: data.displayName || '',
            bio: data.bio || '',
            currentLevel: data.currentLevel || '',
            institution: data.institution || '',
            phone: data.phone || '',
          });
        }
        // If doc doesn't exist — new user, just show empty form (no error)
      })
      .catch(() => {
        // Firestore rules may deny read — still show the empty form, save will create the doc
      })
      .finally(() => setLoading(false));
  }, [currentUser]);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.displayName.trim()) { setError('Display name is required.'); return; }
    try {
      setError('');
      setSaving(true);
      await setDoc(doc(db, 'userProfiles', currentUser.uid), {
        ...form,
        email: currentUser.email,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      await refreshProfile(currentUser); // update name globally across all pages
      setSuccess(true);
    } catch (err) {
      setError('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  const initials = form.displayName
    ? form.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : currentUser?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-big-avatar">{initials}</div>
          <div>
            <h1 id="profile-title" style={{ fontFamily: 'Outfit', fontSize: '1.6rem', marginBottom: '4px' }}>
              {form.displayName || 'Your Profile'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {currentUser?.email}
            </p>
          </div>
        </div>

        {loading ? (
          <Loader message="Loading profile…" />
        ) : (
          <form onSubmit={handleSubmit} aria-label="Edit profile form" noValidate>
            <div className="profile-card">
              <h2 style={{ fontSize: '1rem', fontFamily: 'Outfit', marginBottom: '20px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Personal Details
              </h2>

              {error && (
                <div className="form-error" role="alert" id="profile-error" style={{ marginBottom: '16px' }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ padding: '10px 14px', background: 'rgba(19,136,8,0.1)', border: '1px solid rgba(19,136,8,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--green-light)', marginBottom: '16px', fontSize: '0.875rem' }} role="status">
                  ✅ Profile saved successfully!
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="profile-name">Display Name *</label>
                <input
                  id="profile-name"
                  name="displayName"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Arjun Sharma"
                  value={form.displayName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-bio">Bio</label>
                <textarea
                  id="profile-bio"
                  name="bio"
                  className="form-textarea"
                  placeholder="A short intro about yourself and your goals…"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="profile-level">Current Level</label>
                  <select
                    id="profile-level"
                    name="currentLevel"
                    className="form-select"
                    value={form.currentLevel}
                    onChange={handleChange}
                  >
                    <option value="">-- Select level --</option>
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="profile-phone">Phone (optional)</label>
                  <input
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-institution">School / College / Institution</label>
                <input
                  id="profile-institution"
                  name="institution"
                  type="text"
                  className="form-input"
                  placeholder="e.g. IIT Delhi, Delhi Public School"
                  value={form.institution}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                <button
                  id="profile-save-btn"
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving…' : '💾 Save Profile'}
                </button>
                <button
                  id="profile-back-btn"
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate(-1)}
                >
                  ← Back
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
