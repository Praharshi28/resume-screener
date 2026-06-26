// ===========================
// STATE
// ===========================
let uploadedFiles = [];

// ===========================
// FILE UPLOAD HANDLING
// ===========================
const fileInput = document.getElementById('fileInput');
const uploadZone = document.getElementById('uploadZone');
const fileList = document.getElementById('fileList');

fileInput.addEventListener('change', (e) => addFiles(e.target.files));

uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('drag-over');
});
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  addFiles(e.dataTransfer.files);
});

function addFiles(fileObjs) {
  const txtFiles = Array.from(fileObjs).filter(f => f.name.endsWith('.txt'));
  if (txtFiles.length < fileObjs.length) {
    showError('Only .txt files are supported. Other files were skipped.');
  }
  txtFiles.forEach(file => {
    if (!uploadedFiles.find(f => f.name === file.name)) {
      uploadedFiles.push(file);
    }
  });
  renderFileList();
}

function removeFile(name) {
  uploadedFiles = uploadedFiles.filter(f => f.name !== name);
  renderFileList();
}

function renderFileList() {
  fileList.innerHTML = '';
  uploadedFiles.forEach(file => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML =
      '<div><strong>' + file.name + '</strong> <span>' + (file.size / 1024).toFixed(1) + ' KB</span></div>' +
      '<button class="file-remove" onclick="removeFile(\'' + file.name + '\')" title="Remove">✕</button>';
    fileList.appendChild(item);
  });
}

// ===========================
// READ FILE AS TEXT
// ===========================
function readFileText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read ' + file.name));
    reader.readAsText(file);
  });
}

// ===========================
// MAIN SCREENING LOGIC
// ===========================
async function runScreening() {
  const apiKey = document.getElementById('apiKey').value.trim();
  const jobDesc = document.getElementById('jobDesc').value.trim();

  clearError();

  if (!apiKey) return showError('Please enter your Cohere API key.');
  if (!jobDesc) return showError('Please enter a job description.');
  if (uploadedFiles.length === 0) return showError('Please upload at least one resume (.txt file).');

  setLoading(true);

  try {
    const resumes = [];
    for (const file of uploadedFiles) {
      const text = await readFileText(file);
      resumes.push({ name: file.name.replace('.txt', ''), content: text });
    }

    const resumeBlock = resumes.map((r, i) =>
      '--- RESUME ' + (i + 1) + ': ' + r.name + ' ---\n' + r.content
    ).join('\n\n');

    const prompt = `You are an expert recruiter and hiring manager. Screen and rank candidates based on how well their resumes match the job description.

JOB DESCRIPTION:
${jobDesc}

RESUMES TO EVALUATE:
${resumeBlock}

Respond ONLY with a valid JSON array (no markdown, no backticks, no extra text).

Format:
[
  {
    "name": "Candidate name (use resume filename if no name found)",
    "score": 85,
    "summary": "One sentence overview of this candidate",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "gaps": ["gap 1", "gap 2"],
    "verdict": "2-3 sentences explaining hiring recommendation for this specific role",
    "recommendation": "Strong Hire"
  }
]

recommendation must be one of: Strong Hire, Hire, Maybe, No Hire
Score is 0-100. Order by score descending. Return ONLY the JSON array.`;

    const response = await fetch('https://api.cohere.com/v2/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'command-r-08-2024',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.message || ('API error: ' + response.status);
      throw new Error(msg);
    }

    const data = await response.json();
    const rawText = data?.message?.content?.[0]?.text || '';

    if (!rawText) throw new Error('No response from Cohere. Please try again.');

    let candidates;
    try {
      const clean = rawText.replace(/```json|```/g, '').trim();
      candidates = JSON.parse(clean);
    } catch {
      throw new Error('Unexpected response format. Please try again.');
    }

    if (!Array.isArray(candidates) || candidates.length === 0) {
      throw new Error('No candidate data returned. Please check your resumes and try again.');
    }

    renderResults(candidates);
  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
}

// ===========================
// RENDER RESULTS
// ===========================
function renderResults(candidates) {
  const section = document.getElementById('resultsSection');
  const grid = document.getElementById('resultsGrid');
  grid.innerHTML = '';

  candidates.forEach((c, i) => {
    const score = Math.min(100, Math.max(0, parseInt(c.score) || 0));
    const scoreClass = score >= 70 ? 'score-high' : score >= 45 ? 'score-med' : 'score-low';
    const isTop = i === 0;

    const strengths = (c.strengths || []).map(s =>
      '<span class="tag tag-strength">' + escapeHtml(s) + '</span>'
    ).join('');

    const gaps = (c.gaps || []).map(g =>
      '<span class="tag tag-gap">' + escapeHtml(g) + '</span>'
    ).join('');

    const recColor = {
      'Strong Hire': 'var(--success)',
      'Hire': 'var(--accent)',
      'Maybe': 'var(--warning)',
      'No Hire': 'var(--danger)'
    }[c.recommendation] || 'var(--muted)';

    const card = document.createElement('div');
    card.className = 'candidate-card ' + scoreClass;
    card.innerHTML =
      '<div class="card-rank">Rank #' + (i + 1) + '</div>' +
      '<div class="card-top">' +
        (isTop ? '<div class="top-badge">⭐ Top Match</div>' : '') +
        '<div class="candidate-name">' + escapeHtml(c.name || 'Unknown Candidate') + '</div>' +
        '<div class="score-row">' +
          '<span class="score-label">Match</span>' +
          '<div class="score-bar-wrap"><div class="score-bar" style="width:0%" data-width="' + score + '%"></div></div>' +
          '<span class="score-val">' + score + '%</span>' +
        '</div>' +
      '</div>' +
      (c.summary ? '<div class="card-section"><p>' + escapeHtml(c.summary) + '</p></div>' : '') +
      (strengths ? '<div class="card-section"><h4>Strengths</h4><div class="strengths">' + strengths + '</div></div>' : '') +
      (gaps ? '<div class="card-section"><h4>Gaps</h4><div class="gaps">' + gaps + '</div></div>' : '') +
      '<div class="verdict">' +
        (c.recommendation ? '<strong style="color:' + recColor + '">' + escapeHtml(c.recommendation) + '</strong> — ' : '') +
        escapeHtml(c.verdict || '') +
      '</div>';

    grid.appendChild(card);
  });

  section.classList.remove('hidden');
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });

  setTimeout(() => {
    document.querySelectorAll('.score-bar[data-width]').forEach(bar => {
      bar.style.width = bar.dataset.width;
    });
  }, 200);
}

// ===========================
// RESET
// ===========================
function resetScreener() {
  document.getElementById('resultsSection').classList.add('hidden');
  document.getElementById('resultsGrid').innerHTML = '';
  document.getElementById('screener').scrollIntoView({ behavior: 'smooth' });
}

// ===========================
// UI HELPERS
// ===========================
function setLoading(on) {
  const btn = document.getElementById('screenBtn');
  const text = document.getElementById('btnText');
  const loader = document.getElementById('btnLoader');
  btn.disabled = on;
  text.textContent = on ? 'Analyzing resumes…' : 'Screen Resumes';
  loader.classList.toggle('hidden', !on);
}

function showError(msg) {
  const box = document.getElementById('errorBox');
  box.textContent = msg;
  box.classList.remove('hidden');
}

function clearError() {
  const box = document.getElementById('errorBox');
  box.classList.add('hidden');
  box.textContent = '';
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}