Raw candidate list

We first extract nouns from the three specifications as possible classes and verbs as possible responsibilities/operations.

Raw noun candidate	
Passenger	
Elevator	
Floor	
Direction	
Call Button	
Dispatch Algorithm	
Elevator Status	
Elevator Location	
Response Time	
Waiting Queue	
Destination	
Movement Command	
Fault	
Emergency	
Emergency Button	
Emergency Sensor	
Emergency Event	
Security	
Maintenance Team	
Building Administrator	
Communication Channel	

---	
	
Building Management System	

Passenger Request	
Verb analysis
The important verbs indicate what the eventual classes need to do.
Verb/action	Possible responsibility
Request	Passenger requests an elevator
Press	Passenger presses call/emergency button
Detect	System detects requests/emergencies
Identify	System identifies floor, direction and elevator
Check	System checks elevator status
Evaluate	System evaluates available elevators
Select	System selects suitable elevator
Assign	System assigns request to elevator
Move	Elevator moves toward a floor
Update	System updates status/location
Notify	System notifies passenger/security
Enter	Passenger enters elevator
Exit	Passenger exits elevator
Calculate	System calculates response time
Compare	System compares elevators
Filter	System removes unavailable elevators
Record	System records requests/emergency events
Stop	System stops assigning requests to an affected elevator
Mark	System marks elevator unavailable
Search	System searches for another elevator
Reassign	System reassigns a request
Inspect	Maintenance inspects elevator
Resolve	Maintenance resolves the problem
Return	Elevator returns to normal service
For example, the Dispatch specification contains the sequence of retrieving elevator status, filtering unavailable elevators, calculating response time, comparing elevators, selecting one, and assigning the request.

---

C. Applying the four filters

For noun–verb analysis, we can use these four common filters:
1.	Redundant – duplicate/overlapping concept.
2.	Irrelevant – not important to the system's domain.
3.	Attribute – better represented as an attribute of another class.
4.	Implementation/detail – something that should not become a domain class.

Candidate	Filter	Reason
Direction	Attribute	Up/Down is an attribute of a Request
Floor	Attribute	A floor number can be an attribute of Request/Elevator
Elevator Status	Attribute	Status belongs to Elevator
Elevator Location	Attribute	Current floor/location belongs to Elevator
Response Time	Attribute	A calculated value associated with an Elevator/Request
Destination	Attribute	Destination floor belongs to Request
Movement Command	Implementation/detail	Command is an internal system action
Dispatch Algorithm	Implementation/detail	Algorithm is how dispatch is implemented
Call Button	Implementation/detail	Interface/device detail rather than a core domain class
Emergency Button	Implementation/detail	Input mechanism for an emergency
Emergency Sensor	Implementation/detail	Detection mechanism
Communication Channel	Implementation/detail	Communication mechanism
Building Management System	Irrelevant/External	Mentioned as a possible external information source, not central to these three use cases
Passenger Request	Redundant	Same conceptual entity as Request
Security	Irrelevant/External actor	Acts as an external recipient rather than a core domain class
Building Administrator	Irrelevant/External actor	Actor interacting with the system
Maintenance Team	Irrelevant/External actor	External actor responsible for maintenance
Fault	Attribute	Can be represented as an elevator's fault/emergency status
Candidates eliminated
Surviving classes
After applying the filters, I would keep these six core domain classes:
1. Passenger
Represents the person who requests and uses an elevator.
2. Elevator
Represents an individual elevator and its movement/status.
3. Request
Represents a passenger's request for an elevator.
4. Elevator Dispatch System
Represents the central system that receives requests and assigns elevators.
5. Emergency
Represents an emergency condition/event associated with an elevator.
6. Maintenance Staff
Represents the personnel who inspect and restore an elevator after a fault/emergency.
