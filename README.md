# 📧 IntelliGuard Mail AI - Intelligent Email Security & Assistant System

An enterprise-grade, AI-powered email intelligence platform built with **React** (Frontend) and **Flask** (Python Backend).

---

## 🚀 Key Features

### 1. 🛡️ Email Security & Threat Defense
- **Spam vs Not Spam Detection**: Automated multi-factor heuristic and neural risk scoring (0-100%).
- **Spam Categorization**:
  - 🏷️ Advertisement Spam
  - 🎣 Phishing Spam
  - 💰 Financial Scam
  - 💼 Job Spam
  - 🎟️ Lottery / Prize Spam
  - 🔗 Malicious Link Spam (Executable payloads & suspicious TLDs like `.ru`, `.xyz`, `.top`, IP URLs)
  - 📁 Other Spam
  - 🛡️ Clean / Verified Ham
- **Threat Indicator Audit**: Flags brand spoofing (PayPal, Google, ICICI, etc.), artificial urgency, sensitive credential harvesting, and suspicious link domains.

### 2. 📝 Email Summarization
- **AI Executive Summary (TL;DR)** for fast decision-making.
- **📌 Key Takeaways & Points** bullet list.
- **📅 Extracted Dates & Deadlines** (Calendar recognition).
- **📋 Action Items Checklist** with interactive checkmarks.

### 3. 💬 Smart Reply Generation
- Context-aware reply generator supporting 4 distinct tones:
  - 👔 **Professional**
  - 🤝 **Friendly**
  - 🏛️ **Formal**
  - 🚫 **Direct / Decline**
- One-click copy to clipboard with instant draft composer.

### 4. 🌐 Language Detection & Translation
- Auto-detects language (English, Tamil, Hindi, Telugu, Malayalam, Spanish, French, German, Japanese, etc.) with confidence score.
- On-demand multilingual translation with automated fallback.

### 5. 📊 Email Security Dashboard
- Real-time KPIs: Total Scanned, Spam Detected, Clean Messages, Security Health Index (0-100%).
- Spam Categorization breakdown charts.
- Threat severity matrix (Critical, High, Moderate, Safe).
- Multi-lingual distribution.
- Critical Threat Alert feed for immediate action.

### 6. 🔍 Search & Filtering
- Real-time instant search by sender, subject, and content keywords.
- Filter chips: All, Spam Only, Safe Only, Phishing, Financial Scams, Job Spam, Lottery, Malicious Links, Ads.
- Multi-lingual filters & sorting (Highest Threat, Newest, Oldest).

### 7. ✍️ User Feedback & Continuous Learning
- False positive / false negative reporting ("Mark as Safe" / "Mark as Spam").
- Category correction dropdown.
- 5-star rating system with comments saved to persistent knowledge store (`backend/data/feedback.json`).

### 8. 📬 Live IMAP Inbox Fetcher & Instant Demo Sandbox
- Connect directly to Gmail, Outlook, Yahoo, or Custom IMAP servers over secure SSL port 993.
- Interactive step-by-step **Gmail App Password** guide.
- **Live Demo Sandbox** preloaded with realistic phishing threats, Tamil job invitations, Hindi KYC alerts, and corporate agendas.

---

## 🛠️ How to Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Start the Flask Backend
```bash
cd backend
python app.py
```
> Server runs on `http://127.0.0.1:5000`

### 2. Start the React Frontend
```bash
cd frontend
npm run dev
```
> Web UI opens at `http://localhost:5173`

---

## 🔐 How to Connect with Gmail (App Password)
1. Go to your **Google Account** ([myaccount.google.com](https://myaccount.google.com)).
2. Select **Security** -> Enable **2-Step Verification**.
3. Under 2-Step Verification, select **App Passwords**.
4. Generate a 16-character password (name it `IntelliGuard Mail`).
5. In the IntelliGuard UI, click **Connect IMAP**, choose **Gmail**, enter your email, and paste the 16-character App Password!
