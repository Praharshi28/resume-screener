# RecruitAI – Resume Screener

An AI-powered resume screening web app that ranks candidates against a job description using Claude AI.

---

## 📁 Files

```
resume-screener/
├── index.html              ← Main webpage
├── style.css               ← All styles
├── app.js                  ← All logic
├── sample-resume-john.txt  ← Sample resume for testing
├── sample-resume-priya.txt ← Sample resume for testing
└── README.md
```

---

## 🚀 How to Run

### Option 1 – Just open in browser (simplest)
1. Double-click `index.html`
2. It will open in your browser

> ⚠️ Note: Some browsers block API calls when opening files directly (CORS issues). If it doesn't work, use Option 2.

---

### Option 2 – Use VS Code Live Server (recommended)
1. Install [VS Code](https://code.visualstudio.com/)
2. Install the **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**
4. The site opens at `http://127.0.0.1:5500`

---

### Option 3 – Use Python local server
```bash
# Navigate to the project folder
cd resume-screener

# Python 3
python -m http.server 8080

# Then open: http://localhost:8080
```

---

## 🔑 Getting an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / Log in
3. Go to **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)
5. Paste it into the app when prompted

> Your key is only used client-side to call Anthropic's API directly. It is never stored anywhere.

---

## 📄 Resume Format

Resumes must be uploaded as `.txt` files.

To convert a PDF resume to .txt:
- Open the PDF → Select All → Copy → Paste into Notepad → Save as .txt

---

## 🧪 Testing

Two sample resumes are included:
- `sample-resume-john.txt` — experienced developer
- `sample-resume-priya.txt` — fresher/junior developer

Try this job description to test:
```
We are looking for a Frontend Developer with 2+ years of experience in React and TypeScript. 
The candidate should be comfortable with REST API integration, Git, and agile workflows. 
Experience with Next.js or Node.js is a plus.
```

---

## ⚠️ Known Limitations

- Only `.txt` resumes are supported (not PDF directly)
- Max recommended: 10 resumes per screening (API token limits)
- Requires a valid Anthropic API key with available credits
