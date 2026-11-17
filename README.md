# Elevator-Dispatching-System
A more practical and effecient take on Elevator Dispatch System
Made by
Shobhit Rai 20251502032
Krish Kumar 20251502015
Siddhi Vyas 20251501163
Tamanna Sharma 20251502034
Pranjali Nama 20251502022
# AeroVator 3D

AeroVator 3D is a responsive elevator-operations dashboard backed by a C++17 simulation service. The UI uses plain HTML, CSS, and JavaScript; the C++ server serves those files, owns the simulated fleet, exposes a REST API, and streams status updates with server-sent events (SSE).

> **Simulation only.** This project does not connect to elevator controllers, sensors, or building equipment and is not suitable for safety-critical operation.

## Run locally

On Linux, install a C++17 compiler (for example `g++`) and POSIX socket headers, then from the project root run:

```sh
./run.sh
```

The script compiles `backend/main.cpp` and starts the service on `0.0.0.0:3000`. Set `PORT` to use another port. Open `http://localhost:3000` in a browser. The server must run from the repository root so it can serve `public/`.

To use CMake instead:

```sh
cmake -S . -B build
cmake --build build
./build/aerovator-server
```

The production `Dockerfile` installs the compiler, compiles the C++ server, copies the frontend, and starts the service. It honors `PORT` and exposes port 3000 by default.

## Architecture

- `backend/main.cpp` owns a thread-safe request queue, simulation ticks, trip counters, REST requests, and SSE streams. It models Idle, Moving Up, Moving Down, Maintenance, and Out of Service with separate State objects; transitions are checked before a lift changes state, so a Maintenance lift cannot move until service is completed.
- The backend uses a `DispatchStrategy` interface with interchangeable FCFS, LOOK/SCAN, and SSTF strategy objects. Changing the selected strategy at runtime changes the dispatcher without replacing the simulation or losing pending calls.
- `public/index.html` contains the dashboard, access screen, and individual report panel.
- `public/styles.css` contains the responsive dark-cyan operations-console design.
- `public/app.js` calls the same-origin API, listens to `/api/events`, submits calls, changes the simulation controls, and renders lift reports.
- `public/manus-routes.json` declares the site's only page route, `/`.

The simulation seeds four units across eleven floors. Fleet state and event history live in process memory and reset when the server restarts. A request represents a simulated floor pickup. Trip counters increment after a lift serves a requested floor. Reaching the service threshold changes that lift to Maintenance, requeues its unserved assigned calls, prevents new dispatch assignments, and keeps it out of normal service until the maintenance action completes. Completed request history may be trimmed, but active queued and assigned calls are retained.

## Demo access

Click a lift to open its report access screen. Any non-empty operator name and access phrase opens the simulated report. Values are not sent to the backend, saved, or logged. This is only a UI demonstration gate, not authentication or authorization.

## Dispatch strategies

- **FCFS — First Come, First Served:** processes floor calls in request arrival order and assigns among eligible lifts with a rotating assignment order.
- **LOOK/SCAN:** prefers a lift continuing in the direction of a request, reducing direction reversals, then uses route distance as a tie-breaker.
- **SSTF — Shortest Seek Time First:** selects the eligible lift closest to the requested floor.

## REST API

All endpoints are same-origin. JSON request bodies are shown below. Invalid values return a JSON `error` with a 4xx status.

| Method and path | Purpose |
| --- | --- |
| `GET /api/health` | Unauthenticated runtime health response; also reports the simulation-only boundary. |
| `GET /api/status` | Building floor count, fleet summary, lifts, open/completed calls, current strategy, simulation controls, and recent activity. |
| `GET /api/strategy` | Read the currently selected dispatch strategy. |
| `POST /api/strategy` | Set strategy: `{"strategy":"FCFS"}`, `{"strategy":"LOOK/SCAN"}`, or `{"strategy":"SSTF"}`. |
| `POST /api/calls` | Create a floor call: `{"floor":5,"direction":"up"}`. Floors are 0–10; up is unavailable at 10 and down is unavailable at 0. |
| `GET /api/report?lift_id=1` | Read a lift's health report and recent maintenance/trip history. |
| `PUT /api/threshold` | Set a threshold: `{"lift_id":1,"trip_threshold":120}`. Accepted threshold range is 5–5000 trips. |
| `POST /api/maintenance/complete` | Record service completion: `{"lift_id":4}`. The service counter is reset, the maintenance dates update, and the lift returns to dispatch. |
| `POST /api/simulation/pause` | Pause/resume simulation movement: `{"running":"false"}` or `{"running":"true"}`. Floor calls can still be recorded while paused. |
| `POST /api/simulation/speed` | Set simulation speed: `{"speed":1.5}`; accepted range is 0.5×–3×. |
| `POST /api/reset` | Reset to the seeded four-lift, eleven-floor demo state. |
| `GET /api/events` | SSE stream emitting `event: status` updates with the same JSON structure as `/api/status`. |

### Sample response shapes

`GET /api/status` returns top-level `floors`, `strategy`, `simulation_running`, `speed`, `summary`, `lifts`, `requests`, `activity`, and a simulation notice. Each lift includes `id`, `name`, `floor`, `state`, `state_label`, `direction`, `load_kg`, `capacity_kg`, `overloaded`, `trips`, `trips_since_service`, `trip_threshold`, maintenance dates, `health_status`, and assigned `stops`.

`GET /api/report?lift_id=4` returns `{ "lift": { ...lift fields..., "history": [...] }, "notice": "..." }`.

## UX and limits

The dashboard adapts to narrow screens with compact lift cards and a simplified floor request list. It includes keyboard focus styling, semantic controls, reduced-motion support, error/empty/loading feedback, and visible simulation labels. This is an educational, single-process demonstration: it has no persistent database, real user account system, elevator telemetry, hardware integration, or safety certification. Do not use it to operate or make safety decisions about real equipment.

## Safety command center redesign

The frontend now prioritizes four simulation-only response actions: Fire emergency, Medical emergency, Harassment / safety, and Automatic shutdown. Emergency actions stop simulated movement, clear active routes, secure available lifts at their current nearest safe floor, and record notifications to the configured maintenance lead, duty manager, and security desk. The contact cards expose configured `tel:` links for a future integrated communications provider; this demo does not place calls or contact emergency services.

Dispatch strategy remains a backend concern. The `/api/strategy` endpoint remains available for simulation and integration tests, but strategy selection is intentionally not exposed in the operator frontend.

`database/schema.sql` is a normalized PostgreSQL-compatible persistence reference for sites, floors, lifts, contacts, emergency incidents, contact notifications, automatic lift safety actions, floor calls, and maintenance records. The current single-process demo continues to use in-memory state and resets on restart.

New safety endpoints:

- `GET /api/contacts` returns the configured on-call maintenance, duty manager, and security contacts.
- `POST /api/emergency` accepts `{"type":"FIRE"}`, `{"type":"MEDICAL"}`, or `{"type":"HARASSMENT"}` and secures available lifts at their nearest safe floor.
- `POST /api/shutdown` accepts `{"active":true}` to pause all simulated movement.
- `POST /api/emergency/clear` clears the active simulation alert without resuming movement.
