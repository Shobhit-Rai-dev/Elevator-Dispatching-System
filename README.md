# 🏢 Elevator Dispatching System

A C++ program that works like a real elevator system in a building.

**Made by:**
| Name | Enrollment No. |
|---|---|
| Shobhit Rai | 20251502032 |
| Krish Kumar | 20251502015 |
| Siddhi Vyas | 20251501163 |
| Tamanna Sharma | 20251502034 |
| Pranjali Nama | 20251502022 |

---

## 💡 What Does This Program Do?

Imagine you are standing on Floor 3 and want to go to Floor 8.
You press a button → The **nearest elevator comes to you** → You get in → It drops you at Floor 8.

That is exactly what this program simulates — but for a 10-floor building with 3 elevators.

You run the program, a menu appears in the terminal, and you can:
- **Call an elevator** to your floor
- **Open/Close doors** manually
- **Report an emergency** (like someone stuck inside)
- **See the status** of all elevators anytime

---

## 🧩 How the Program is Structured

The program has **6 main building blocks (classes):**

| Class | What it represents |
|---|---|
| `Elevator` | A single elevator in the building |
| `EmergencyElevator` | A special elevator only for emergencies |
| `ElevatorRequest` | A trip request (e.g. Floor 3 → Floor 8) |
| `MaintenanceStaff` | The repair team that rescues stuck passengers |
| `ElevatorDispatchSystem` | The brain — decides which elevator to send |
| `ElevatorMotor` | The motor inside each elevator (nested inside `Elevator`) |

---

## 🤖 How Does It Pick the Right Elevator? (LOOK Algorithm)

Instead of just picking the **closest** elevator, the program is smarter.
It uses the **LOOK Algorithm** — the same method real elevators use.

**Simple rules:**
1. If an elevator is **not moving** → pick the closest one
2. If an elevator is **going UP** and you are also going UP → it picks you up on the way *(cheapest option)*
3. If an elevator is **going UP** but you want to go DOWN → it first finishes going up, then comes back for you
4. If the elevator **already passed your floor** → it has to do a full round trip first
5. If an elevator is in **Emergency or Maintenance** → it is completely ignored

> The elevator with the **lowest cost (score)** wins and gets sent to you.

---

## 🖥️ What the Menu Looks Like

When you run the program, you see this:

```
========== ELEVATOR CONTROL PANEL ==========
  [1] Request Elevator (Source & Destination)
  [2] Elevator Car Controls (Doors & Floor)
  [3] Report Emergency & Rescue
  [4] View Elevators Status
  [5] OOP Features & System Stats
  [6] Exit
============================================
```

Just type a number and press Enter!

---

## 📚 C++ Concepts Used (OOP)

| Concept | Simple Meaning | Used Where |
|---|---|---|
| **Encapsulation** | Data is kept private, only methods can access it | `Elevator` class |
| **Abstraction** | Complex steps hidden behind simple functions | `move()`, `openDoor()` |
| **Nested Class** | A class inside another class | `ElevatorMotor` inside `Elevator` |
| **Inheritance** | Child class gets features of parent class | `EmergencyElevator` from `Elevator` |
| **`final`** | No one can further extend this class | `EmergencyElevator final` |
| **Virtual Function** | Parent class method can be replaced by child | `display()`, `move()` |
| **Override** | Child replaces parent's method | `display()` in `EmergencyElevator` |
| **`<<` Operator** | Print object directly with `cout` | `Elevator`, `ElevatorRequest` |
| **`==` Operator** | Compare two objects with `==` sign | `ElevatorRequest` |
| **Friend Function** | Outside function can read private data | `showRequestSummary()` |
| **Static Variable** | One shared value for all objects | `totalRequests` counter |
| **Static Function** | Call without creating an object | `getTotalRequests()` |
| **Polymorphism** | Same function, different behavior based on object | `display()` via base pointer |

---

## 📁 Files in This Project

```
Elevator-Dispatching-System/
│
├── src/
│   └── code.cpp              ← The main C++ source code
│
├── docs/
│   ├── crc-cards.md          ← Class design cards
│   ├── noun-analysis.md      ← Object identification document
│   ├── use-cases.md          ← What the system can do
│   └── (diagrams...)         ← Class and object diagrams
│
├── problem-stament.md        ← The original problem given to us
└── README.md                 ← This file
```

---

## ▶️ How to Run

**Step 1 — Compile the code:**
```bash
g++ -std=c++17 src/code.cpp -o elevator
```

**Step 2 — Run it:**
```bash
./elevator
```

**On Windows:**
```powershell
g++ -std=c++17 src\code.cpp -o elevator.exe
.\elevator.exe
```

---

## 📝 Note

This project was made as part of a **C++ Object-Oriented Programming** course assignment.