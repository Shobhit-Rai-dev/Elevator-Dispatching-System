/**
 * AEROVATOR / ELEVATOR DISPATCHING SYSTEM - APPLICATION SCRIPT
 * Features:
 * - Real-time 10-Floor Building Shaft Simulator with Heavy Industrial Aesthetics
 * - C++ Ported LOOK Dispatch Algorithm
 * - Animated High-Tensile Steel Cables & Opposing Phase Counterweights
 * - Rotating Motor Hoist Sheaves (Pulleys)
 * - Industrial Red Bulkhead Lamps (Caged Emergency Lights)
 * - Shaft FX Particle Engine: Rail Brake Sparks & Atmospheric Dust Motes
 * - Web Audio API High-Fidelity Synthesizer:
 *     * Variable-pitch induction motor acceleration & deceleration
 *     * Pneumatic air door hiss & mechanical latches
 *     * Electronic dual-tone arrival chime
 *     * Emergency multi-tone tactical siren
 * - Real-time Telemetry Cockpit Gauges (Speed, Tension, Motor RPM)
 * - Interactive 3D Perspective Tilt Viewport on Mouse Move
 * - Direct Floor Quick-Call Buttons on Shaft Grid
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

function dirName(d) {
  if (d === Direction.UP) return 'UP';
  if (d === Direction.DOWN) return 'DOWN';
  return 'IDLE';
}

// ==========================================================================
// HIGH-FIDELITY WEB AUDIO API SYNTHESIZER
// ==========================================================================
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
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  playChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // First tone (A5 - 880Hz)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Second harmonious tone (E6 - 1318.5Hz)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.5, now + 0.12);
    gain2.gain.setValueAtTime(0.14, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.8);
  }

  playPneumaticDoor(isOpen) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Noise buffer for air hiss
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isOpen ? 1800 : 900, now);
    filter.Q.setValueAtTime(3, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.25);

    // Mechanical latch clunk
    const clunk = this.ctx.createOscillator();
    const clunkGain = this.ctx.createGain();
    clunk.type = 'square';
    clunk.frequency.setValueAtTime(120, now + 0.05);
    clunk.frequency.exponentialRampToValueAtTime(40, now + 0.12);
    clunkGain.gain.setValueAtTime(0.07, now + 0.05);
    clunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    clunk.connect(clunkGain);
    clunkGain.connect(this.ctx.destination);
    clunk.start(now + 0.05);
    clunk.stop(now + 0.12);
  }

  playMotorHum(duration = 1.2, isUp = true) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const startFreq = isUp ? 85 : 120;
    const endFreq = isUp ? 135 : 95;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.linearRampToValueAtTime(endFreq, now + duration * 0.5);
    osc.frequency.linearRampToValueAtTime(startFreq, now + duration);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playSparksSound() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const t = now + i * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2400 + Math.random() * 800, t);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.03);
    }
  }

  playEmergencyAlarm() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    for (let i = 0; i < 4; i++) {
      const startTime = this.ctx.currentTime + (i * 0.28);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(820, startTime);
      osc.frequency.linearRampToValueAtTime(420, startTime + 0.24);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.24);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.24);
    }
  }
}

const sfx = new SoundFX();

// ==========================================================================
// ELEVATOR CLASS MODEL
// ==========================================================================
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
    this.busyAnimating = false;
  }

  getFloorPercentage() {
    // 0 to 10 mapped to 0% to 90% bottom offset
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
  activeSpeed: 0.0,
  activeTension: 14.2,
  activeRPM: 0,
  logs: []
};

// Elevator 2 starts moving down to demonstrate LOOK algorithm in action
state.elevators[1].direction = Direction.DOWN;

// ==========================================================================
// C++ PORTED LOOK ALGORITHM
// ==========================================================================
function calculateLookScore(elev, srcFloor, passengerDir) {
  if (elev.status !== "Available" && elev.status !== "Busy") {
    return 9999;
  }

  const cur = elev.currentFloor;
  const dir = elev.direction;

  if (dir === Direction.IDLE) {
    return Math.abs(cur - srcFloor);
  }

  if (dir === Direction.UP) {
    if (srcFloor >= cur && passengerDir === Direction.UP) {
      return (srcFloor - cur); // Approaching on the way (Golden Path)
    }
    if (srcFloor >= cur && passengerDir === Direction.DOWN) {
      return (MAX_FLOOR - cur) + (MAX_FLOOR - srcFloor) + 2;
    }
    return (MAX_FLOOR - cur) + (MAX_FLOOR - MIN_FLOOR) + (srcFloor - MIN_FLOOR) + 5; // Passed
  }

  if (dir === Direction.DOWN) {
    if (srcFloor <= cur && passengerDir === Direction.DOWN) {
      return (cur - srcFloor); // Approaching on the way (Golden Path)
    }
    if (srcFloor <= cur && passengerDir === Direction.UP) {
      return (cur - MIN_FLOOR) + (srcFloor - MIN_FLOOR) + 2;
    }
    return (cur - MIN_FLOOR) + (MAX_FLOOR - MIN_FLOOR) + (MAX_FLOOR - srcFloor) + 5; // Passed
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
// SHAFT FX PARTICLE ENGINE (ELECTRIC RAIL SPARKS & ATMOSPHERIC DUST)
// ==========================================================================
class ShaftFXEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.sparks = [];
    this.dustMotes = [];
    this.running = false;
  }

  init() {
    this.canvas = document.getElementById("shaft-fx-canvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.resize();

    window.addEventListener("resize", () => this.resize());

    // Initialize atmospheric dust motes
    for (let i = 0; i < 24; i++) {
      this.dustMotes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        radius: Math.random() * 1.5 + 0.6,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    this.running = true;
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  emitRailSparks(shaftIndex = 1, floorPercent = 50, count = 20) {
    if (!this.canvas) return;
    sfx.playSparksSound();

    const shaftWidth = (this.canvas.width - 88) / 3;
    const originX = 88 + (shaftIndex - 1) * shaftWidth + shaftWidth / 2;
    const originY = this.canvas.height - (floorPercent / 100) * this.canvas.height - 20;

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) - (Math.PI / 2);
      const speed = Math.random() * 5 + 2;
      this.sparks.push({
        x: originX + (Math.random() - 0.5) * 12,
        y: originY,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.abs(Math.sin(angle) * speed) - 1,
        life: 1.0,
        decay: Math.random() * 0.04 + 0.02,
        color: Math.random() > 0.3 ? '#ffdd55' : '#ff5533',
        size: Math.random() * 2.2 + 1
      });
    }
  }

  animate() {
    if (!this.running || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw atmospheric dust motes floating up the shaft
    for (let i = 0; i < this.dustMotes.length; i++) {
      const m = this.dustMotes[i];
      m.x += m.vx;
      m.y += m.vy;

      if (m.y < 0) {
        m.y = this.canvas.height;
        m.x = Math.random() * this.canvas.width;
      }
      if (m.x < 0) m.x = this.canvas.width;
      if (m.x > this.canvas.width) m.x = 0;

      this.ctx.beginPath();
      this.ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 60, 90, ${m.alpha * 0.35})`; // catches red bulkhead light
      this.ctx.fill();
    }

    // 2. Draw active electric friction sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.18; // gravity
      s.life -= s.decay;

      if (s.life <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      this.ctx.fillStyle = s.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = s.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    requestAnimationFrame(() => this.animate());
  }
}

const shaftFX = new ShaftFXEngine();

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

function updateCockpitGauges(speed, tension, rpm) {
  state.activeSpeed = speed;
  state.activeTension = tension;
  state.activeRPM = rpm;

  const speedElem = document.getElementById("gauge-speed");
  const tensionElem = document.getElementById("gauge-tension");
  const rpmElem = document.getElementById("gauge-rpm");
  const pillSpeed = document.getElementById("pill-hoist-speed");

  if (speedElem) speedElem.textContent = `${speed.toFixed(1)} m/s`;
  if (tensionElem) tensionElem.textContent = `${tension.toFixed(1)} kN`;
  if (rpmElem) rpmElem.textContent = `${Math.round(rpm)} RPM`;
  if (pillSpeed) pillSpeed.textContent = `${speed.toFixed(1)} m/s`;
}

function updateCarDOM(elev) {
  const carElem = document.getElementById(`elevator-car-${elev.id}`);
  const floorText = document.getElementById(`car-floor-${elev.id}`);
  const dirIcon = document.getElementById(`car-dir-${elev.id}`);
  const cablesElem = document.getElementById(`cables-${elev.id}`);
  const counterweightElem = document.getElementById(`counterweight-${elev.id}`);
  const sheaveElem = document.getElementById(`sheave-${elev.id}`);

  if (!carElem) return;

  // Car Bottom Offset (0% to 90%)
  const bottomPercent = elev.getFloorPercentage();
  carElem.style.bottom = `${bottomPercent}%`;

  // Suspension Cables dynamic height (extends from 100% top down to car)
  if (cablesElem) {
    const cableLength = Math.max(8, 100 - bottomPercent - 8);
    cablesElem.style.height = `${cableLength}%`;
  }

  // Counterweight moves in OPPOSITE phase (when car is low, weight is high)
  if (counterweightElem) {
    const cwTop = (bottomPercent / 90) * 78 + 6; // 6% to 84% top
    counterweightElem.style.top = `${cwTop}%`;
  }

  // Sheave pulley spin animation
  if (sheaveElem) {
    sheaveElem.classList.remove("spinning-up", "spinning-down");
    if (elev.direction === Direction.UP) sheaveElem.classList.add("spinning-up");
    else if (elev.direction === Direction.DOWN) sheaveElem.classList.add("spinning-down");
  }

  // Floor position & chevron direction
  if (floorText) floorText.textContent = `F${elev.currentFloor}`;
  if (dirIcon) {
    dirIcon.classList.remove("anim-up", "anim-down");
    if (elev.direction === Direction.UP) {
      dirIcon.textContent = "▲";
      dirIcon.classList.add("anim-up");
    } else if (elev.direction === Direction.DOWN) {
      dirIcon.textContent = "▼";
      dirIcon.classList.add("anim-down");
    } else {
      dirIcon.textContent = "—";
    }
  }

  // Doors
  if (elev.doorOpen) {
    carElem.classList.add("doors-open");
  } else {
    carElem.classList.remove("doors-open");
  }

  // Emergency flashing
  if (elev.status === "Emergency") {
    carElem.classList.add("siren-active");
  } else {
    carElem.classList.remove("siren-active");
  }
}

// ==========================================================================
// ELEVATOR TRIP EXECUTION WITH INDUSTRIAL PHYSICS & AUDIO
// ==========================================================================
async function executeElevatorTrip(elev, srcFloor, destFloor, desiredDir) {
  elev.busyAnimating = true;
  elev.status = "Busy";
  state.totalRequestsHandled++;

  const totalReqElem = document.getElementById("stat-total-requests");
  if (totalReqElem) totalReqElem.textContent = state.totalRequestsHandled;

  appendLog(`Unit 0${elev.id} dispatched to Floor ${srcFloor} for pickup.`, "info");

  // Step 1: Move to Source Floor
  if (elev.currentFloor !== srcFloor) {
    const isUp = srcFloor > elev.currentFloor;
    elev.direction = isUp ? Direction.UP : Direction.DOWN;
    updateCarDOM(elev);

    // Audio & Telemetry acceleration
    sfx.playMotorHum(1.4, isUp);
    updateCockpitGauges(1.8, 16.5, 1200);

    // Spray friction sparks on startup
    shaftFX.emitRailSparks(elev.id, elev.getFloorPercentage(), 15);

    await new Promise(r => setTimeout(r, 1100));
    elev.currentFloor = srcFloor;
    elev.direction = Direction.IDLE;
    updateCarDOM(elev);

    // Deceleration sparks & arrival chime
    shaftFX.emitRailSparks(elev.id, elev.getFloorPercentage(), 20);
    updateCockpitGauges(0.0, 14.2, 0);
    sfx.playChime();
  }

  // Open Doors at Source
  elev.doorOpen = true;
  updateCarDOM(elev);
  sfx.playPneumaticDoor(true);
  appendLog(`Unit 0${elev.id} arrived at Floor ${srcFloor}. Doors opened. Passenger boarded.`, "success");
  await new Promise(r => setTimeout(r, 900));

  // Close Doors
  elev.doorOpen = false;
  updateCarDOM(elev);
  sfx.playPneumaticDoor(false);
  appendLog(`Unit 0${elev.id} doors locked. En route to Floor ${destFloor}.`, "info");
  await new Promise(r => setTimeout(r, 550));

  // Step 2: Move to Destination Floor
  const destUp = destFloor > elev.currentFloor;
  elev.direction = destUp ? Direction.UP : Direction.DOWN;
  updateCarDOM(elev);

  sfx.playMotorHum(1.7, destUp);
  updateCockpitGauges(2.4, 18.2, 1480);
  shaftFX.emitRailSparks(elev.id, elev.getFloorPercentage(), 18);

  await new Promise(r => setTimeout(r, 1500));
  elev.currentFloor = destFloor;
  elev.direction = Direction.IDLE;
  updateCarDOM(elev);

  // Arrival deceleration
  shaftFX.emitRailSparks(elev.id, elev.getFloorPercentage(), 25);
  updateCockpitGauges(0.0, 14.2, 0);
  sfx.playChime();

  // Open Doors at Destination
  elev.doorOpen = true;
  updateCarDOM(elev);
  sfx.playPneumaticDoor(true);
  appendLog(`Unit 0${elev.id} arrived at destination Floor ${destFloor}. Passenger exited safely.`, "success");
  await new Promise(r => setTimeout(r, 1000));

  // Close Doors and restore status
  elev.doorOpen = false;
  elev.status = "Available";
  updateCarDOM(elev);
  sfx.playPneumaticDoor(false);
  elev.busyAnimating = false;

  appendLog(`Unit 0${elev.id} trip completed. Status reset to Available.`, "info");
}

// Dispatch via dropdown selector
function handleDispatchSubmit(e) {
  if (e) e.preventDefault();
  sfx.playClick();

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

// Emergency Trigger Simulation with High-Alert Strobe
function triggerEmergencyScenario(floor = 6) {
  sfx.playClick();
  const viewport = document.getElementById("shaft-viewport");
  const lamps = document.querySelectorAll(".bulkhead-lamp");

  // Activate dramatic red bulkhead strobe
  if (viewport) viewport.classList.add("emergency-strobe");
  lamps.forEach(l => l.classList.add("emergency-active"));

  const emgElev = state.elevators[2]; // Unit 03 (Emergency Elevator)
  emgElev.status = "Emergency";
  emgElev.direction = (floor > emgElev.currentFloor) ? Direction.UP : (floor < emgElev.currentFloor ? Direction.DOWN : Direction.IDLE);
  updateCarDOM(emgElev);

  sfx.playEmergencyAlarm();
  appendLog(`[EMERGENCY SIREN] Passenger trapped at Floor ${floor}! Priority Override (Code: ${emgElev.sirenCode})`, "danger");

  // Sparks along emergency rail
  shaftFX.emitRailSparks(3, emgElev.getFloorPercentage(), 30);
  updateCockpitGauges(3.0, 21.0, 1850);

  setTimeout(() => {
    emgElev.currentFloor = floor;
    emgElev.direction = Direction.IDLE;
    emgElev.doorOpen = true;
    updateCarDOM(emgElev);
    sfx.playPneumaticDoor(true);
    shaftFX.emitRailSparks(3, emgElev.getFloorPercentage(), 35);
    updateCockpitGauges(0.0, 14.2, 0);

    appendLog(`Unit 03 reached Floor ${floor}. Alpha Maintenance Team evacuated passengers safely.`, "success");

    setTimeout(() => {
      emgElev.doorOpen = false;
      emgElev.status = "Available";
      updateCarDOM(emgElev);
      sfx.playPneumaticDoor(false);

      if (viewport) viewport.classList.remove("emergency-strobe");
      lamps.forEach(l => l.classList.remove("emergency-active"));

      appendLog(`Unit 03 emergency cleared. Tower restored to normal service.`, "info");
    }, 2800);
  }, 1600);
}

// ==========================================================================
// 3D PERSPECTIVE TILT ON MOUSE MOVE
// ==========================================================================
function init3DTilt() {
  const shaftWrap = document.getElementById("shaft-wrap");
  if (!shaftWrap) return;

  shaftWrap.addEventListener("mousemove", (e) => {
    const rect = shaftWrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -6; // max 6 deg
    const tiltY = ((x - centerX) / centerX) * 6;

    shaftWrap.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  shaftWrap.addEventListener("mouseleave", () => {
    shaftWrap.style.transform = `rotateX(0deg) rotateY(0deg)`;
  });
}

// ==========================================================================
// CAMERA MODE CONTROLS
// ==========================================================================
function initCameraControls() {
  const btns = document.querySelectorAll(".cam-btn");
  const shaftWrap = document.getElementById("shaft-wrap");

  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      sfx.playClick();

      const mode = btn.getAttribute("data-mode");
      if (mode === "industrial") {
        shaftWrap.style.transform = "scale(1.04) rotateX(4deg)";
        appendLog("Camera View: Industrial Depth Angle Engaged.", "info");
      } else if (mode === "emergency") {
        triggerEmergencyScenario(6);
      } else {
        shaftWrap.style.transform = "scale(1) rotateX(0deg)";
        appendLog("Camera View: Standard Full Tower Overview.", "info");
      }
    });
  });
}

// ==========================================================================
// DIRECT FLOOR QUICK-CALL BUTTONS ON SHAFT
// ==========================================================================
function initFloorQuickCallButtons() {
  const quickBtns = document.querySelectorAll(".quick-call-btn");
  quickBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      sfx.playClick();
      const floor = parseInt(btn.getAttribute("data-floor"), 10);
      const dir = btn.getAttribute("data-dir");

      // Auto pick a logical destination floor
      let dest = 0;
      if (dir === "UP") {
        dest = Math.min(MAX_FLOOR, floor + 4);
      } else {
        dest = Math.max(MIN_FLOOR, floor - 4);
      }

      const srcSelect = document.getElementById("select-source-floor");
      const destSelect = document.getElementById("select-dest-floor");
      if (srcSelect) srcSelect.value = floor;
      if (destSelect) destSelect.value = dest;

      handleDispatchSubmit();
    });
  });
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
  const count = Math.min(width > 768 ? 55 : 25, 75);

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

    ctx.strokeStyle = "rgba(56, 189, 248, 0.05)";
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
  shaftFX.init();
  init3DTilt();
  initCameraControls();
  initFloorQuickCallButtons();

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

  // Initial Car Positioning, Cables and Counterweights
  state.elevators.forEach(el => updateCarDOM(el));

  // Initial System Logs
  appendLog("Aerovator Industrial Dispatch System v3.3 Initialized.", "info");
  appendLog("Unit 01 (Passenger Standard): ONLINE @ Floor 0 (Cables Tensioned)", "info");
  appendLog("Unit 02 (High-Speed Express): CRUISING DOWN @ Floor 6 (Sheaves Spinning)", "info");
  appendLog("Unit 03 (Emergency Rescue Unit): PRIORITY OVERRIDE READY @ Floor 2", "info");
  appendLog("Industrial Bulkhead Safety Lights: OPERATIONAL", "success");
  appendLog("LOOK Scheduling Algorithm Core: ONLINE & DIRECTION-AWARE", "success");

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

  const sparkBtn = document.getElementById("btn-spark-test");
  if (sparkBtn) {
    sparkBtn.addEventListener("click", () => {
      sfx.playClick();
      shaftFX.emitRailSparks(2, state.elevators[1].getFloorPercentage(), 30);
      appendLog("Manual Guide Shoe Brake Test: Friction sparks generated on Unit 02.", "warn");
    });
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

  // Manual Door Overrides
  const openDoorBtn = document.getElementById("btn-door-open");
  if (openDoorBtn) {
    openDoorBtn.addEventListener("click", () => {
      const el = state.elevators[0];
      el.doorOpen = true;
      updateCarDOM(el);
      sfx.playPneumaticDoor(true);
      appendLog("Manual Override: Unit 01 Pneumatic Doors OPENED.", "info");
    });
  }

  const closeDoorBtn = document.getElementById("btn-door-close");
  if (closeDoorBtn) {
    closeDoorBtn.addEventListener("click", () => {
      const el = state.elevators[0];
      el.doorOpen = false;
      updateCarDOM(el);
      sfx.playPneumaticDoor(false);
      appendLog("Manual Override: Unit 01 Pneumatic Doors CLOSED.", "info");
    });
  }
});
