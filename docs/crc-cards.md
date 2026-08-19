CRC Cards

Based on the five surviving classes from Question 1:
1.	Passenger
2.	Elevator
3.	Request
4.	Elevator Dispatch System
5.	Emergency
CRC stands for Class – Responsibilities – Collaborators.

CRC Card 1: Passenger

Class	Passenger

Responsibilities	 Request an elevator
 Specify the direction (Up/Down)
 Enter the elevator
 Select destination floor
 Exit the elevator at the destination 
Collaborators	Request, Elevator Dispatch System, Elevator 
The specification states that the passenger presses the Up/Down button, enters the elevator, selects the destination, and exits at the correct floor.
________________________________________
CRC Card 2: Elevator

Class	Elevator
Responsibilities	 Receive an assigned request
 Move toward the requested floor
 Stop at the requested floor
 Maintain current location
 Maintain operational status
 Become unavailable during an emergency  
Collaborators	Passenger, Request, Elevator Dispatch System, Emergency


The specifications describe the elevator being selected, assigned a request, receiving a movement command, travelling to the requested floor, and becoming unavailable during an emergency.

CRC Card 3: Request

Class	Request
Responsibilities	Store the passenger's elevator request
Store requested floor
Store direction
Maintain request status
Be assigned to an elevator
Wait in queue when no elevator is available 
Collaborators	Passenger, Elevator, Elevator Dispatch System 
The specification states that the system identifies the passenger's floor and requested direction, assigns the request to an elevator, and places it in a waiting queue if no elevator is available.

________________________________________
CRC Card 4: Elevator Dispatch System

Class	Elevator Dispatch System
Responsibilities	Receive elevator requests
Identify requested floor and direction
Check elevator location and status
Filter unavailable elevators
Calculate response time
Compare available elevators
Select the most suitable elevator
Assign requests to elevators
Update request/elevator status
Handle emergencies
Notify relevant personnel 
Collaborators	Passenger, Request, Elevator, Emergency 
This is the central class because it performs the main coordination work in all three specifications: receiving requests, selecting elevators, assigning requests, updating status, and handling emergencies.

________________________________________
CRC Card 5: Emergency


Class	Emergency
Responsibilities	Represent an emergency condition
Identify the affected elevator
Record the emergency
Cause the affected elevator to be removed from normal dispatching
Maintain emergency status until the situation is resolved 
Collaborators	Elevator, Elevator Dispatch System 

The specification says that when an emergency occurs, the affected elevator is identified, removed from normal dispatching, marked unavailable, and the emergency is recorded.


