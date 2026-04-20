import React, { useState } from 'react';

const resourceTypeIcon = {
  video:    '▶️',
  course:   '🎓',
  article:  '📄',
  website:  '🌐',
  book:     '📚',
  practice: '💻',
};

const difficultyColor = {
  beginner:     'var(--green-light)',
  intermediate: 'var(--saffron)',
  advanced:     '#f687b3',
};

export default function PhaseCard({ phase, phaseIndex, progress, onToggle }) {
  const [expanded, setExpanded] = useState(phaseIndex === 0);

  const totalTopics = phase.topics?.length || 0;
  const doneCount = phase.topics?.filter(t => progress[t.id]).length || 0;
  const allDone = totalTopics > 0 && doneCount === totalTopics;
  const totalHours = phase.topics?.reduce((sum, t) => sum + (t.estimatedHours || 0), 0) || 0;

  return (
    <article className={`phase-card ${expanded ? 'expanded' : ''}`} id={`phase-${phase.id}`}>
      <div
        className="phase-header"
        onClick={() => setExpanded(prev => !prev)}
        role="button"
        aria-expanded={expanded}
        aria-controls={`phase-body-${phase.id}`}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setExpanded(prev => !prev)}
      >
        <div className="phase-title-row">
          <div className="phase-number">{phaseIndex + 1}</div>
          <div>
            <div className="phase-name">{phase.name}</div>
            <div className="phase-desc">
              {phase.description}&nbsp;·&nbsp;
              <span style={{ color: 'var(--saffron)', fontSize: '0.78rem' }}>{phase.duration}</span>
              {totalHours > 0 && (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '6px' }}>
                  ~{totalHours}h total
                </span>
              )}
            </div>
            {phase.keySkills?.length > 0 && (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                {phase.keySkills.map(skill => (
                  <span key={skill} style={{
                    fontSize: '0.68rem', padding: '2px 7px', borderRadius: '999px',
                    background: 'rgba(99,179,237,0.1)', color: '#63b3ed',
                    border: '1px solid rgba(99,179,237,0.2)'
                  }}>{skill}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {allDone && <span className="badge badge-green">✓ Complete</span>}
          {!allDone && doneCount > 0 && (
            <span className="badge badge-saffron">{doneCount}/{totalTopics}</span>
          )}
          <span className="phase-toggle">›</span>
        </div>
      </div>

      {expanded && (
        <div className="phase-body" id={`phase-body-${phase.id}`}>
          {phase.topics?.map((topic) => {
            const isDone = !!progress[topic.id];
            return (
              <div className="topic-item" key={topic.id} id={`topic-${topic.id}`}>
                <button
                  className={`topic-checkbox ${isDone ? 'checked' : ''}`}
                  onClick={() => onToggle(topic.id)}
                  aria-label={isDone ? `Mark ${topic.name} incomplete` : `Mark ${topic.name} complete`}
                  aria-pressed={isDone}
                  id={`checkbox-${topic.id}`}
                >
                  {isDone && '✓'}
                </button>

                <div className="topic-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <span className={`topic-name ${isDone ? 'done' : ''}`}>{topic.name}</span>
                    {topic.difficulty && (
                      <span style={{
                        fontSize: '0.65rem', padding: '1px 6px', borderRadius: '999px',
                        color: difficultyColor[topic.difficulty] || 'var(--text-secondary)',
                        border: `1px solid ${difficultyColor[topic.difficulty] || 'var(--border)'}`,
                        opacity: 0.85, textTransform: 'capitalize'
                      }}>{topic.difficulty}</span>
                    )}
                    {topic.estimatedHours && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        ⏱ ~{topic.estimatedHours}h
                      </span>
                    )}
                  </div>
                  <div className="topic-description">{topic.description}</div>
                  <div className="resource-list" aria-label="Resources">
                    {topic.resources?.map((res, ri) => (
                      <a
                        key={ri}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link"
                        id={`resource-${topic.id}-${ri}`}
                        title={`${res.platform || res.type} — ${res.title}`}
                      >
                        {resourceTypeIcon[res.type] || '🔗'} {res.title}
                        {res.platform && <span style={{ opacity: 0.6, fontSize: '0.7em', marginLeft: '3px' }}>({res.platform})</span>}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}
