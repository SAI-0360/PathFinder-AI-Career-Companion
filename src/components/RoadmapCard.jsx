import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoadmapCard({ roadmap, onDelete }) {
  const [progress, setProgress] = useState(roadmap.progress || {});
  const navigate = useNavigate();

  const allTopics = roadmap.phases?.flatMap(p => p.topics) || [];
  const doneCount = allTopics.filter(t => progress[t.id]).length;
  const pct = allTopics.length > 0 ? Math.round((doneCount / allTopics.length) * 100) : 0;

  function handleContinue(e) {
    e.stopPropagation();
    navigate(`/roadmap?id=${roadmap.id}`);
  }

  return (
    <article className="roadmap-card" id={`roadmap-card-${roadmap.id}`} style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Left Side: Info */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div className="roadmap-card-title">{roadmap.title}</div>
          <div className="roadmap-card-sub" style={{ marginBottom: '12px' }}>
            {roadmap.field} &nbsp;·&nbsp; {roadmap.goal?.slice(0, 80)}
            {roadmap.goal?.length > 80 ? '…' : ''}
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="badge badge-saffron">{pct}% done</span>
            <span className="badge badge-blue">{allTopics.length} topics</span>
            <div className="progress-bar-wrap" style={{ width: '100px', flexShrink: 0 }}>
              <div className="progress-bar" style={{ width: `${pct}%` }} />
            </div>
            {pct === 100 && <span className="badge badge-green">✓ Complete</span>}
          </div>
        </div>

        {/* Right Side: Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
          <button
            id={`continue-roadmap-${roadmap.id}`}
            className="btn btn-primary btn-sm"
            onClick={handleContinue}
            style={{ minWidth: '120px', justifyContent: 'center' }}
          >
            ▶ Continue
          </button>
          
          {onDelete && (
            <button
              id={`delete-roadmap-${roadmap.id}`}
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(roadmap.id)}
              style={{ minWidth: '120px', justifyContent: 'center' }}
            >
              🗑 Delete
            </button>
          )}
        </div>

      </div>
    </article>
  );
}
