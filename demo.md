# 🛡️ Elyaitra - Working Demo

## **Project:** AI Hackathon 2026 - Cybersecurity Foundation Track

> **Submission Template Check:** All instructions below ensure a working demo for the judges.

---

## **1. Live Prototype Setup**

Follow these steps to experience the **Agentic AI Cybersecurity System** locally:

### **Prerequisites**
- **Groq API Key**: Obtain from [console.groq.com](https://console.groq.com/).
- **Python 3.10+**: For backend engines.
- **Node.js 20+**: For the Next.js frontend.

### **Quick Install**
```bash
# 1. Setup Environment
cp .env.example .env
# Ensure GROQ_API_KEY is set in your environment

# 2. Navigate and install
npm install
cd src/server
pip install -r requirements.txt
```

---

## **2. Demo Scenario: "The Autonomous Analyst"**

To demonstrate the **Agentic Investigation Loop**:

### **Step 1: Start the Dashboard**
- Run `npm run dev`.
- Visit `http://localhost:3000/cybersecurity`.

### **Step 2: Trigger a Simulated Threat**
- Click **"Simulate Log Activity"** on the dashboard.
- Watch the **Real-time Threat Ticker** as raw system logs stream in.

### **Step 3: Agentic Investigation**
- Once a threat (e.g., *Recursive Traversal* or *Brute Force*) is detected:
  - The **Autonomous Agent** will automatically start a reasoning loop via **Groq**.
  - You will see the agent's "thinking" process: *"Investigating user IP... Checking for similar headers in historical logs... Confirmed exploit attempt."*

### **Step 4: Adaptive Defense**
- The agent will generate a **Response Plan**.
- Click **"Evolve Defense"** to see how the system updates its internal security signatures to block this attack in the future.

---

## **3. Visual Proof**

### **Walkthrough Video**
*   **Link**: (Insert Loom/YouTube video link here - e.g., `https://www.youtube.com/watch?v=your_video_id`)

### **Project Recordings (GIFs)**
| Real-time Detection | Agentic Reasoning Loop |
| :---: | :---: |
| ![Live Detection](/screenshots/detection_live.gif) | ![Reasoning Loop](/screenshots/reasoning_loop.gif) |

---

## **4. Troubleshooting the Demo**

- **Latency Issues**: In the rare event of API throttling, ensured the fallback to Gemini is configured.
- **Port Conflicts**: If port `3000` is taken, use `PORT=3001 npm run dev`.
- **API Errors**: Check the terminal logs for connectivity issues with the Groq endpoint.

---
**Build a working system, not just an idea.**
