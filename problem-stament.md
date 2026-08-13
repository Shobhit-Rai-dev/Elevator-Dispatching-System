Cs 261
Lab project


Elevator dispatch system
1.Problem Statement
In a multi story building people need elevators to travel between floors. When a person wants to use an elevator, they should be able to enter their current floor and their desired destination.For a very long time people are facing a lot of issues  using elevator systems. Not being able to understand the use of up and down buttons on elevators is the most common issue regarding the use of elevators.
Some elevators may become overcrowded while others remain unused.People had to wait for a very long time for lifts . There was not a centralised system to locate defaults for the management team even in the case of emergency. Most of the elevators uses SCAN principle(SCAN is a disk/elevator scheduling principle where the elevator:
Moves continuously in one direction, serves all requests encountered along that direction, reaches the end of the service range, then reverses direction and serves requests in the opposite direction.
It is often called the elevator algorithm.
Example:
Current floor = 5, moving UP
Requests = 2, 3, 7, 8, 9
5 → 7 → 8 → 9 → 10 → 3 → 2
If the building has 10 floors, SCAN goes to floor 10 even if nobody requested floor 10, then reverses.
) 
But look principle is way better compare to it because of following reasons:
LOOK Principle
LOOK is a variation of SCAN where the elevator:
Moves in one direction and serves all requests in that direction, but reverses as soon as there are no more requests in that direction instead of going to the extreme floor.
Example:
Current floor = 5, moving UP
Requests = 2, 3, 7, 8, 9
5 → 7 → 8 → 9
          ↓
          3 → 2
It doesn't go to floor 10 because there is no request there.

The Elevator Dispatch System is developed to solve these problems. It receives elevator requests from passengers, chooses the most suitable elevator, and sends it to the required floor. After the passenger enters the elevator, they can select their destination floor, and the system safely takes them there. 

The system also controls door opening and closing, keeps track of elevator movement, and ensures that multiple elevators work together efficiently.

The main purpose of the Elevator Dispatch System is to provide fast, safe, and efficient elevator service, reduce passenger waiting time, use elevators wisely, and make travel inside multi-storey buildings smooth and comfortable. It is useful in residential buildings, offices, hospitals, hotels, colleges, and shopping malls.






Question 2: Identify all actors, including any external systems and any scheduled or time-triggered actors.
Project: Elevator Dispatch System
An actor is any person, device, or external system that interacts with the Elevator Dispatch System. Actors can be users, external systems, or automated systems that perform tasks without human involvement.
1. Primary Actors
1. Passenger (User)
The passenger is the main user of the Elevator Dispatch System. The passenger requests an elevator by pressing the Up or Down button on the floor. After entering the elevator, the passenger selects the destination floor. The system then takes the passenger safely to the selected floor.
Responsibilities:
Request an elevator.
Enter the elevator.
Select the destination floor.
Exit the elevator at the correct floor.
2. Building Administrator
The Building Administrator manages and monitors the elevator system. They can view the status of all elevators, update system settings, and receive reports about faults or maintenance.
Responsibilities:
Monitor elevator performance.
View system reports.
Configure system settings.
Manage elevator operations.
3. Maintenance Staff
The Maintenance Staff is responsible for keeping the elevators in good working condition. They inspect elevators, repair faults, and perform regular maintenance to ensure passenger safety.
Responsibilities:
Inspect elevators.
Repair faults.
Perform scheduled maintenance.
Return elevators to normal operation after maintenance.
2. External System Actors
4. Fire Alarm System
The Fire Alarm System communicates with the Elevator Dispatch System during emergencies. When a fire alarm is activated, the elevator system moves elevators to a safe floor and prevents normal operation.
Responsibilities:
Send emergency signals.
Activate emergency mode.
Help ensure passenger safety.
3. Scheduled / Time-Triggered Actor
5. System Timer (Scheduler)
The System Timer is an automatic actor that performs tasks at fixed intervals without any user action.
Responsibilities:
Check elevator health regularly.
Record elevator usage.
Generate maintenance reminders.
Monitor elevator status.
Update system logs.
Detecting possible faults.


6. Count number of usage
After a certain number of usage the lift automatically shuts down for compulsory maintaince





