# 🏢 Elevator Dispatching System

A modern, high-throughput direction-aware elevator dispatching system featuring an interactive 3D simulation, OOP C++ core engine, and real-time group control dispatcher.

[![Live Demo - 3D Group Control](https://img.shields.io/badge/Live%20Demo-3D%20Group%20Control%20Simulator-00f2fe?style=for-the-badge&logo=three.js)](https://anuragbraveboy-sudo.github.io/Elevator-Dispatching-System/elevator-group-3d.html)
[![Live Demo - Web Showcase](https://img.shields.io/badge/Live%20Demo-Modern%20Web%20Showcase-4facfe?style=for-the-badge)](https://anuragbraveboy-sudo.github.io/Elevator-Dispatching-System/index.html)
[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://anuragbraveboy-sudo.github.io/Elevator-Dispatching-System/)

---

### 🌐 Live Web Simulators & Deployment
- 🎮 **[3D Central Elevator Group-Control Simulator](https://anuragbraveboy-sudo.github.io/Elevator-Dispatching-System/elevator-group-3d.html)**: 12-floor central lobby bank, 4 side-by-side lifts, 3D animated passengers, car interior panel, live algorithm switcher (Nearest Car / LOOK-SCAN / Least Wait Time), counterweights, dynamic lighting, and admin analytics dashboard.
- 🏢 **[3D 4-Corner Elevator Tower](https://anuragbraveboy-sudo.github.io/Elevator-Dispatching-System/elevator-3d.html)**: Glass cutaway building, independent queues, interactive camera follow, and floor buttons.
- 🚀 **[Landing Page & Architecture Showcase](https://anuragbraveboy-sudo.github.io/Elevator-Dispatching-System/index.html)**: Dark glassmorphism interface detailing the C++ OOP engine, algorithms, UML models, and interactive shaft simulator.

---

**Made by:**
| Name | Enrollment No. |
|---|---|
| Shobhit Rai | 20251502032 |
| Krish Kumar | 20251502015 |
| Siddhi Vyas | 20251501163 |
| Tamanna Sharma | 20251502034 |
| Pranjali Nama | 20251502022 |

---

## 💡 What Does This System Do?

Imagine you are standing on Floor 3 and want to go to Floor 8.
You press a button → The **optimal elevator is dispatched** → You board → It smoothly delivers you to Floor 8.

The project models this across:
1. **Interactive 3D Web Simulation (Three.js)**: Full real-time multi-car visualization with passenger flow, call queueing, counterweights, and telemetry.
2. **C++ OOP Engine (`src/code.cpp`)**: A robust, menu-driven multi-elevator dispatching system modeling realistic building dynamics.

---

## 🤖 Dispatching Algorithms

The dispatch system supports multiple intelligent scheduling strategies:

### 1. LOOK / SCAN Algorithm
- Elevators service calls in their current direction until no further requests exist in that direction, then reverse.
- Calculates an exact cost score factoring current direction, relative distance, and turnaround penalties.

### 2. Nearest Car
- Evaluates raw spatial proximity to deliver the quickest immediate response.

### 3. Least Waiting Time (Cost-Based)
- Minimizes global passenger wait times by weighting distance, current passenger load, and scheduled stops.

---

## 🧩 C++ Object-Oriented Architecture

| Class | Purpose |
|---|---|
| `Elevator` | Base elevator class managing floor, direction, door state, capacity, and kinematics |
| `EmergencyElevator` | Specialized emergency unit with bypass modes and rescue protocols |
| `ElevatorRequest` | Trip specification (source, destination, direction, timestamp) |
| `MaintenanceStaff` | Emergency dispatch team handling passenger safety and stuck units |
| `ElevatorDispatchSystem` | Central dispatcher executing dispatch scoring and fleet orchestration |
| `ElevatorMotor` | Nested motor component driving car motion |

### 📚 OOP Concepts Demonstrated
- **Encapsulation**: Private fields accessed via protected getters/setters.
- **Nested Classes & Composition**: `ElevatorMotor` tightly integrated within `Elevator`.
- **Inheritance & Polymorphism**: `EmergencyElevator` extending `Elevator` with virtual method overrides.
- **Operator Overloading**: Custom stream insertion (`<<`) and equality comparison (`==`).
- **Templates & Type Casting**: Template boxes and custom basic-to-class/class-to-class casting.
- **Friend Functions**: External diagnostic routines (`showRequestSummary`).
- **Static Members**: Global fleet analytics counters (`totalRequests`, `getTotalRequests()`).

---

## 📁 Repository Structure

```
Elevator-Dispatching-System/
├── .github/workflows/
│   └── deploy.yml              ← Automatic GitHub Pages deployment
├── index.html                  ← Modern landing page & architecture showcase
├── elevator-group-3d.html      ← 3D central bank group-control simulator
├── elevator-3d.html            ← 3D corner tower simulator
├── style.css                   ← Glassmorphism & responsive styles
├── app.js                      ← Hybrid 2D/3D visualizer script
├── docs/                       ← Documentation, class diagrams & web mirror
│   ├── index.html
│   ├── elevator-group-3d.html
│   ├── elevator-3d.html
│   ├── crc-cards.md
│   └── use-cases.md
├── src/
│   └── code.cpp                ← Core C++ Object-Oriented engine
└── README.md
```

---

## ▶️ How to Run Locally

### 1. Web 3D Simulation & Showcase
Run any standard HTTP server in the repository root:

```bash
# Using Python
python -m http.server 3000
```
Open **`http://localhost:3000/elevator-group-3d.html`** or **`http://localhost:3000/`** in your browser.

### 2. C++ Console Engine
Compile and run with any C++17 compatible compiler:

```bash
# Linux / macOS
g++ -std=c++17 src/code.cpp -o elevator
./elevator

# Windows (PowerShell / Command Prompt)
g++ -std=c++17 src\code.cpp -o elevator.exe
.\elevator.exe
```

---

## 📝 Academic Context
Developed as part of the **C++ Object-Oriented Programming (CS 261)** course curriculum.
