/**
 * AEROVATOR / ELEVATOR DISPATCHING SYSTEM - APPLICATION SCRIPT
 * Features:
 * - Real-time 10-Floor Building Shaft Simulator
 * - C++ Ported LOOK Dispatch Algorithm
 * - Interactive Telemetry & Score Matrix HUD
 * - Web Audio API Synthetic Chimes & Alarms
 * - Interactive Canvas Ambient Mesh
 */

// Configuration Constants
const MIN_FLOOR = 0;
const MAX_FLOOR = 10;
const TOTAL_FLOORS = MAX_FLOOR - MIN_FLOOR + 1; // 11 floors (0 to 10)

// Direction Enums
const Direction = {
  IDLE: 'IDLE',
  UP: 'UP',
  DOWN: 'DOWN'
};

// Web Audio API Synthesizer for Interactive FX
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15); // E6

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  playMotorHum(duration = 1.0) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, now); // Low hum
    osc.frequency.linearRampToValueAtTime(125, now + duration);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playEmergencyAlarm() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    for (let i = 0; i < 3; i++) {
      const startTime = this.ctx.currentTime + (i * 0.25);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(750, startTime);
      osc.frequency.linearRampToValueAtTime(450, startTime + 0.2);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    }
  }
}

const sfx = new SoundFX();

// Elevator Class Model
class Elevator {
  constructor(id, initialFloor, capacity, isEmergency = false, sirenCode = "") {
    this.id = id;
    this.currentFloor = initialFloor;
    this.direction = Direction.IDLE;
    this.status = "Available"; // "Available", "Busy", "Emergency", "Maintenance"
    this.capacity = capacity;
    this.doorOpen = false;
    this.isEmergency = isEmergency;
    this.sirenCode = sirenCode;
    this.motorRunning = false;
    this.targetQueue = [];
    this.busyAnimating = false;
  }

  getFloorPercentage() {
    // 0 to 10 floor mapped to 0% to 90% bottom offset
    return (this.currentFloor / MAX_FLOOR) * 90;
  }
}

// Global System State
const state = {
  elevators: [
    new Elevator(1, 0, 8),
    new Elevator(2, 6, 10),
    new Elevator(3, 2, 8, true, "RED-ALERT-911")
  ],
  totalRequestsHandled: 4,
  logs: []
};

// Initialize elevator 2 with downward direction to match initial C++ state
state.elevators[1].direction = Direction.DOWN;

// ==========================================================================
// C++ LOOK ALGORITHM PORT
// ==========================================================================
function calculateLookScore(elev, srcFloor, passengerDir) {
  // Elevators under maintenance or emergency cannot take normal passengers
  if (elev.status !== "Available" && elev.status !== "Busy") {
    return 9999;
  }

  const cur = elev.currentFloor;
  const dir = elev.direction;

  // Case 1: Stationary elevator -> simple distance
  if (dir === Direction.IDLE) {
    return Math.abs(cur - srcFloor);
  }

  // Case 2: Elevator is moving UP
  if (dir === Direction.UP) {
    if (srcFloor >= cur && passengerDir === Direction.UP) {
      return (srcFloor - cur); // Approaching on the way (Golden Path)
    }
    if (srcFloor >= cur && passengerDir === Direction.DOWN) {
      return (MAX_FLOOR - cur) + (MAX_FLOOR - srcFloor) + 2;
    }
    return (MAX_FLOOR - cur) + (MAX_FLOOR - MIN_FLOOR) + (srcFloor - MIN_FLOOR) + 5; // Passed floor
  }

  // Case 3: Elevator is moving DOWN
  if (dir === Direction.DOWN) {
    if (srcFloor <= cur && passengerDir === Direction.DOWN) {
      return (cur - srcFloor); // Approaching on the way (Golden Path)
    }
    if (srcFloor <= cur && passengerDir === Direction.UP) {
      return (cur - MIN_FLOOR) + (srcFloor - MIN_FLOOR) + 2;
    }
    return (cur - MIN_FLOOR) + (MAX_FLOOR - MIN_FLOOR) + (MAX_FLOOR - srcFloor) + 5; // Passed floor
  }

  return Math.abs(cur - srcFloor) + 10;
}

