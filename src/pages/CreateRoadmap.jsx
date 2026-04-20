import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateRoadmap } from '../services/geminiApi';

const LEVELS = [
  'Class 6–8 (Middle School)',
  'Class 9–10 (Secondary)',
  'Class 11–12 (Higher Secondary)',
  'Undergraduate / College',
  'Postgraduate',
  'Working Professional',
];

const FIELDS = [
  'Science & Technology',
  'Engineering',
  'Medicine / Healthcare',
  'Commerce & Finance',
  'Arts & Humanities',
  'Law',
  'Civil Services',
  'Design & Creative',
  'Sports & Physical Education',
  'Agriculture',
  'Other',
];

export default function CreateRoadmap() {
  const [step, setStep] = useState(1);
  const [level, setLevel] = useState('');
  const [field, setField] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize state once with prefill data
  React.useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill) {
      if (prefill.field) setField(prefill.field);
      if (prefill.goal) setGoal(prefill.goal);
    }
  }, [location.state]);

  function validateStep() {
    if (step === 1 && !level) { setError('Please select your current level.'); return false; }
    if (step === 2 && !field) { setError('Please select your field of interest.'); return false; }
    if (step === 3 && goal.trim().length < 10) { setError('Please describe your goal in at least 10 characters.'); return false; }
    setError('');
    return true;
  }

  function handleNext() {
    if (!validateStep()) return;
    setStep(prev => prev + 1);
  }

  function handleBack() {
    setError('');
    setStep(prev => prev - 1);
  }

  async function handleGenerate(e) {
    e.preventDefault();
    if (!validateStep()) return;
    try {
      setLoading(true);
      setError('');
      const roadmap = await generateRoadmap({ level, field, goal });
      navigate('/roadmap', { state: { roadmap, level, field, goal } });
    } catch (err) {
      setError(err.message || 'Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-header">
        <h1 className="section-title" id="onboarding-title">Build Your Roadmap</h1>
        <p className="section-subtitle">Answer 3 quick questions — we'll handle the rest.</p>

        {/* Step Indicator */}
        <div className="step-indicator" aria-label={`Step ${step} of 3`} role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
          {[1,2,3].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`step-dot ${step === s ? 'active' : step > s ? 'done' : ''}`} />
              {i < 2 && <div className="step-line" />}
            </React.Fragment>
          ))}
          <span style={{ marginLeft: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Step {step} of 3</span>
        </div>
      </div>

      <div className="onboarding-card">
        {error && <div className="form-error" role="alert" id="onboarding-error" style={{ marginBottom: '16px' }}>{error}</div>}

        {/* Step 1 — Level */}
        {step === 1 && (
          <div id="step-1">
            <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Where are you right now?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Select your current education level.
            </p>
            <div className="form-group">
              <label className="form-label" htmlFor="select-level">Current Level</label>
              <select
                id="select-level"
                className="form-select"
                value={level}
                onChange={e => setLevel(e.target.value)}
                required
              >
                <option value="">-- Select your level --</option>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Step 2 — Field */}
        {step === 2 && (
          <div id="step-2">
            <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>What's your field of interest?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Choose the domain that excites you most.
            </p>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}
              role="group"
              aria-label="Field selection"
            >
              {FIELDS.map(f => (
                <button
                  key={f}
                  id={`field-${f.replace(/\s+/g, '-').toLowerCase()}`}
                  type="button"
                  onClick={() => setField(f)}
                  className={`btn ${field === f ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ justifyContent: 'flex-start', borderRadius: 'var(--radius-md)' }}
                  aria-pressed={field === f}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Goal */}
        {step === 3 && (
          <div id="step-3">
            <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>What's your career goal?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '20px' }}>
              Be specific — the more detail, the better the roadmap!
            </p>
            <div className="form-group">
              <label className="form-label" htmlFor="goal-input">Your Goal</label>
              <textarea
                id="goal-input"
                className="form-textarea"
                placeholder="e.g. I want to crack IIT-JEE in 2026, or I'm in Class 10 and want to become a data scientist, or I want to become a civil judge..."
                value={goal}
                onChange={e => setGoal(e.target.value)}
                rows={5}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {goal.length} characters
              </span>
            </div>

            <div style={{ background: 'rgba(255,153,51,0.06)', border: '1px solid rgba(255,153,51,0.15)', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              AI will generate a personalized, phase-wise roadmap with real resource links just for you.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', marginTop: '24px' }}>
          {step > 1 && (
            <button id="onboarding-back" type="button" className="btn btn-ghost" onClick={handleBack}>
              ← Back
            </button>
          )}
          <div style={{ marginLeft: 'auto' }}>
            {step < 3 ? (
              <button id="onboarding-next" type="button" className="btn btn-primary" onClick={handleNext}>
                Next →
              </button>
            ) : (
              <button
                id="onboarding-generate"
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <><span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid #fff3', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Generating…</>
                ) : (
                  '✨ Generate My Roadmap'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary strip */}
      {step > 1 && (
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {level && <span className="badge badge-saffron">📚 {level}</span>}
          {field && <span className="badge badge-blue">🏷 {field}</span>}
        </div>
      )}
    </div>
  );
}
