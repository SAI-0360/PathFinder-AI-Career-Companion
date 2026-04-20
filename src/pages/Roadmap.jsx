import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import PhaseCard from '../components/PhaseCard';
import Loader from '../components/Loader';

export default function Roadmap() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();

  const urlId = searchParams.get('id'); // present when opened via URL or after first save

  const [roadmapData, setRoadmapData] = useState(location.state?.roadmap || null);
  const [meta, setMeta] = useState({
    level: location.state?.level || '',
    field: location.state?.field || '',
    goal: location.state?.goal || '',
  });
  const [progress, setProgress] = useState(location.state?.progress || {});
  const [roadmapId, setRoadmapId] = useState(urlId || null);

  const [pageLoading, setPageLoading] = useState(!!urlId && !location.state?.roadmap);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!urlId); // already saved if opened via ID
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saving', 'saved'
  const [toast, setToast] = useState(null);

  const autoSaveTimer = useRef(null);

  function printRoadmap() {
    if (!roadmapData) return;
    const pw = window.open('', '_blank');
    const phases = roadmapData.phases || [];
    const iconMap = { video: '▶', course: '🎓', article: '📄', website: '🌐', book: '📚', practice: '💻' };
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>${roadmapData.title} — PathFinder Roadmap</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Segoe UI,Arial,sans-serif;max-width:820px;margin:2rem auto;color:#111;font-size:14px;line-height:1.6;padding:0 1rem}
h1{font-size:1.5rem;margin-bottom:4px}
.meta{color:#666;font-size:0.85rem;margin-bottom:1rem}
.phase{border:1px solid #ddd;border-radius:8px;margin:1.5rem 0;page-break-inside:avoid}
.phase-head{background:#f8f8f8;padding:14px 18px;border-bottom:1px solid #ddd;border-radius:8px 8px 0 0}
.phase-num{display:inline-block;background:#ff9933;color:#fff;border-radius:50%;width:26px;height:26px;line-height:26px;text-align:center;font-weight:700;font-size:0.85rem;margin-right:8px}
.phase-name{font-weight:700;font-size:1rem}
.phase-meta{color:#888;font-size:0.78rem;margin-top:2px}
.topics{padding:12px 18px}
.topic{padding:12px 0;border-bottom:1px solid #f0f0f0;display:flex;gap:12px}
.topic:last-child{border-bottom:none}
.cb{width:18px;height:18px;border:2px solid #ff9933;border-radius:4px;flex-shrink:0;margin-top:2px}
.topic-name{font-weight:600;font-size:0.9rem}
.topic-desc{color:#555;font-size:0.82rem;margin:4px 0 6px}
.topic-meta{font-size:0.75rem;color:#888;margin-bottom:6px}
.resources{display:flex;flex-wrap:wrap;gap:6px}
.res{font-size:0.78rem;padding:3px 9px;background:#f5f5f5;border-radius:12px;color:#333;text-decoration:none;border:1px solid #e0e0e0}
footer{text-align:center;color:#aaa;font-size:0.75rem;margin-top:2rem;padding-top:1rem;border-top:1px solid #eee}
.print-btn{padding:8px 18px;background:#ff9933;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.875rem;margin-bottom:1.5rem}
@media print{.print-btn{display:none}a{color:#000}}
</style></head><body>
<button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
<h1>${roadmapData.title}</h1>
<div class="meta">
  ${meta.level ? `📚 ${meta.level}` : ''} ${meta.field ? `· 🏷 ${meta.field}` : ''} ${roadmapData.estimatedDuration ? `· ⏱ ${roadmapData.estimatedDuration}` : ''}
</div>
${roadmapData.summary ? `<p style="color:#444;margin-bottom:1rem;font-size:0.9rem">${roadmapData.summary}</p>` : ''}
${phases.map((phase, i) => `
<div class="phase">
  <div class="phase-head">
    <span class="phase-num">${i + 1}</span>
    <span class="phase-name">${phase.name}</span>
    <div class="phase-meta">${phase.description || ''} ${phase.duration ? '· ' + phase.duration : ''}</div>
    ${phase.keySkills?.length ? `<div style="margin-top:6px;font-size:0.75rem;color:#777">Skills: ${phase.keySkills.join(', ')}</div>` : ''}
  </div>
  <div class="topics">
    ${(phase.topics || []).map(t => `
    <div class="topic">
      <div class="cb"></div>
      <div style="flex:1">
        <div class="topic-name">${t.name}</div>
        ${t.difficulty || t.estimatedHours ? `<div class="topic-meta">${t.difficulty ? '● ' + t.difficulty : ''} ${t.estimatedHours ? '· ⏱ ~' + t.estimatedHours + 'h' : ''}</div>` : ''}
        <div class="topic-desc">${t.description || ''}</div>
        <div class="resources">
          ${(t.resources || []).map(r => `<a href="${r.url}" class="res" target="_blank">${iconMap[r.type] || '🔗'} ${r.title}</a>`).join('')}
        </div>
      </div>
    </div>`).join('')}
  </div>
</div>`).join('')}
<footer>Generated by PathFinder · Your AI Career Guide</footer>
</body></html>`;
    pw.document.write(html);
    pw.document.close();
    pw.focus();
  }


  // ── Load from Firestore if we have a URL id but no state (reload case) ──
  useEffect(() => {
    if (!urlId || roadmapData) return;          // nothing to fetch
    if (!currentUser) return;

    async function fetchRoadmap() {
      try {
        setPageLoading(true);
        const snap = await getDoc(doc(db, 'roadmaps', urlId));
        if (!snap.exists()) { navigate('/dashboard', { replace: true }); return; }
        const data = snap.data();
        setRoadmapData({
          title: data.title,
          summary: data.summary,
          estimatedDuration: data.estimatedDuration,
          phases: data.phases,
        });
        setMeta({ level: data.level || '', field: data.field || '', goal: data.goal || '' });
        setProgress(data.progress || {});
        setRoadmapId(urlId);
        setSaved(true);
      } catch {
        showToast('❌ Failed to load roadmap.', 'error');
        navigate('/dashboard', { replace: true });
      } finally {
        setPageLoading(false);
      }
    }

    fetchRoadmap();
  }, [urlId, currentUser]);

  // ── Redirect if no data and no URL id ──
  useEffect(() => {
    if (!urlId && !roadmapData) {
      navigate('/create-roadmap', { replace: true });
    }
  }, [urlId, roadmapData, navigate]);

  if (pageLoading) return <Loader message="Loading your roadmap…" />;
  if (!roadmapData) return null;

  const allTopics = roadmapData.phases?.flatMap(p => p.topics) || [];
  const doneCount = allTopics.filter(t => progress[t.id]).length;
  const pct = allTopics.length > 0 ? Math.round((doneCount / allTopics.length) * 100) : 0;

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  // Auto-save progress to Firestore (debounced 1.5 s)
  function scheduleAutoSave(newProgress, id) {
    clearTimeout(autoSaveTimer.current);
    setAutoSaveStatus('saving');
    autoSaveTimer.current = setTimeout(async () => {
      try {
        await updateDoc(doc(db, 'roadmaps', id), { progress: newProgress });
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus(''), 2000);
      } catch {
        setAutoSaveStatus('');
      }
    }, 1500);
  }

  function handleToggle(topicId) {
    setProgress(prev => {
      const next = { ...prev, [topicId]: !prev[topicId] };
      if (roadmapId) scheduleAutoSave(next, roadmapId);
      return next;
    });
  }

  // First save — creates Firestore doc and puts the ID in the URL
  async function handleSave() {
    if (!currentUser) { navigate('/login'); return; }
    try {
      setSaving(true);
      const docRef = await addDoc(collection(db, 'roadmaps'), {
        uid: currentUser.uid,
        title: roadmapData.title,
        summary: roadmapData.summary,
        estimatedDuration: roadmapData.estimatedDuration,
        phases: roadmapData.phases,
        field: meta.field,
        level: meta.level,
        goal: meta.goal,
        progress,
        createdAt: serverTimestamp(),
      });
      setRoadmapId(docRef.id);
      setSaved(true);
      // Update URL so reload works without losing data
      navigate(`/roadmap?id=${docRef.id}`, {
        replace: true,
        state: { roadmap: roadmapData, ...meta, progress },
      });
      showToast('✅ Roadmap saved! Progress auto-saves from now on.');
    } catch (err) {
      showToast('❌ Failed to save: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="roadmap-page">

      {/* Header */}
      <div className="roadmap-header">
        <div>
          <h1 id="roadmap-title" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontFamily: 'Outfit', marginBottom: '8px' }}>
            {roadmapData.title}
          </h1>
          <div className="roadmap-meta">
            {meta.level && <span className="badge badge-saffron">📚 {meta.level}</span>}
            {meta.field && <span className="badge badge-blue">🏷 {meta.field}</span>}
            {roadmapData.estimatedDuration && (
              <span className="badge badge-green">⏱ {roadmapData.estimatedDuration}</span>
            )}
            <span className="badge badge-purple">{roadmapData.phases?.length} Phases</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Auto-save status */}
          {autoSaveStatus === 'saving' && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>↻ Saving…</span>
          )}
          {autoSaveStatus === 'saved' && (
            <span style={{ fontSize: '0.78rem', color: 'var(--green-light)' }}>✓ Saved</span>
          )}

          <Link to="/create-roadmap" className="btn btn-ghost btn-sm" id="roadmap-new-btn">
            + New Roadmap
          </Link>

          <button
            id="roadmap-print-btn"
            className="btn btn-ghost btn-sm"
            onClick={printRoadmap}
            title="Download / Print as PDF"
          >
            🖨️ Print
          </button>

          {!saved ? (
            <button
              id="roadmap-save-btn"
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : '💾 Save Roadmap'}
            </button>
          ) : (
            <Link to="/dashboard" className="btn btn-secondary btn-sm" id="roadmap-goto-dashboard">
              Dashboard →
            </Link>
          )}
        </div>
      </div>

      {/* Summary */}
      {roadmapData.summary && (
        <div className="roadmap-summary">
          <strong style={{ color: 'var(--saffron)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AI Summary
          </strong>
          <p style={{ marginTop: '6px' }}>{roadmapData.summary}</p>
        </div>
      )}

      {/* Phases */}
      <section aria-label="Roadmap phases">
        {roadmapData.phases?.map((phase, i) => (
          <PhaseCard
            key={phase.id || i}
            phase={phase}
            phaseIndex={i}
            progress={progress}
            onToggle={handleToggle}
          />
        ))}
      </section>

      {/* Sticky Progress Bar */}
      {allTopics.length > 0 && (
        <div className="save-bar" role="complementary" aria-label="Progress tracker">
          <div className="save-bar-progress">
            <div style={{ width: '120px' }}>
              <div className="progress-bar-wrap">
                <div className="progress-bar" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <span className="save-bar-text">
              <strong>{doneCount}</strong> of <strong>{allTopics.length}</strong> topics done
              &nbsp;·&nbsp;
              <strong style={{ color: 'var(--saffron)' }}>{pct}%</strong>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {!saved ? (
              <button
                id="save-bar-btn"
                className="btn btn-primary btn-sm"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving…' : '💾 Save'}
              </button>
            ) : (
              <span className="badge badge-green" style={{ padding: '6px 12px' }}>✓ Auto-saving</span>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`} role="alert" aria-live="polite" id="roadmap-toast">
          {toast.msg}
        </div>
      )}
    </div>
  );
}
