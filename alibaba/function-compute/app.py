"""SentinelFlow Alibaba Cloud backend for Function Compute 3.0.

A dependency-free HTTP service for Alibaba Cloud Function Compute Custom Runtime.
Routes:
  GET /health              Deployment health and platform metadata
  GET /api/health          Alias for /health
  GET /api/uipath/jobs     Reads safe UiPath Orchestrator job metadata
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any


SERVICE_NAME = "sentinelflow-alibaba-api"
PLATFORM_NAME = "Alibaba Cloud Function Compute"


def env(name: str) -> str:
    return os.environ.get(name, "").strip()


def json_response(handler: BaseHTTPRequestHandler, status: int, payload: dict[str, Any]) -> None:
    body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    handler.send_header("Cache-Control", "no-store, max-age=0")
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
    handler.send_header("Access-Control-Allow-Headers", "Content-Type")
    handler.end_headers()
    handler.wfile.write(body)


def request_json(url: str, method: str = "GET", body: bytes | None = None, headers: dict[str, str] | None = None) -> tuple[int, dict[str, Any]]:
    request = urllib.request.Request(url, data=body, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            raw = response.read().decode("utf-8")
            return response.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as error:
        raw = error.read().decode("utf-8", errors="replace")
        try:
            data = json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            data = {}
        return error.code, data


def get_uipath_jobs() -> tuple[int, dict[str, Any]]:
    org = env("UIPATH_ORG")
    app_id = env("UIPATH_APP_ID")
    app_secret = env("UIPATH_APP_SECRET")
    scopes = env("UIPATH_SCOPES")
    orchestrator_url = env("UIPATH_ORCHESTRATOR_URL").rstrip("/")
    folder_id = env("UIPATH_FOLDER_ID")

    required = {
        "UIPATH_ORG": org,
        "UIPATH_APP_ID": app_id,
        "UIPATH_APP_SECRET": app_secret,
        "UIPATH_SCOPES": scopes,
        "UIPATH_ORCHESTRATOR_URL": orchestrator_url,
        "UIPATH_FOLDER_ID": folder_id,
    }
    missing = [name for name, value in required.items() if not value]
    if missing:
        return HTTPStatus.INTERNAL_SERVER_ERROR, {
            "connected": False,
            "error": "UiPath configuration is incomplete.",
            "missing": missing,
        }

    token_url = f"https://cloud.uipath.com/{urllib.parse.quote(org, safe='')}/identity_/connect/token"
    token_form = urllib.parse.urlencode(
        {
            "grant_type": "client_credentials",
            "client_id": app_id,
            "client_secret": app_secret,
            "scope": scopes,
        }
    ).encode("utf-8")

    token_status, token_payload = request_json(
        token_url,
        method="POST",
        body=token_form,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    access_token = token_payload.get("access_token")
    if token_status < 200 or token_status >= 300 or not isinstance(access_token, str):
        return HTTPStatus.BAD_GATEWAY, {
            "connected": False,
            "error": "Unable to authenticate with UiPath.",
        }

    params = urllib.parse.urlencode(
        {
            "$top": "10",
            "$orderby": "CreationTime desc",
            "$expand": "Release",
        },
        safe="$ ,",
    )
    jobs_url = f"{orchestrator_url}/odata/Jobs?{params}"
    jobs_status, jobs_payload = request_json(
        jobs_url,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
            "X-UIPATH-OrganizationUnitId": folder_id,
        },
    )
    if jobs_status < 200 or jobs_status >= 300:
        return HTTPStatus.BAD_GATEWAY, {
            "connected": False,
            "error": "Unable to retrieve UiPath jobs.",
        }

    safe_jobs: list[dict[str, Any]] = []
    values = jobs_payload.get("value", [])
    if not isinstance(values, list):
        values = []

    for job in values:
        if not isinstance(job, dict):
            continue
        release = job.get("Release")
        process = None
        if isinstance(release, dict):
            process = release.get("Name")
        safe_jobs.append(
            {
                "id": job.get("Id"),
                "process": process or job.get("ReleaseName") or "Unknown process",
                "state": job.get("State") or "Unknown",
                "createdAt": job.get("CreationTime"),
                "startedAt": job.get("StartTime"),
                "endedAt": job.get("EndTime"),
            }
        )

    return HTTPStatus.OK, {
        "connected": True,
        "platform": PLATFORM_NAME,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "count": len(safe_jobs),
        "jobs": safe_jobs,
    }


class SentinelFlowHandler(BaseHTTPRequestHandler):
    server_version = "SentinelFlowAlibabaAPI/1.0"

    def log_message(self, format: str, *args: Any) -> None:
        sys.stdout.write("%s - %s\n" % (self.log_date_time_string(), format % args))

    def do_OPTIONS(self) -> None:
        json_response(self, HTTPStatus.NO_CONTENT, {})

    def do_GET(self) -> None:
        route = urllib.parse.urlparse(self.path).path

        if route in ("/", "/health", "/api/health"):
            json_response(
                self,
                HTTPStatus.OK,
                {
                    "status": "ok",
                    "service": SERVICE_NAME,
                    "platform": PLATFORM_NAME,
                    "runtime": "Custom Runtime / Python 3.10",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "routes": ["/health", "/api/uipath/jobs"],
                },
            )
            return

        if route == "/api/uipath/jobs":
            status, payload = get_uipath_jobs()
            json_response(self, int(status), payload)
            return

        json_response(self, HTTPStatus.NOT_FOUND, {"error": "Route not found."})


def main() -> None:
    # FC_SERVER_PORT is supplied by Function Compute custom runtimes.
    port = int(os.environ.get("FC_SERVER_PORT", os.environ.get("PORT", "9000")))
    server = ThreadingHTTPServer(("0.0.0.0", port), SentinelFlowHandler)
    print(f"{SERVICE_NAME} listening on 0.0.0.0:{port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
