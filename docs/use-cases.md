# Use Case Specifications

This document contains the detailed specifications for three core use cases of the Smart Elevator Dispatching System, fulfilling Deliverable 3.

---

## Use Case 1: Request Elevator

**Primary Actor:** Passenger
**Stakeholders:** 
- Passenger: Wants swift and safe transport to their destination.
- Building Management: Wants optimal energy efficiency and reduced lobby congestion.

**Preconditions:** 
- The system is powered on.
- At least one elevator in the building is operational and not in maintenance mode.

**Postconditions:** 
- An elevator successfully arrives at the passenger's source floor and opens its doors.

**Trigger:** 
- The passenger presses the "UP" or "DOWN" call button located in the floor hallway.

**Main Flow:**
1. The passenger presses the call button.
2. The Floor Button registers the request and sends the source floor and direction to the Elevator Controller.
3. The Elevator Controller evaluates the positions and states of all active elevators using the Dispatch Strategy algorithm.
4. The Controller assigns the request to the most optimal Elevator.
5. The system triggers the `<<include>>` use case "Update Floor Display", updating the digital screen to inform the passenger that a car is assigned.
6. The chosen Elevator travels to the requested floor.
7. The Elevator arrives at the floor, changes its state to Idle, and opens its doors for boarding.

**Alternate Flows:**
- **3a. No Elevators Available:** If all elevators are currently in Maintenance Mode, the system updates the Floor Display to read "Out of Service" and ignores the request.
- **6a. Elevator Reaches Capacity En Route:** If the assigned elevator fills up at an intermediate floor before reaching the passenger, it triggers a "Capacity Reached" event. The Controller transparently re-runs the Dispatch Strategy (Step 3) and assigns a *new* elevator to the passenger.

---

## Use Case 2: Put Elevator in Maintenance Mode

**Primary Actor:** Maintenance Staff
**Stakeholders:** 
- Maintenance Staff: Requires exclusive and safe control over the elevator car.
- Passengers: Need to know the car is out of service so they do not wait for it.

**Preconditions:** 
- The maintenance staff possesses the correct physical security key or digital authorization code.

**Postconditions:** 
- The selected elevator is removed from the active dispatch pool and locked for servicing.

**Trigger:** 
- Maintenance staff inputs the security code or turns the physical key in the elevator's control panel.

**Main Flow:**
1. The Maintenance Staff triggers the maintenance request via the control panel.
2. The system verifies the authorization credentials.
3. The system changes the elevator's internal state to `MaintenanceState`.
4. The Elevator Controller removes this specific elevator from the list of available cars (it will no longer receive dispatch assignments).
5. The system updates all hallway floor displays for this elevator shaft to read "Maintenance - Out of Service".
6. The elevator doors lock open, granting the staff safe access to the car.

**Alternate Flows:**
- **2a. Invalid Authorization:** If the code or key is incorrect, the system rejects the request, plays an error beep, and logs a security warning.
- **3a. Elevator is Currently Occupied:** If the elevator is currently moving or has passengers inside when the key is turned, the system will *not* immediately halt the car. Instead, it schedules the maintenance mode to activate ONLY after the current trip completes and all passengers exit.

---

## Use Case 3: Generate Daily Usage Log

**Primary Actor:** Daily Log Scheduler (Scheduled / Time-triggered Actor)
**Stakeholders:** 
- Building Management: Relies on analytics to track energy usage, passenger wait times, and hardware faults.

**Preconditions:** 
- The system has been actively recording dispatch and movement data throughout the day.

**Postconditions:** 
- A comprehensive daily log file is generated, saved, and distributed to management.

**Trigger:** 
- The system clock reaches exactly 23:59 (11:59 PM).

**Main Flow:**
1. The Daily Log Scheduler triggers the automated reporting service.
2. The system queries the database for all trip records, average wait times, and error logs generated during the day.
3. The system compiles this raw data into a formatted PDF or CSV summary report.
4. The system saves the report into the long-term management database.
5. The system automatically emails the report to the configured building administrators.

**Alternate Flows:**
- **2a. Database Connection Timeout:** If the system cannot connect to the database to retrieve the records, it triggers an alert to the IT team, caches the request locally, and retries the connection every 10 minutes until successful.
- **4a. Insufficient Storage Space:** If the server is running out of disk space to save the new report, the system automatically compresses older logs from previous months to free up space before saving the new file.
