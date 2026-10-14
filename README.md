# 🏢 Elevator Dispatching System

> A practical and efficient C++ simulation of a real-world Elevator Dispatch System using Object-Oriented Programming principles and the LOOK scheduling algorithm.

**Made by:**
| Name | Enrollment No. |
|---|---|
| Shobhit Rai | 20251502032 |
| Krish Kumar | 20251502015 |
| Siddhi Vyas | 20251501163 |
| Tamanna Sharma | 20251502034 |
| Pranjali Nama | 20251502022 |

---

## 📌 About the Project

This project simulates a smart **Elevator Dispatching System** for a 10-floor building. It features an interactive terminal-based control panel where a user can:
- Request an elevator from any floor to any floor
- Manually operate elevator doors and floor buttons
- Trigger emergency rescues with maintenance staff
- View real-time elevator fleet status

The system intelligently dispatches the **best available elevator** using the **LOOK Algorithm**, which considers each elevator's current floor, direction of motion, and the passenger's travel direction — just like real-world elevator controllers.

---

## ⚙️ Features

- ✅ **LOOK Algorithm** for smart, direction-aware elevator dispatching
- ✅ Interactive **terminal control panel** (6 menu options)
- ✅ **3 Elevators** — 2 standard + 1 dedicated Emergency unit
- ✅ **Emergency rescue** system with maintenance staff dispatch
- ✅ **Real-time fleet status** table
- ✅ Full **OOP implementation** in C++

---

## 🧠 OOP Concepts Used

| OOP Concept | Where Used |
|---|---|
| **Encapsulation** | `Elevator` class — private members with getters/setters |
| **Abstraction** | `move()`, `openDoor()`, `closeDoor()` hide internal logic |
| **Nested Class** | `ElevatorMotor` defined inside `Elevator` |
| **Inheritance** | `EmergencyElevator` inherits from `Elevator` |
| **`final` Keyword** | `class EmergencyElevator final` — no further inheritance |
| **Virtual Function** | `virtual void move()` and `virtual void display()` |
| **Override** | `display()` overridden in `EmergencyElevator` |
| **`<<` Stream Operator Overloading** | `friend ostream& operator<<` in `Elevator` and `ElevatorRequest` |
| **`==` Operator Overloading** | `operator==` in `ElevatorRequest` |
| **Friend Function** | `showRequestSummary()` accesses private members |
| **Static Variable** | `static int totalRequests` in `ElevatorDispatchSystem` |
| **Static Function** | `static int getTotalRequests()` — callable without object |
| **Runtime Polymorphism** | Base `Elevator*` pointer calls derived `display()` |

---

## 🔁 LOOK Algorithm — How It Works

The **LOOK Algorithm** assigns a cost score to each elevator based on:

1. **Elevator is IDLE** → Cost = simple distance to passenger floor
2. **Elevator moving UP**
   - Passenger ahead, same direction → *Direct pickup (cheapest)*
   - Passenger ahead, wants to go DOWN → sweep to top, then come back
   - Elevator already passed the floor → full sweep + penalty
3. **Elevator moving DOWN**
   - Passenger below, same direction → *Direct pickup (cheapest)*
   - Passenger below, wants to go UP → sweep to bottom, then come back
   - Elevator already passed the floor → full sweep + penalty
4. **Emergency / Maintenance elevators** → Cost = 9999 (excluded)

> The elevator with the **lowest cost score** gets dispatched.

---

## 🖥️ Terminal Control Panel

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

---

## 📁 Project Structure

```
Elevator-Dispatching-System/
│
├── src/
│   ├── code.cpp                      # Original source code
│   └── code.exe                      # Compiled binary
│
├── docs/
│   ├── crc-cards.md                  # CRC cards for class design
│   ├── noun-analysis.md              # Noun analysis document
│   ├── use-cases.md                  # Use case documentation
│   ├── use-case-diagram.puml         # PlantUML use case diagram
│   ├── Domain-class-diagram.puml     # PlantUML class diagram
│   ├── Domain-class-diagram.png.jpeg # Class diagram image
│   ├── object-diagram.puml           # PlantUML object diagram
│   └── object-diagram.png.png        # Object diagram image
│
├── problem-stament.md                # Problem statement
└── README.md                         # Project overview (this file)
```

---

## 🚀 How to Compile & Run

**Requirements:** g++ compiler with C++17 support

```bash
g++ -std=c++17 -Wall src/code.cpp -o elevator_system
./elevator_system
```

**On Windows (MinGW):**
```powershell
g++ -std=c++17 -Wall src\code.cpp -o elevator_system.exe
.\elevator_system.exe
```

---

## 📄 License

This project is for educational purposes as part of a C++ Object-Oriented Programming course assignment.