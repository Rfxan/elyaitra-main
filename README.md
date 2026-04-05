# 🛡️ Elyaitra: Agentic AI Cybersecurity Defense

### **AI Hackathon 2026 - Foundation Track: Cybersecurity**

> **Official Track Submission:** Foundation Track - Cybersecurity  
> **Topic:** Building an agentic AI system for autonomous threat detection, investigation, and response.

---

## 🚀 Project Overview

**Elyaitra** is a local-first, agentic AI cybersecurity platform designed to automate the lifecycle of threat management. In modern security operations (SecOps), human analysts are often overwhelmed by "alert fatigue." Elyaitra solves this by deploying an intelligent autonomous agent that not only detects threats but reasons through them, investigates the root cause, and proposes evolved defense strategies.

### **The Problem**
Traditional Security Information and Event Management (SIEM) systems generate thousands of alerts, most of which are false positives. Manually investigating each anomaly is time-consuming and leads to missed critical incidents.

### **The Solution**
Elyaitra uses a **multi-step agentic loop** powered by local LLMs (via Ollama) to:
1.  **Analyze** raw system logs in real-time.
2.  **Reason** about anomalies using a dedicated "Investigation Engine."
3.  **Act** by generating response plans and evolving system defenses based on attack patterns.

---

## ✨ Key Features

- 🕵️ **Autonomous Threat Investigation** — The agent uses a reasoning loop to distinguish between normal activity and sophisticated attacks (DDoS, SQLi, Brute Force).
- 🔄 **Agentic Response Loop** — Multi-turn AI thinking that simulates a tier-2 security analyst.
- 🛠️ **Blazing Fast Architecture** — Leverages **Groq** LPUs for near-instant inference, ensuring the agent responds in real-time to active threats.
- 📊 **Real-time Security Dashboard** — A premium, dark-themed command center for live monitoring and manual override.
- 🧬 **Adaptive Defense Evolution** — The system learns from every investigation, updating its internal "defense knowledge base" to prevent future attacks.

---

## 🏗️ Architecture

### **1. AI Inference (The Brain)**
*   **LLM Provider**: **Groq** (Primary) or Google Gemini.
*   **Model**: `llama-3.3-70b-versatile` via Groq for ultra-low latency agentic reasoning.
*   **Agentic Framework**: Custom implementation with tool-calling capabilities.

### **2. Data Pipeline (The Sensory System)**
*   **Ingestion**: Real-time log streaming through `/api/threats/detect`.
*   **Contextualization**: Enrichment of logs with historical defense data.
*   **Retrieval**: RAG (Retrieval Augmented Generation) for syllabus/security protocol adherence.

### **3. Frontend (The Command Center)**
*   **Tech Stack**: Next.js 15+, React, Tailwind CSS, Framer Motion.
*   **Features**: Real-time threat streaming, investigation playback, and interactive defense graphs.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Python 3.8+ (FastAPI), Node.js (Next.js API Routes)
- **AI/ML**: Groq API, Google Gemini API, Ollama (local LLMs)
- **Database**: SQLite (development), PostgreSQL (production)
- **Vector Store**: ChromaDB for embeddings and retrieval
- **Security**: bcrypt, JWT authentication, custom security middleware

---

## 📸 Screenshots

| Dashboard Overview | Threat Investigation Loop |
| :---: | :---: |
| ![Dashboard1](/screenshots/dashboard_main.png) | ![Investigation](/screenshots/investigation_loop.png) |

---

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** 18+ (for frontend)
- **Python** 3.8+ (for backend)
- **Git** (to clone the repository)

### **Quick Setup (Recommended for Hackathon Evaluation)**
For fastest setup, run the automated setup script:
```bash
# Clone the repository
git clone <repository-url>
cd elyaitra-main

# Run the setup script (installs all dependencies and initializes database)
./setup.sh
```

### **Manual Setup**
If you prefer manual setup or the script doesn't work on your system:
```bash
# Navigate to frontend directory
cd src/client

# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend will be available at: `http://localhost:3000`

### **3. Backend Setup (FastAPI)**
```bash
# Navigate to backend directory
cd ../server

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Linux/Mac:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API will be available at: `http://localhost:8000`

### **4. Environment Configuration (Optional)**
For AI features, create a `.env` file in the root directory:
```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your API keys (required for AI features)
GROQ_API_KEY=your_groq_api_key_here
LLM_PROVIDER=groq  # Options: groq, gemini, ollama
```

### **5. Access the Application**
- **Frontend Dashboard**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### **Troubleshooting**
- **Frontend build errors**: Ensure you're in the `src/client` directory and have run `npm install`
- **Backend import errors**: Make sure the virtual environment is activated and all dependencies are installed
- **Port conflicts**: Change ports if 3000 or 8000 are already in use
- **AI features not working**: Check that your `.env` file has valid API keys

### **Development Commands**
```bash
# Frontend
cd src/client
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint

# Backend
cd src/server
python -m pytest  # Run tests (if available)
```

### **What to Expect**
- **Out of the Box**: The system runs immediately with mock AI responses demonstrating all features
- **With API Keys**: Full AI-powered threat detection, investigation, and response capabilities
- **Database**: SQLite database is automatically created and populated
- **Ports**: Frontend on 3000, Backend on 8000

### **Key Features to Evaluate**
1. **Real-time Dashboard**: Live threat monitoring and security metrics
2. **AI Investigation**: Autonomous threat analysis and reasoning (mock responses show the interface)
3. **Interactive Defense**: Manual override and response planning
4. **Multi-turn AI**: Agentic loop for complex threat scenarios
5. **Security Logging**: Comprehensive audit trail and event correlation

---

## 📁 Project Structure

```
elyaitra-main/
├── src/
│   ├── client/          # Next.js Frontend
│   │   ├── src/
│   │   │   ├── app/     # Next.js App Router
│   │   │   ├── components/  # React Components
│   │   │   └── lib/     # Utilities & Libraries
│   │   └── package.json
│   └── server/          # FastAPI Backend
│       ├── app/
│       │   ├── ai_engine/    # AI/ML Components
│       │   ├── api/          # API Endpoints
│       │   ├── core/         # Core Configuration
│       │   ├── db/           # Database Models
│       │   └── security/     # Security Modules
│       └── requirements.txt
├── data/                # Training Data
└── .env.example         # Environment Variables Template
```

---

- [x] Code strictly follows the `/src` structure.
- [x] All dependencies listed in `package.json` and `requirements.txt`.
- [x] README includes all mandatory sections.
- [x] Working demo video/GIF provided in `demo.md`.
- [x] No external links for datasets or code.

---

## 👥 Team
- **Eshaan Aggarwal**
- **Ryan**
- **Aditya**
- **Ashutosh**

---
**Build a working system, not just an idea.**
