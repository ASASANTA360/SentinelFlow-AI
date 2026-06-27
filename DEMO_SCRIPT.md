# SentinelFlow AI Demo Script

## 2-3 Minute Judge Demo

Hello judges, this is SentinelFlow AI, a case-management and human-review workflow built for UiPath AgentHack 2026.

The product today demonstrates a realistic enterprise case lifecycle: a user creates a case, the case is stored in MongoDB, the case can be routed to human review, resolved, and then inspected through timeline, audit, dashboard, and analytics views. For this demo, I will focus only on what is working in the live product now.

Start on the Home page and click `Launch Demo`, or go directly to `/dashboard`.

On the Dashboard, I can see live case totals, active cases, high-risk cases, resolution rate, recent enterprise cases, human reviews, and resolved cases. These values are based on records loaded from the application API and MongoDB.

Next, I open `Cases`.

Here I create a new case. I enter a title, a description, an optional priority, and choose a risk level. When I click `Create Case`, SentinelFlow creates a new case record, generates a unique case identifier, and records the first event and audit log for traceability.

Now I open the new case detail page from the case list.

This page shows the case status, risk level, assigned agent label, priority, and the case's event and audit history. To show the human-in-the-loop workflow, I click `Send to Human Review`. The status changes to Human Review, and the system records a case update event and an audit entry.

Next, I click `Resolve Case`.

The case status is now Resolved. The case detail page shows the updated status, and the Events and Audit Logs sections show the history of what happened to this case. This gives the reviewer a traceable record of intake, review, and resolution.

Now I open `Timeline`.

The Timeline page shows case events across the system, including the creation and update events for the case I just demonstrated. This is useful for understanding operational flow across many cases.

Next, I open `Audit`.

The Audit page shows recorded audit entries such as case creation and case update actions, linked back to the relevant case. This is the compliance view: what changed, when it changed, and which actor performed the action.

Finally, I open `Analytics`.

Analytics summarizes the live case data with total cases, active cases, high-risk cases, human reviews, risk distribution, status distribution, and resolution performance. After resolving the case, the resolution metrics and status distribution reflect the updated data.

To be clear, this live demo does not claim a working UiPath Maestro integration, Agent Builder implementation, Action Center workflow, notifications, or live Gemini analysis in the main case workflow. Those are roadmap directions. What is working today is the core case lifecycle: creation, persistence, human review, resolution, event history, audit logging, dashboard visibility, and analytics.

SentinelFlow AI is designed to show how an enterprise case workflow can combine structured case management, human oversight, and audit-ready records. The next step is connecting this proven workflow foundation to UiPath orchestration and enterprise automation systems.
