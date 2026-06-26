# 🚀 SentinelFlow AI

<p align="center">
  <img src="./docs/cover.png" alt="SentinelFlow AI cover" width="100%">
</p>

<p align="center">
  <strong>Autonomous Enterprise Case Intelligence Platform</strong><br>
  Built for UiPath AgentHack 2026
</p>

SentinelFlow AI is an autonomous enterprise case-intelligence platform that combines AI agents, UiPath workflow orchestration, human approvals, explainable decisions, and audit-ready records to help resolve complex business cases from intake to resolution.

---

## 🌍 Problem

Modern enterprises handle complex operational cases such as:

* Invoice disputes
* Compliance investigations
* Customer complaints
* Missing documentation
* Manual approval delays
* Fragmented workflows
* Risk and exception handling
* Limited transparency and auditability

These processes are often slow, error-prone, difficult to trace, and expensive to scale across teams.

---

## 💡 Solution

SentinelFlow AI introduces a multi-agent workflow that combines AI-powered analysis with human oversight and enterprise auditability.

The platform coordinates specialized agents to review cases, analyze documents, identify risks, detect exceptions, request approvals, record audit events, and notify stakeholders.

This approach enables automation while keeping important decisions explainable and reviewable.

---

## ✨ Features

* Multi-agent case workflow orchestration
* Gemini-powered risk and document analysis
* Human-in-the-loop approval workflow
* UiPath Maestro integration and orchestration support
* Enterprise dashboard for case management
* Risk analysis and exception detection
* Case timeline and workflow memory
* Notifications and stakeholder updates
* Audit logs and traceability
* Operational analytics
* MongoDB Atlas persistence
* Public Vercel deployment

---

## 🧠 AI Agent Workflow

```text
Case Intake Agent
        ↓
Document Review Agent
        ↓
Risk Analysis Agent
        ↓
Exception Agent
        ↓
Human Review and Approval
        ↓
Resolution Agent
        ↓
Audit Agent
        ↓
Notification Agent
        ↓
Analytics Dashboard
```

Each agent has a defined responsibility, helping the system maintain clear handoffs, transparent reasoning, and accountable outcomes.

---

## 🏗 Architecture

```text
User
  ↓
Next.js Frontend
  ↓
API Routes
  ↓
Case Brain Agent
  ↓
Document Review Agent
  ↓
Risk Analysis Agent (Gemini 2.5 Flash)
  ↓
Exception and Escalation Agent
  ↓
UiPath Maestro Workflow Orchestration
  ↓
Human Approval
  ↓
Resolution Agent
  ↓
MongoDB Atlas
  ↓
Audit Logs, Notifications, and Analytics
```

---

## ⚙ Tech Stack

### Frontend

* Next.js 16
* TypeScript
* Tailwind CSS
* Recharts

### Backend

* Node.js
* Next.js API Routes

### Database

* MongoDB Atlas

### AI

* Google Gemini 2.5 Flash

### UiPath Components

* UiPath Agent Builder
* UiPath Maestro integration
* API Workflows
* Human-in-the-loop approvals
* Action Center concepts
* Workflow orchestration patterns
* Case lifecycle management
* Audit and monitoring concepts

### Deployment

* Vercel

---

## 📊 Application Pages

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

## 🤖 Agent Type

SentinelFlow AI uses both coded agents and low-code orchestration concepts.

### Coded Agents

The coded agents are implemented with:

* Next.js
* TypeScript
* Node.js
* Gemini 2.5 Flash
* MongoDB Atlas

### Low-Code Workflow Concepts

The project uses UiPath Maestro integration and workflow patterns for:

* Agent coordination
* Workflow handoffs
* Human approvals
* Escalation paths
* Case lifecycle management
* Auditability

---

## 🛠 Setup Instructions

### Prerequisites

* Node.js 20 or later
* npm
* MongoDB Atlas account
* Gemini API key
* UiPath environment and required integration credentials

### 1. Clone the Repository

```bash
git clone https://github.com/ASASANTA360/SentinelFlow-AI.git
cd SentinelFlow-AI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Add UiPath-related environment variables required by your integration setup.

### 4. Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Run a Production Build

```bash
npm run build
```

### 6. Test the Case Workflow

1. Create or open a case.
2. The Case Intake Agent analyzes the submitted information.
3. The Document Review Agent checks available case documents.
4. The Risk Analysis Agent performs Gemini-assisted analysis.
5. The Exception Agent identifies anomalies or missing requirements.
6. UiPath Maestro coordinates workflow steps and approvals.
7. A Human Review Agent requests approval where required.
8. The Resolution Agent records the case outcome.
9. The Audit Agent stores traceable workflow events.
10. The Notification Agent updates relevant stakeholders.

---

## 🏆 Accomplishments

We are proud of building:

* A functional end-to-end enterprise case workflow prototype
* Gemini-powered analysis for case and risk intelligence
* MongoDB Atlas-backed persistence
* UiPath Maestro workflow integration
* Specialized agents for intake, review, escalation, audit, resolution, and notifications
* A multi-page enterprise dashboard
* Case timelines, notifications, analytics, and audit logging
* Human-in-the-loop approvals
* Public source code and deployed demo
* A successful production build

---

## 📚 What We Learned

Building SentinelFlow AI reinforced that enterprise AI requires more than intelligence.

Trustworthy enterprise workflows need:

* Explainability
* Human oversight
* Clear escalation paths
* Persistent audit trails
* Structured case history
* Reliable orchestration
* Secure and resilient system design

The goal is not to remove people from enterprise decisions. The goal is to help people and AI agents collaborate more effectively.

---

## 🔮 Future Roadmap

* Real-time agent monitoring
* Role-based access control
* Multi-user collaboration
* Vector memory and case context
* Advanced document-upload intelligence
* MCP integrations
* External enterprise-system integrations
* Multi-tenant support
* Workflow templates
* Advanced analytics and reporting
* Expanded UiPath Agent Builder and Maestro workflows

---

## 🚀 Live Demo

https://sentinel-flow-ai-xi.vercel.app/

## 📂 Repository

https://github.com/ASASANTA360/SentinelFlow-AI

---

Built for UiPath AgentHack 2026.
