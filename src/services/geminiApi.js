import { attachLinksToRoadmap } from './resourceEngine';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash-lite';

function makeRequest(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    }),
  });
}

function extractJSON(data) {
  const parts = data.candidates?.[0]?.content?.parts || [];
  const text = (parts.find(p => p.text) || parts[0])?.text?.trim();
  if (!text) throw new Error('Gemini returned an empty response. Please try again.');

  if (text.toLowerCase().includes('quota') || text.toLowerCase().includes('exceeded')) {
    throw new Error('Google AI Quota Exceeded (Free Tier Rate Limit). Please wait 60 seconds and try again!');
  }

  let clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // 1. Direct parse
  try { return JSON.parse(clean); } catch (e) { }

  // 2. Remove trailing commas
  try {
    clean = clean.replace(/,\s*([\]}])/g, '$1');
    return JSON.parse(clean);
  } catch (e) { }

  // 3. Extract bracketed object
  try {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
      const matched = match[0].replace(/,\s*([\]}])/g, '$1');
      return JSON.parse(matched);
    }
  } catch (e) { }

  console.error("PathFinder JSON Parse Error. Raw AI Output:", text);
  throw new Error('AI returned invalid JSON. Please try again.');
}

// ── 1. Generate detailed career roadmap ─────────────────────
export async function generateRoadmap({ level, field, goal }) {
  const prompt = `You are an expert Indian education and career counsellor with deep knowledge of the Indian education system, entrance exams, and job market.

Generate a HIGHLY DETAILED, COMPREHENSIVE career roadmap for:
- Current Level: ${level}
- Field / Interest: ${field}  
- Career Goal: ${goal}

Return ONLY this JSON (no markdown, no explanation):
{
  "title": "Specific roadmap title",
  "summary": "3-4 sentence summary of the journey, what makes it unique, and expected outcome",
  "estimatedDuration": "realistic duration e.g. 3-4 years",
  "phases": [
    {
      "id": "phase-1",
      "name": "Phase name",
      "description": "What this phase covers and why it matters",
      "duration": "e.g. 4-6 months",
      "keySkills": ["skill1", "skill2", "skill3"],
      "topics": [
        {
          "id": "topic-1-1",
          "name": "Topic name",
          "description": "Detailed 2-3 sentence description of what to learn and why",
          "estimatedHours": 40,
          "difficulty": "beginner",
          "resources": [
            { "title": "Resource name", "type": "video", "platform": "YouTube" },
            { "title": "Resource name", "type": "course", "platform": "Coursera" },
            { "title": "Resource name", "type": "article", "platform": "Blog/Docs" },
            { "title": "Book: Title by Author", "type": "book", "platform": "Book" }
          ]
        }
      ]
    }
  ]
}

STRICT RULES:
- Include exactly 3-5 phases (e.g., Foundation, Core Skills, Advanced, Projects)
- Include 2-3 key topics per phase
- Include 1-2 highly curated resources per topic (e.g. 1 high quality YouTube video or 1 book)
- estimatedHours: realistic hours per topic
- difficulty: exactly one of "beginner", "intermediate", "advanced"
- type: exactly one of "video", "course", "article", "book", "practice", "website"
- NEVER return URLs. Only return the title and the platform (e.g., YouTube, Coursera, NPTEL, Goodreads, Docs).
- Tailor for Indian students where relevant (e.g., mention NPTEL or specific exams if applicable).
- Keep descriptions clear and concise.`;

  const response = await makeRequest(prompt);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Failed to generate roadmap');
  }

  const rawJson = await response.json();
  const rawRoadmap = extractJSON(rawJson);

  return attachLinksToRoadmap(rawRoadmap);
}

// ── 2. Generate career overview (for Explore page cards) ────

const CACHE_PREFIX = 'pathfinder_explore_';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Normalize a career string into a stable cache key */
function makeCacheKey(career) {
  const normalized = career
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')   // remove special chars
    .replace(/\s+/g, '_');          // spaces → underscores
  return `${CACHE_PREFIX}${normalized}`;
}

/** Read a valid (non-expired) entry from localStorage. Returns null if missing/expired. */
function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const entry = JSON.parse(raw);
    if (!entry?.data || !entry?.expiry) {
      localStorage.removeItem(key);   // corrupted — clean up
      return null;
    }
    if (Date.now() > entry.expiry) {
      localStorage.removeItem(key);   // expired — clean up
      return null;
    }
    return entry.data;
  } catch {
    // JSON parse error or storage error — clean up and fall through to API
    try { localStorage.removeItem(key); } catch { /* ignore */ }
    return null;
  }
}

/** Persist an API result to localStorage with a 24-hour TTL. */
function writeCache(key, data) {
  try {
    const entry = { data, expiry: Date.now() + CACHE_TTL_MS };
    localStorage.setItem(key, JSON.stringify(entry));
    console.log(`[PathFinder] Cache STORED → ${key}`);
  } catch (err) {
    // Silently swallow storage errors (e.g. private-mode quota exceeded)
    console.warn('[PathFinder] Could not write to cache:', err.message);
  }
}

/** In-flight deduplication map: career key → Promise */
const inFlight = new Map();

export async function generateCareerOverview({ career }) {
  const cacheKey = makeCacheKey(career);

  // ── Cache READ ───────────────────────────────────────────
  const cached = readCache(cacheKey);
  if (cached) {
    console.log(`[PathFinder] Cache HIT  → ${cacheKey}`);
    return cached;
  }
  console.log(`[PathFinder] Cache MISS → ${cacheKey}`);

  // ── In-flight deduplication ──────────────────────────────
  // If a request for the same career is already in progress, wait for it
  // instead of firing a second identical API call.
  if (inFlight.has(cacheKey)) {
    console.log(`[PathFinder] Joining in-flight request → ${cacheKey}`);
    return inFlight.get(cacheKey);
  }

  // ── API CALL ─────────────────────────────────────────────
  const prompt = `You are an Indian career counsellor. Give a detailed, practical overview of the career: "${career}" from an Indian perspective.

Return ONLY this JSON:
{
  "title": "${career}",
  "tagline": "One punchy line about this career",
  "overview": "3-4 sentences: what this career involves day-to-day in India, scope, and growth potential",
  "requiredSkills": ["up to 8 core skills needed"],
  "educationPath": "Concise education journey e.g. 12th PCM → B.Tech CSE → Internship → Job",
  "salaryRange": {
    "entry": "Realistic entry-level salary in India (e.g. ₹X-Y LPA)",
    "mid": "Realistic mid-level salary in India",
    "senior": "Realistic senior-level salary in India"
  },
  "topCompanies": ["6 real companies/orgs in India that hire for this role"],
  "keyMilestones": ["5 key milestones on this journey from student to professional"],
  "timeToEnter": "e.g. 2-4 years after 12th",
  "examOrCertifications": ["relevant exams/certs e.g. GATE, CAT, AWS cert"],
  "pros": ["4 genuine advantages of this career in India"],
  "cons": ["3 real challenges of this career"]
}`;

  const fetchPromise = (async () => {
    try {
      const response = await makeRequest(prompt);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error?.message || 'Failed to fetch career overview');
      }
      const result = extractJSON(await response.json());

      // ── Cache WRITE ────────────────────────────────────────
      writeCache(cacheKey, result);

      return result;
    } finally {
      // Always clean up the in-flight entry when request settles
      inFlight.delete(cacheKey);
    }
  })();

  inFlight.set(cacheKey, fetchPromise);
  return fetchPromise;
}
