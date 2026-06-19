# 🚀 SentinelFlow AI

<p align="center">
  <img scr="./docs/cover.png" width="100%">
</p>

### Autonomous Enterprise Case Intelligence Platform

Built for UiPath AgentHack 2026

SentinelFlow AI is an autonomous enterprise case intelligence platform that combines AI agents, human approvals, explainable AI, and workflow orchestration to resolve complex business cases from intake to resolution.

## 🌍 Problem

Modern enterprises face complex operational challenges:

* Invoice disputes
* Compliance investigations
* Customer complaints
* Missing documentation
* Slow manual approvals
* Fragmented workflows
* Lack of transparency and auditability

These processes are often slow, error-prone, and difficult to scale.

---

## 💡 Solution

SentinelFlow AI introduces a multi-agent architecture that combines AI-powered decision making with human approvals and auditability.

The platform orchestrates cases through specialized agents, ensuring explainability, resilience, and enterprise readiness.

---

## ✨ Features

* Multi-Agent Architecture
* Explainable AI
* Human-in-the-loop workflows
* Enterprise Dashboard
* Risk Analysis
* Timeline Memory
* Notifications
* Audit Logs
* Analytics
* MongoDB Persistence
* Gemini AI Integration
* UiPath Maestro-inspired orchestration

---

## 🧠 AI Agents

Case Brain Agent

↓

Document Agent

↓

Risk Agent

↓

Exception Agent

↓

Human Review Agent

↓

Resolution Agent

↓

Audit Agent

↓

Notification Agent

---

## 🏗 Architecture

User

↓

Frontend (Next.js)

↓

API Routes

↓

Case Brain Agent

↓

Document Agent

↓

Risk Agent (Gemini)

↓

Exception Agent

↓

Human Review

↓

Resolution Agent

↓

MongoDB

↓

Audit Logs + Notifications

↓

Dashboard

---

## ⚙ Tech Stack

### Frontend

* Next.js 16
* TypeScript
* TailwindCSS

### Backend

* Node.js

### Database

* MongoDB Atlas

### AI

* Gemini 2.5 Flash

### Visualization

* Recharts

### Architecture

* UiPath Maestro-inspired orchestration

---

## 📊 Pages

* Home
* Dashboard
* Cases
* Case Details
* Analytics
* Timeline
* Notifications
* Audit Logs
* Settings
* About

---

# UiPath Components Used

SentinelFlow AI leverages the following UiPath ecosystem components and concepts:

* Agent Builder
* Maestro-inspired orchestration
* API Workflows
* Human-in-the-loop approvals
* Action Center concepts
* AI-driven decision agents
* Workflow orchestration patterns
* Case lifecycle management
* Audit and monitoring capabilities

# Agent Type

SentinelFlow AI uses both **Coded Agents** and **Low-code Agent concepts**.

* Coded Agents are implemented using Next.js, TypeScript, Node.js, and Gemini 2.5 Flash.
* Low-code concepts are inspired by UiPath Maestro orchestration and human approval workflows.

# Setup Instructions

## Prerequisites

* Node.js 20+
* npm
* MongoDB Atlas account
* Gemini API Key

## Step 1 — Clone Repository

```bash
git clone https://github.com/ASASANTA360/SentinelFlow-AI.git
cd SentinelFlow-AI
```

## Step 2 — Install Dependencies

```bash
npm install
```

## Step 3 — Configure Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

## Step 4 — Run Development Server

```bash
npm run dev
```

Application runs on:

```text
http://localhost:3000
```

## Step 5 — Open Dashboard

Available pages:

* Home
* Dashboard
* Cases
* Case Details
* Analytics
* Timeline
* Notifications
* Audit Logs
* Settings
* About

## Step 6 — Case Workflow

1. Submit a case.
2. Case Brain Agent analyzes the request.
3. Document Agent validates information.
4. Risk Agent performs AI analysis.
5. Exception Agent detects anomalies.
6. Human Review Agent requests approval if necessary.
7. Resolution Agent resolves the case.
8. Audit Agent stores logs.
9. Notification Agent updates stakeholders.

# Judging Notes

SentinelFlow AI demonstrates autonomous enterprise case intelligence using multi-agent orchestration, explainable AI, human approvals, and audit-ready workflows. The platform combines coded agents with low-code orchestration concepts inspired by UiPath Maestro.

## 🚀 Live Demo

https://sentinel-flow-ai-xi.vercel.app/

---

## 📂 Repository

https://github.com/ASASANTA360/SentinelFlow-AI

---

## 🔮 Future Roadmap

* Real-time agent monitoring
* Multi-user collaboration
* Role-based access control
* Vector memory
* Document upload intelligence
* MCP integrations
* Enterprise workflow automation

---

Built for UiPath AgentHack 2026.
