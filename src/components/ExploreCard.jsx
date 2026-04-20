import React, { useState } from 'react';
import PhaseCard from './PhaseCard';

export default function ExploreCard({ path }) {
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState({});

  function handleToggle(topicId) {
    setProgress(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  }

  return (
    <article
      className="explore-card"
      id={`explore-card-${path.id}`}
    >
      <div className="explore-card-header">
        <span className="explore-emoji">{path.emoji}</span>
        <h3 className="explore-title">{path.title}</h3>
        <p className="explore-desc">{path.description}</p>
      </div>

      <div className="explore-card-meta">
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span className="badge badge-saffron">{path.category}</span>
          <span className="badge badge-blue">⏱ {path.duration}</span>
        </div>
        <button
          id={`explore-toggle-${path.id}`}
          className={`btn ${expanded ? 'btn-secondary' : 'btn-ghost'} btn-sm`}
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? 'Collapse ↑' : 'View Path ↓'}
        </button>
      </div>

      <div
        style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '4px 20px 12px' }}
      >
        👤 {path.targetAudience}
      </div>

      {expanded && (
        <div className="explore-card-expanded">
          {path.phases.map((phase, i) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              phaseIndex={i}
              progress={progress}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </article>
  );
}
