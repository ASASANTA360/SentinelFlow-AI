# SentinelFlow on Alibaba Cloud Function Compute

This directory contains the backend deployed for SentinelFlow AI on **Alibaba Cloud Function Compute 3.0**.

## Deployment

| Setting | Value |
| --- | --- |
| Cloud service | Alibaba Cloud Function Compute 3.0 |
| Region | China (Hangzhou), `cn-hangzhou` |
| Function | `sentinelflow-alibaba-api` |
| Function type | Web Function with HTTP Trigger |
| Runtime | Custom Runtime, Python 3.10 on Debian 10 |
| Startup command | `python3 app.py` |
| Listening port | `9000` |
| Trigger security | Signature Authentication |

The function has been deployed from this source package using the Function Compute console. The HTTP trigger is kept behind signature authentication so internal integration routes and server-side credentials are not exposed publicly.

## API routes

- `GET /health` and `GET /api/health`: return deployment/runtime health metadata.
- `GET /api/uipath/jobs`: obtains a UiPath OAuth client-credentials token server-side and returns safe Orchestrator job metadata only.

## Required Function Compute environment variables

```text
UIPATH_ORG
UIPATH_APP_ID
UIPATH_APP_SECRET
UIPATH_SCOPES
UIPATH_ORCHESTRATOR_URL
UIPATH_FOLDER_ID
```

Do not commit production values for these variables. The code never returns UiPath access tokens, app secrets, or internal job `Info` fields.

## Package and deploy

Create a ZIP containing these files at the archive root:

```text
app.py
README.md
.gitignore
```

In Alibaba Cloud Function Compute, upload the ZIP to `sentinelflow-alibaba-api`, use the Custom Runtime startup command `python3 app.py`, and deploy the `LATEST` version.