function evaluateBestElevator(srcFloor, destFloor) {
  const desiredDir = (destFloor >= srcFloor) ? Direction.UP : Direction.DOWN;
  let bestIdx = -1;
  let lowestCost = 9999;
  const scores = [];

  state.elevators.forEach((el, index) => {
    const cost = calculateLookScore(el, srcFloor, desiredDir);
    scores.push({ id: el.id, cost, status: el.status });
    if (cost < lowestCost) {
      lowestCost = cost;
      bestIdx = index;
    }
  });

  return {
    bestIndex: (lowestCost < 9000) ? bestIdx : -1,
    scores,
    desiredDir
  };
}

// ==========================================================================
// DOM MANIPULATION & UI RENDERING
// ==========================================================================
function appendLog(message, type = "info") {
  const time = new Date().toLocaleTimeString();
  const logObj = { time, message, type };
  state.logs.push(logObj);

  const consoleElem = document.getElementById("live-console");
  if (!consoleElem) return;

  const line = document.createElement("div");
  line.className = "log-line";
  line.innerHTML = `
    <span class="log-time">[${time}]</span>
    <span class="log-${type}">${message}</span>
  `;

  consoleElem.appendChild(line);
  consoleElem.scrollTop = consoleElem.scrollHeight;
}

function updateLOOKMatrix(scores, chosenId) {
  scores.forEach(s => {
    const card = document.getElementById(`score-card-${s.id}`);
    const val = document.getElementById(`score-val-${s.id}`);
    const status = document.getElementById(`score-status-${s.id}`);
    if (card && val && status) {
      val.textContent = (s.cost >= 9000) ? "N/A" : s.cost;
      status.textContent = (s.id === chosenId) ? "BEST MATCH" : (s.cost >= 9000 ? "OUT OF POOL" : "AVAILABLE");
      if (s.id === chosenId) {
        card.classList.add("chosen");
      } else {
        card.classList.remove("chosen");
      }
    }
  });
}

function updateCarDOM(elev) {
  const carElem = document.getElementById(`elevator-car-${elev.id}`);
  const floorText = document.getElementById(`car-floor-${elev.id}`);
  const dirIcon = document.getElementById(`car-dir-${elev.id}`);

  if (!carElem) return;

  // Position
  const bottomPercent = elev.getFloorPercentage();
  carElem.style.bottom = `${bottomPercent}%`;

  // Floor and direction text
  if (floorText) floorText.textContent = `F${elev.currentFloor}`;
  if (dirIcon) {
    if (elev.direction === Direction.UP) dirIcon.textContent = "▲";
    else if (elev.direction === Direction.DOWN) dirIcon.textContent = "▼";
    else dirIcon.textContent = "—";
  }

  // Doors
  if (elev.doorOpen) {
    carElem.classList.add("doors-open");
  } else {
    carElem.classList.remove("doors-open");
  }

  // Siren flash
  if (elev.status === "Emergency") {
    carElem.classList.add("siren-active");
  } else {
    carElem.classList.remove("siren-active");
  }
}

