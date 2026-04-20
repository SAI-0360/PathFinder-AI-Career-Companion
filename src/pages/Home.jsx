import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Roadmaps',
    desc: 'AI generates a personalized, phase-wise learning path tailored to your exact goal and current level.',
  },
  {
    icon: '🇮🇳',
    title: 'Made for Indian Students',
    desc: 'Resources from Coursera, YouTube, Unacademy, and more — aligned with the Indian education system.',
  },
  {
    icon: '✅',
    title: 'Track Your Progress',
    desc: 'Mark topics as done, see your progress bar grow, and stay motivated every step of the way.',
  },
  {
    icon: '🗺️',
    title: 'Explore 10+ Paths',
    desc: 'Pre-built roadmaps for IIT-JEE, NEET, UPSC, Web Dev, CA, CLAT, and more.',
  },
  {
    icon: '💾',
    title: 'Save & Revisit',
    desc: 'Your roadmaps are saved to the cloud. Come back anytime and pick up where you left off.',
  },
  {
    icon: '⚡',
    title: 'Instant Generation',
    desc: 'No waiting. Enter your goal, click generate, and get a full structured roadmap in seconds.',
  },
];

const stats = [
  { number: '10+', label: 'Career Paths' },
  { number: '50+', label: 'Resources Curated' },
  { number: '3-5', label: 'Phases per Roadmap' },
  { number: '100%', label: 'Personalized AI Roadmaps' },
];

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <main>
      {/* Hero */}
      <section className="home-hero" aria-labelledby="hero-title">
        <h1 className="hero-title" id="hero-title">
          Your Personalized <br />
          <span className="highlight">Career Roadmap</span> <br />
          Starts Here
        </h1>
        <p className="hero-description">
          From school to career — get an AI-generated, step-by-step learning path
          tailored to your goals, field, and current level. No confusion. Just a clear path forward.
        </p>
        <div className="hero-cta">
          {currentUser ? (
            <>
              <Link to="/create-roadmap" id="hero-cta-new" className="btn btn-primary btn-lg">
                ✨ Generate New Roadmap
              </Link>
              <Link to="/explore" id="hero-cta-explore-loggedin" className="btn btn-ghost btn-lg">
                🔭 Explore Paths
              </Link>
              <Link to="/dashboard" id="hero-cta-dashboard" className="btn btn-ghost btn-lg">
                My Dashboard →
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup" id="hero-cta-signup" className="btn btn-primary btn-lg">
                Get Started Free →
              </Link>
              <Link to="/explore" id="hero-cta-explore" className="btn btn-ghost btn-lg">
                Browse Paths
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Stats */}
      <div className="stats-row" role="list" aria-label="Statistics">
        {stats.map((s) => (
          <div className="stat-item" key={s.label} role="listitem">
            <div className="stat-number">{s.number}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="features-section" aria-labelledby="features-title">
        <div style={{ textAlign: 'center' }}>
          <h2 className="section-title" id="features-title">
            Everything You Need to <span style={{ color: 'var(--saffron)' }}>Succeed</span>
          </h2>
          <p className="section-subtitle">
            One platform, from school to career — powered by AI.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title} id={`feature-${f.title.replace(/\s+/g, '-').toLowerCase()}`}>
              <span className="feature-icon" aria-hidden="true">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ textAlign: 'center', padding: '4rem 1.5rem 5rem', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit', marginBottom: '1rem' }}>
          Ready to find <span style={{ color: 'var(--saffron)' }}>your path?</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Join thousands of Indian students mapping their future with AI.
        </p>
        <Link to={currentUser ? '/create-roadmap' : '/signup'} className="btn btn-primary btn-lg" id="bottom-cta">
          {currentUser ? '✨ Create New Roadmap' : '🚀 Start for Free'}
        </Link>
      </section>
    </main>
  );
}
