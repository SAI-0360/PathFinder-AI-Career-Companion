import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { explorePaths, categories } from '../data/explorePaths';
import { generateCareerOverview } from '../services/geminiApi';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

// ── Career Overview Panel ────────────────────────────────────
function OverviewPanel({ overview, onCreateRoadmap, onClose }) {
  if (!overview) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="overview-panel" onClick={e => e.stopPropagation()}>
        <button className="overview-close" onClick={onClose} aria-label="Close">✕</button>
      <div className="overview-tagline">"{overview.tagline}"</div>
      <p className="overview-text">{overview.overview}</p>

      <div className="overview-grid">
        {/* Skills */}
        <div className="overview-section">
          <div className="overview-section-title">🛠 Core Skills</div>
          <div className="skill-chips">
            {overview.requiredSkills?.map(s => (
              <span key={s} className="skill-chip">{s}</span>
            ))}
          </div>
        </div>

        {/* Salary */}
        <div className="overview-section">
          <div className="overview-section-title">💰 Salary in India</div>
          <div className="salary-grid">
            {overview.salaryRange && Object.entries(overview.salaryRange).map(([key, val]) => (
              <div key={key} className="salary-item">
                <div className="salary-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                <div className="salary-val">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Education path */}
        <div className="overview-section">
          <div className="overview-section-title">🎓 Education Path</div>
          <div className="edu-path">{overview.educationPath}</div>
        </div>

        {/* Timeline */}
        <div className="overview-section">
          <div className="overview-section-title">⏱ Time to Enter</div>
          <div style={{ fontWeight: 700, color: 'var(--saffron)', fontSize: '1rem' }}>{overview.timeToEnter}</div>
        </div>

        {/* Companies */}
        {overview.topCompanies?.length > 0 && (
          <div className="overview-section">
            <div className="overview-section-title">🏢 Top Employers</div>
            <div className="skill-chips">
              {overview.topCompanies.map(c => (
                <span key={c} className="skill-chip skill-chip-alt">{c}</span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {overview.examOrCertifications?.length > 0 && (
          <div className="overview-section">
            <div className="overview-section-title">📜 Key Exams / Certs</div>
            <div className="skill-chips">
              {overview.examOrCertifications.map(c => (
                <span key={c} className="skill-chip">{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Milestones */}
      {overview.keyMilestones?.length > 0 && (
        <div className="overview-section" style={{ marginTop: '16px' }}>
          <div className="overview-section-title">🗺 Key Milestones</div>
          <ol className="milestones-list">
            {overview.keyMilestones.map((m, i) => (
              <li key={i}><span className="milestone-num">{i + 1}</span>{m}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Pros / Cons */}
      <div className="pros-cons-grid">
        <div>
          <div className="overview-section-title" style={{ color: 'var(--green-light)' }}>✅ Pros</div>
          <ul className="pros-cons-list">
            {overview.pros?.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
        <div>
          <div className="overview-section-title" style={{ color: '#fc8181' }}>⚠ Challenges</div>
          <ul className="pros-cons-list">
            {overview.cons?.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      </div>

      <button className="btn btn-primary" style={{ marginTop: '20px', width: '100%' }} onClick={onCreateRoadmap} id="overview-create-roadmap">
        ✨ Create My Full Roadmap for This
      </button>
      </div>
    </div>
  );
}

// ── Explore Card ─────────────────────────────────────────────
function ExploreCard({ path, onViewJourney, loadingId }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isLoading = loadingId === path.id;

  function handleCreateRoadmap() {
    if (!currentUser) { navigate('/signup'); return; }
    navigate('/create-roadmap', {
      state: { prefill: { field: path.title, goal: `I want to become a ${path.title} professional` } }
    });
  }

  return (
    <div className="explore-card-new" id={`card-${path.id}`}>
      <div className="explore-card-emoji">{path.emoji}</div>
      <div className="explore-card-title">{path.title}</div>
      <div className="explore-card-desc">{path.description}</div>
      <div className="explore-card-tags">
        <span className="badge badge-saffron">{path.targetAudience}</span>
        <span className="badge badge-blue">{path.duration}</span>
        <span className="badge badge-purple">{path.category}</span>
      </div>
      <div className="explore-card-actions">
        <button
          id={`journey-${path.id}`}
          className="btn btn-secondary btn-sm"
          onClick={() => onViewJourney(path)}
          disabled={isLoading}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {isLoading ? '⏳ Loading…' : '🔍 View Journey'}
        </button>
        <button
          id={`create-${path.id}`}
          className="btn btn-primary btn-sm"
          onClick={handleCreateRoadmap}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          ✨ Create Roadmap
        </button>
      </div>
    </div>
  );
}

// ── Main Explore Page ─────────────────────────────────────────
export default function Explore() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loadingId, setLoadingId] = useState(null);
  const [overviewData, setOverviewData] = useState(null);   // { pathId, title, data }
  const [overviewError, setOverviewError] = useState('');

  // "Explore Anything" search bar
  const [customQuery, setCustomQuery] = useState('');
  const [customLoading, setCustomLoading] = useState(false);
  const [customOverview, setCustomOverview] = useState(null);
  const [customError, setCustomError] = useState('');

  const filteredPaths = useMemo(() =>
    explorePaths.filter(p =>
      selectedCategory === 'All' || p.category === selectedCategory
    ), [selectedCategory]);

  // Click a card → AI career overview
  async function handleViewJourney(path) {
    if (overviewData?.pathId === path.id) {
      setOverviewData(null); // toggle off
      return;
    }
    setLoadingId(path.id);
    setOverviewError('');
    setOverviewData(null);
    try {
      const data = await generateCareerOverview({ career: path.title });
      setOverviewData({ pathId: path.id, title: path.title, data });
    } catch (err) {
      setOverviewError(err.message || 'Failed to load career details.');
    } finally {
      setLoadingId(null);
    }
  }

  // Explore Anything submit
  async function handleCustomSearch(e) {
    e.preventDefault();
    if (!customQuery.trim()) return;
    setCustomLoading(true);
    setCustomError('');
    setCustomOverview(null);
    try {
      const data = await generateCareerOverview({ career: customQuery.trim() });
      setCustomOverview({ title: customQuery.trim(), data });
    } catch (err) {
      setCustomError(err.message || 'Failed to explore this career.');
    } finally {
      setCustomLoading(false);
    }
  }

  function handleCreateRoadmapFromOverview(title) {
    if (!currentUser) { navigate('/signup'); return; }
    navigate('/create-roadmap', {
      state: { prefill: { field: title, goal: `I want to pursue a career as a ${title}` } }
    });
  }

  return (
    <div className="explore-page">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" id="explore-title">
          Explore <span style={{ color: 'var(--saffron)' }}>Career Paths</span>
        </h1>
        <p className="section-subtitle">
          Click any career to get an AI-powered journey breakdown, salary, and roadmap.
        </p>
      </div>

      {/* ── Explore Anything Bar ── */}
      <div className="explore-anything-box">
        <div className="explore-anything-label">🔭 Explore Any Career</div>
        <form onSubmit={handleCustomSearch} className="unified-search-bar">
          <input
            id="explore-custom-input"
            type="text"
            className="search-input"
            placeholder="Type any career… e.g. Game Developer, Forensic Scientist, UX Designer"
            value={customQuery}
            onChange={e => setCustomQuery(e.target.value)}
            aria-label="Enter any career to explore"
          />
          <button
            id="explore-custom-btn"
            type="submit"
            className="btn btn-primary search-btn"
            disabled={customLoading || !customQuery.trim()}
          >
            {customLoading ? '⏳ Loading…' : '→ Explore'}
          </button>
        </form>

        {customLoading && <Loader message={`Getting details for "${customQuery}"…`} />}
        {customError && <div className="form-error" style={{ marginTop: '12px' }}>{customError}</div>}
        {customOverview && (
          <div style={{ marginTop: '16px' }}>
            <OverviewPanel
              overview={customOverview.data}
              onCreateRoadmap={() => handleCreateRoadmapFromOverview(customOverview.title)}
              onClose={() => setCustomOverview(null)}
            />
          </div>
        )}
      </div>

      {/* ── Category Filters ── */}
      <div className="category-filters" role="group" aria-label="Filter by category">
        {categories.map(cat => (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            className={`filter-btn ${selectedCategory === cat ? 'selected' : ''}`}
            onClick={() => { setSelectedCategory(cat); setOverviewData(null); }}
            aria-pressed={selectedCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {overviewError && (
        <div className="form-error" style={{ marginBottom: '16px' }}>{overviewError}</div>
      )}

      {/* ── Cards Grid ── */}
      <div className="explore-grid-new" role="list">
        {filteredPaths.map(path => (
          <div role="listitem" key={path.id}>
            <ExploreCard
              path={path}
              onViewJourney={handleViewJourney}
              loadingId={loadingId}
            />
            {/* Overview panel renders below the clicked card */}
            {overviewData?.pathId === path.id && (
              <OverviewPanel
                overview={overviewData.data}
                onCreateRoadmap={() => handleCreateRoadmapFromOverview(overviewData.title)}
                onClose={() => setOverviewData(null)}
              />
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      {!currentUser && (
        <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', background: 'rgba(255,153,51,0.06)', border: '1px solid rgba(255,153,51,0.15)', borderRadius: 'var(--radius-xl)' }}>
          <h2 style={{ fontFamily: 'Outfit', marginBottom: '8px' }}>Want a personalized roadmap?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Sign up and let AI generate a roadmap tailored to your exact goal.
          </p>
          <button className="btn btn-primary" id="explore-signup-cta" onClick={() => navigate('/signup')}>
            🚀 Get My Personalized Path
          </button>
        </div>
      )}
    </div>
  );
}
