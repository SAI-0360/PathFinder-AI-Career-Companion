import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import RoadmapCard from '../components/RoadmapCard';
import Loader from '../components/Loader';

export default function Dashboard() {
  const { currentUser, displayName } = useAuth(); // displayName from global profile
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  // useEffect — fetch saved roadmaps from Firestore on mount
  // NOTE: No orderBy — avoids needing a composite Firestore index.
  //       We sort client-side by createdAt instead.
  useEffect(() => {
    if (!currentUser) return;

    async function fetchRoadmaps() {
      try {
        const q = query(
          collection(db, 'roadmaps'),
          where('uid', '==', currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }))
          // Sort newest first client-side (avoids composite index requirement)
          .sort((a, b) => {
            const aTime = a.createdAt?.seconds ?? 0;
            const bTime = b.createdAt?.seconds ?? 0;
            return bTime - aTime;
          });
        setRoadmaps(data);
      } catch (err) {
        setError('Failed to load your roadmaps. Check your Firestore rules.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoadmaps();
  }, [currentUser]);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleDelete(roadmapId) {
    if (!window.confirm('Delete this roadmap? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'roadmaps', roadmapId));
      setRoadmaps(prev => prev.filter(r => r.id !== roadmapId));
      showToast('🗑 Roadmap deleted.');
    } catch (err) {
      showToast('Failed to delete: ' + err.message, 'error');
    }
  }

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <h2 id="dashboard-title">
          Welcome back, <span style={{ color: 'var(--saffron)' }}>{displayName}</span> 👋
        </h2>
        <p>Track your learning journeys and pick up where you left off.</p>
        <div style={{ marginTop: '16px' }}>
          <Link to="/create-roadmap" className="btn btn-primary btn-sm" id="dashboard-new-roadmap">
            ✨ Create New Roadmap
          </Link>
        </div>
      </div>

      {/* Roadmaps List */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ fontSize: '1.1rem', fontFamily: 'Outfit', fontWeight: 700 }}>
          My Saved Roadmaps
          {!loading && <span className="badge badge-saffron" style={{ marginLeft: '10px' }}>{roadmaps.length}</span>}
        </h3>
        <Link to="/explore" className="btn btn-ghost btn-sm" id="dashboard-explore-link">
          Browse Paths →
        </Link>
      </div>

      {/* Conditional rendering — loading / error / empty / list */}
      {loading ? (
        <Loader message="Loading your roadmaps…" />
      ) : error ? (
        <div className="form-error" role="alert" id="dashboard-error">{error}</div>
      ) : roadmaps.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗺️</div>
          <h3>No roadmaps yet</h3>
          <p>Generate your first AI-powered roadmap to get started.</p>
          <Link to="/create-roadmap" className="btn btn-primary" id="dashboard-create-first">
            ✨ Create My First Roadmap
          </Link>
        </div>
      ) : (
        <div className="saved-roadmaps" aria-label="Saved roadmaps" role="list">
          {roadmaps.map(roadmap => (
            <div role="listitem" key={roadmap.id}>
              <RoadmapCard roadmap={roadmap} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`} role="alert" aria-live="polite" id="dashboard-toast">
          {toast.msg}
        </div>
      )}
    </div>
  );
}