// Elevator Trip Execution with Smooth Steps
async function executeElevatorTrip(elev, srcFloor, destFloor, desiredDir) {
  elev.busyAnimating = true;
  elev.status = "Busy";
  state.totalRequestsHandled++;

  const totalReqElem = document.getElementById("stat-total-requests");
  if (totalReqElem) totalReqElem.textContent = state.totalRequestsHandled;

  appendLog(`Unit 0${elev.id} dispatched to Floor ${srcFloor} for passenger pickup.`, "info");
  sfx.playMotorHum(1.2);

  // 1. Move to Source Floor
  elev.direction = (srcFloor > elev.currentFloor) ? Direction.UP : (srcFloor < elev.currentFloor ? Direction.DOWN : Direction.IDLE);
  updateCarDOM(elev);

  await new Promise(r => setTimeout(r, 1200));
  elev.currentFloor = srcFloor;
  elev.direction = Direction.IDLE;
  updateCarDOM(elev);
  sfx.playChime();

  // Open Doors at Source
  elev.doorOpen = true;
  updateCarDOM(elev);
  appendLog(`Unit 0${elev.id} arrived at Floor ${srcFloor}. Doors opened. Passenger boarded.`, "success");
  await new Promise(r => setTimeout(r, 900));

  // Close Doors
  elev.doorOpen = false;
  updateCarDOM(elev);
  appendLog(`Unit 0${elev.id} doors closed. In transit to Floor ${destFloor}.`, "info");
  await new Promise(r => setTimeout(r, 600));

  // 2. Move to Destination Floor
  elev.direction = (destFloor > elev.currentFloor) ? Direction.UP : Direction.DOWN;
  updateCarDOM(elev);
  sfx.playMotorHum(1.5);

  await new Promise(r => setTimeout(r, 1600));
  elev.currentFloor = destFloor;
  elev.direction = Direction.IDLE;
  updateCarDOM(elev);
  sfx.playChime();

  // Open Doors at Destination
  elev.doorOpen = true;
  updateCarDOM(elev);
  appendLog(`Unit 0${elev.id} reached destination Floor ${destFloor}. Passenger exited safely.`, "success");
  await new Promise(r => setTimeout(r, 1000));

  // Close Doors and restore status
  elev.doorOpen = false;
  elev.status = "Available";
  updateCarDOM(elev);
  elev.busyAnimating = false;

  appendLog(`Unit 0${elev.id} trip completed. Status reset to Available.`, "info");
}

// Handle User Dispatch Click
function handleDispatchSubmit(e) {
  if (e) e.preventDefault();

  const srcSelect = document.getElementById("select-source-floor");
  const destSelect = document.getElementById("select-dest-floor");

  const src = parseInt(srcSelect.value, 10);
  const dest = parseInt(destSelect.value, 10);

  if (src === dest) {
    alert("Source Floor and Destination Floor cannot be the same!");
    return;
  }

  // Highlight floor in floor-labels column
  const labelCells = document.querySelectorAll(".floor-label-cell");
  labelCells.forEach(cell => {
    const f = parseInt(cell.getAttribute("data-floor"), 10);
    if (f === src || f === dest) {
      cell.classList.add("active-request");
    } else {
      cell.classList.remove("active-request");
    }
  });

  const evaluation = evaluateBestElevator(src, dest);
  appendLog(`New Request: F${src} → F${dest} (${evaluation.desiredDir})`, "info");

  if (evaluation.bestIndex === -1) {
    appendLog(`[ERROR] All units are busy or in emergency/maintenance. Request queued.`, "warn");
    return;
  }

  const chosenElevator = state.elevators[evaluation.bestIndex];
  updateLOOKMatrix(evaluation.scores, chosenElevator.id);

  appendLog(`LOOK Algorithm selected Unit 0${chosenElevator.id} (Calculated Cost: ${evaluation.scores[evaluation.bestIndex].cost})`, "success");

  executeElevatorTrip(chosenElevator, src, dest, evaluation.desiredDir);
}

// Emergency Trigger Simulation
function triggerEmergencyScenario(floor = 6) {
  const emgElev = state.elevators[2]; // Unit 03 (Emergency Elevator)
  emgElev.status = "Emergency";
  emgElev.direction = (floor > emgElev.currentFloor) ? Direction.UP : (floor < emgElev.currentFloor ? Direction.DOWN : Direction.IDLE);
  updateCarDOM(emgElev);

  sfx.playEmergencyAlarm();
  appendLog(`[EMERGENCY SIREN] Passenger trapped at Floor ${floor}! Priority Override activated (Code: ${emgElev.sirenCode})`, "danger");

  setTimeout(() => {
    emgElev.currentFloor = floor;
    emgElev.direction = Direction.IDLE;
    emgElev.doorOpen = true;
    updateCarDOM(emgElev);
    appendLog(`Unit 03 arrived at Floor ${floor}. Alpha Maintenance Team evacuated passengers safely.`, "success");

    setTimeout(() => {
      emgElev.doorOpen = false;
      emgElev.status = "Available";
      updateCarDOM(emgElev);
      appendLog(`Unit 03 emergency cleared. System restored to normal service.`, "info");
    }, 2500);
  }, 1600);
}

