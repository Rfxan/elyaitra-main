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

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Python (FastAPI), Node.js (Next API Routes)
- **AI/ML**: Ollama, Google Gemini API, LangChain-style reasoning
- **Storage**: Vector Indexing for Security Protocols

---

## 📸 Screenshots

| Dashboard Overview | Threat Investigation Loop |
| :---: | :---: |
| ![Dashboard1](/screenshots/dashboard_main.png) | ![Investigation](/screenshots/investigation_loop.png) |

---

## 🚀 Quick Start

### **1. Configure Groq**
Ensure you have a Groq API Key from [console.groq.com](https://console.groq.com/).
```bash
# Add your key to .env
GROQ_API_KEY=gsk_...
```

### **2. Environment Configuration**
Copy the example environment file and fill in your details:
```bash
cp .env.example .env
```

### **3. Install & Run**
```bash
# Install dependencies
npm install

# Run the project
npm run dev
```

---

## 🏁 Pre-Submission Checklist

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
