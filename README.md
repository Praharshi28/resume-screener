# RecruitAI – AI Resume Screener

An AI-powered resume screening web app that ranks candidates based on how well their resumes match a job description.

Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, runs directly in the browser.

---

## Features

- Upload multiple resumes as `.txt` files
- Paste any job description
- AI ranks candidates by match score (0–100%)
- Shows strengths, gaps, and hiring recommendation per candidate
- Clean dark UI with animated score bars

---

## Tech Stack

- HTML / CSS / JavaScript (vanilla)
- Cohere API (`command-r-08-2024`) for AI analysis
- No frameworks, no build step needed

---

## How to Run Locally

### Option 1 – VS Code Live Server
1. Install [VS Code](https://code.visualstudio.com/) and the **Live Server** extension
2. Right-click `index.html` → **Open with Live Server**
3. Opens at `http://127.0.0.1:5500`

### Option 2 – Python
```bash
python -m http.server 8080
```
Then open `http://localhost:8080`

---

## How to Use

1. Get a free Cohere API key at [dashboard.cohere.com](https://dashboard.cohere.com) (no credit card needed)
2. Paste your API key in the app
3. Enter a job description
4. Upload `.txt` resume files
5. Click **Screen Resumes**

> To convert a PDF resume to .txt: open PDF → Select All → Copy → paste into Notepad → Save as `.txt`

---

## Project Structure

```
resume-screener/
├── index.html               # Main page
├── style.css                # All styles
├── app.js                   # Logic & Cohere API integration
├── sample-resume-john.txt   # Sample resume (experienced)
├── sample-resume-priya.txt  # Sample resume (fresher)
└── README.md
```

---

## Screenshots

<img width="918" height="1002" alt="image" src="https://github.com/user-attachments/assets/58817d17-172f-49dc-8474-6eb77407d5fc" />

<img width="917" height="1011" alt="image" src="https://github.com/user-attachments/assets/92356c35-2646-47be-b48c-3aa3d0b09ff2" />

---

## Live Demo

https://resume-screener-brown.vercel.app/

---

## License

MIT