// ==========================================================================
// BACKGROUND CANVAS PARTICLES / MESH NETWORK
// ==========================================================================
function initCanvasBackground() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = Math.min(width > 768 ? 60 : 30, 80);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.8
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    ctx.strokeStyle = "rgba(56, 189, 248, 0.04)";
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

// ==========================================================================
// INITIALIZATION ON DOM READY
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initCanvasBackground();

  // Populate Select Floor Options (0 to 10)
  const srcSelect = document.getElementById("select-source-floor");
  const destSelect = document.getElementById("select-dest-floor");

  if (srcSelect && destSelect) {
    for (let f = MIN_FLOOR; f <= MAX_FLOOR; f++) {
      const optSrc = document.createElement("option");
      optSrc.value = f;
      optSrc.textContent = `Floor ${f}`;
      if (f === 3) optSrc.selected = true;
      srcSelect.appendChild(optSrc);

      const optDest = document.createElement("option");
      optDest.value = f;
      optDest.textContent = `Floor ${f}`;
      if (f === 8) optDest.selected = true;
      destSelect.appendChild(optDest);
    }
  }

  // Initial Car Positioning
  state.elevators.forEach(el => updateCarDOM(el));

  // Initial System Logs
  appendLog("Aerovator Dispatch System v3.2 Initialized.", "info");
  appendLog("Unit 01 (Passenger Standard): ONLINE @ Floor 0", "info");
  appendLog("Unit 02 (High-Speed Express): CRUISING DOWN @ Floor 6", "info");
  appendLog("Unit 03 (Emergency Unit): PRIORITY OVERRIDE READY @ Floor 2", "info");
  appendLog("LOOK Scheduling Algorithm Core: ONLINE & OPTIMIZED", "success");

  // Initial LOOK calculation
  const initEval = evaluateBestElevator(3, 8);
  updateLOOKMatrix(initEval.scores, state.elevators[initEval.bestIndex].id);

  // Event Listeners
  const dispatchBtn = document.getElementById("btn-dispatch-call");
  if (dispatchBtn) {
    dispatchBtn.addEventListener("click", handleDispatchSubmit);
  }

  const emgBtn = document.getElementById("btn-trigger-emergency");
  if (emgBtn) {
    emgBtn.addEventListener("click", () => triggerEmergencyScenario(6));
  }

  const soundBtn = document.getElementById("btn-sound-toggle");
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      const active = sfx.toggle();
      soundBtn.title = active ? "Audio Enabled" : "Audio Muted";
      soundBtn.style.opacity = active ? "1" : "0.5";
      appendLog(`Audio effects ${active ? "ENABLED" : "MUTED"}.`, "info");
    });
  }

  // Door manual override buttons
  const openDoorBtn = document.getElementById("btn-door-open");
  if (openDoorBtn) {
    openDoorBtn.addEventListener("click", () => {
      const el = state.elevators[0];
      el.doorOpen = true;
      updateCarDOM(el);
      sfx.playChime();
      appendLog("Manual Override: Unit 01 Doors OPENED.", "info");
    });
  }

  const closeDoorBtn = document.getElementById("btn-door-close");
  if (closeDoorBtn) {
    closeDoorBtn.addEventListener("click", () => {
      const el = state.elevators[0];
      el.doorOpen = false;
      updateCarDOM(el);
      appendLog("Manual Override: Unit 01 Doors CLOSED.", "info");
    });
  }
});
