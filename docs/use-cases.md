Use Case Specification: Request Elevator
Use Case ID: UC-01
Use Case Name: Request Elevator
Primary Actor: Passenger

STAKEHOLDERS:
1.	Passenger: Wants an elevator to arrive at the requested floor quickly.
2.	Building Administrator: Wants efficient and reliable elevator operation.
3.	Elevator Maintenance Team: Needs the system to detect and report elevator problems.

PRECONDITIONS:
1.	The elevator dispatch system is operational.
2.	At least one elevator is available or operational.
3.	The passenger is at a floor with a call button.

POSTCONDITIONS:
1.	Elevator arrives at the requested floor.
2.	Passenger can enter the elevator.

TRIGGER:
Passenger presses the "Up" or "Down" call button.

MAIN FLOW:
1.	The passenger presses the Up or Down button.
2.	The system detects the request.
3.	The system identifies the passenger's current floor and requested direction.
4.	The system checks the status and location of all operational elevators.
5.	The dispatch algorithm evaluates the available elevators.
6.	The system selects the most suitable elevator.
7.	The request is assigned to the selected elevator.
8.	The selected elevator moves toward the passenger's floor.
9.	The system updates the elevator's status and location.
10.	The passenger is notified when the elevator arrives.

ALTERNATE FLOW 1 – No Elevator Currently Available:
1.	The system detects that all elevators are busy or unavailable.
2.	The request is placed in a waiting queue.
3.	The system continuously monitors elevator availability.
4.	When an elevator becomes available, the system assigns it to the waiting request.
5.	The passenger is notified when the elevator is dispatched.

ALTERNATE FLOW 2 – Invalid or Duplicate Request:
1.	The system detects that the same request has already been registered.
2.	The system does not create another duplicate request.
3.	The existing request remains active.
4.	The passenger continues waiting for the assigned elevator.

Use Case Specification: Dispatch Elevator
Use Case ID: UC-02
Use Case Name: Dispatch Elevator
Primary Actor: Elevator Dispatch System

STAKEHOLDERS :
•	Passenger/User: Wants the elevator to arrive quickly and safely.
•	Building Administrator: Wants efficient utilization of all elevators.
•	Elevator Operator/Maintenance Team: Wants accurate elevator status information.
•	Building Management System: May provide information about elevator availability and building conditions.

PRECONDITIONS:
1.	The elevator dispatch system is operational.
2.	At least one elevator is functioning.
3.	A passenger request has been registered.
4.	The system has access to elevator location and status information.

POSTCONDITIONS:
1.	An appropriate elevator is assigned to the request.
2.	The selected elevator receives a destination/stop command.
3.	The request status is updated.
4.	The elevator begins moving toward the requested floor.

TRIGGER:
A new passenger elevator request is received by the dispatch system.

MAIN FLOW :
1.	The dispatch system receives a new elevator request.
2.	The system identifies the requested floor and direction.
3.	The system retrieves the current position and status of all elevators.
4.	The system filters out elevators that are out of service.
5.	The system calculates the estimated response time for each suitable elevator.
6.	The system compares the available elevators.
7.	The system selects the elevator with the most suitable response time.
8.	The system assigns the passenger request to the selected elevator.
9.	The selected elevator receives the required movement command.
10.	The elevator travels toward the passenger's floor.
11.	The system updates the request and elevator status.
12.	The elevator stops at the requested floor and the request is marked as served.

ALTERNATE FLOW 1 – Selected Elevator Becomes Unavailable:
1.	The system detects that the selected elevator has developed a fault or becomes unavailable.
2.	The current assignment is cancelled.
3.	The system marks the elevator as unavailable.
4.	The system searches for another suitable operational elevator.
5.	The request is reassigned to the next suitable elevator.

ALTERNATE FLOW 2 – Multiple Elevators Have Similar Response Times:
1.	The system identifies two or more elevators with similar estimated response times.
2.	The system compares additional factors such as current direction, number of assigned stops, and load.
3.	The elevator with the best overall efficiency is selected.
4.	The request is assigned to the selected elevator.

Use Case Specification: Handle Emergency
Use Case ID: UC-03
Use Case Name: Handle Elevator Emergency
Primary Actor: Elevator Dispatch System

STAKEHOLDERS:
•	Passenger: Wants to remain safe and receive emergency assistance.
•	Building Administrator/Security: Needs immediate notification of an elevator emergency.
•	Maintenance Team: Needs information about the elevator fault.
•	Emergency Services: May need to respond to serious emergencies.
•	Elevator Dispatch System: Must detect and respond to emergency conditions appropriately.

PRECONDITIONS:
1.	The elevator dispatch system is operational.
2.	The elevator is connected to the dispatch system.
3.	Emergency sensors or the emergency button are functional.
4.	Communication between the elevator and control system is available.

POSTCONDITIONS:
1.	The emergency condition is recorded.
2.	The affected elevator is removed from normal dispatching.
3.	Building security/maintenance is notified.
4.	Appropriate assistance is initiated.
5.	The elevator remains unavailable until it is declared safe.

TRIGGER:
An emergency button is pressed by a passenger or an emergency condition is detected by the elevator's sensors.

MAIN FLOW:
1.	A passenger presses the emergency button or an emergency sensor is activated.
2.	The dispatch system detects the emergency signal.
3.	The system identifies the affected elevator and its current floor/location.
4.	The system immediately stops assigning new passenger requests to that elevator.
5.	The system marks the elevator as Emergency/Out of Service.
6.	The system sends an emergency notification to building security or maintenance.
7.	The system records the emergency event and relevant elevator information.
8.	Security or maintenance personnel respond to the emergency.
9.	Once the problem is resolved, authorized personnel inspect the elevator.
10.	The elevator is returned to normal service after it is declared safe.

ALTERNATE FLOW 1 – Communication Failure:
1.	The system detects an emergency but cannot communicate with the affected elevator.
2.	The system records the communication failure.
3.	The system alerts building security/maintenance through the available communication channel.
4.	The elevator remains marked as unavailable until its condition can be verified.

ALTERNATE FLOW 2 – Emergency Resolved Before Assistance Arrives:
1.	The passenger or sensor indicates that the emergency condition has ended.
2.	The system records the change.
3.	The elevator remains unavailable until an authorized person verifies its safety.
4.	After verification, the elevator is returned to normal operation.

