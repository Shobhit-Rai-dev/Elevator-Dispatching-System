#include <iostream>
#include <string>
#include <vector>
#include <cmath>
using namespace std;

const int MIN_FLOOR = 0;
const int MAX_FLOOR = 10;

enum Direction { IDLE = 0, UP = 1, DOWN = 2 };

string dirName(Direction d) {
    return (d == UP) ? "UP" : (d == DOWN) ? "DOWN" : "IDLE";
}

class Elevator {
public:
    class ElevatorMotor {
    private:
        int hp;
        bool active;
    public:
        ElevatorMotor(int power = 75) : hp(power), active(false) {}
        void start() { active = true; }
        void stop() { active = false; }
    };
private:
    int id;
    int currentFloor;
    Direction direction;
    string status;
    bool doorOpen;
    ElevatorMotor motor;
protected:
    int capacity;
public:
    Elevator(int idNum, int floor, int cap)
        : id(idNum), currentFloor(floor), direction(IDLE),
          status("Available"), doorOpen(false), motor(80), capacity(cap) {}
    virtual ~Elevator() = default;
    int getId() const { return id; }
    int getFloor() const { return currentFloor; }
    Direction getDirection() const { return direction; }
    string getStatus() const { return status; }
    void setStatus(string s) { status = s; }
    void setDirection(Direction d) { direction = d; }
    void openDoor() {
        doorOpen = true;
        cout << "  Elevator #" << id << ": Doors OPENED at Floor " << currentFloor << ".\n";
    }
    void closeDoor() {
        doorOpen = false;
        cout << "  Elevator #" << id << ": Doors CLOSED.\n";
    }
    virtual void move(int targetFloor, const string& reason = "") {
        if (targetFloor == currentFloor) return;
        if (doorOpen) closeDoor();
        motor.start();
        direction = (targetFloor > currentFloor) ? UP : DOWN;
        cout << "  Elevator #" << id << " moving " << dirName(direction)
             << " [F" << currentFloor << " -> F" << targetFloor << "]";
        if (!reason.empty()) cout << " (" << reason << ")";
        cout << "...\n";
        currentFloor = targetFloor;
        direction = IDLE;
        motor.stop();
        cout << "  Elevator #" << id << " reached Floor " << currentFloor << ".\n";
    }
    virtual void display() const {
        cout << "  [Elevator " << id << "] Floor: " << currentFloor
             << " | Dir: " << dirName(direction)
             << " | Status: " << status
             << " | Doors: " << (doorOpen ? "OPEN" : "CLOSED")
             << " | Cap: " << capacity << "\n";
    }
    friend ostream& operator<<(ostream& os, const Elevator& e) {
        os << "[Elevator #" << e.id << " @ F" << e.currentFloor
           << " (" << dirName(e.direction) << ") | " << e.status << "]";
        return os;
    }
};

class EmergencyElevator final : public Elevator {
private:
    string code;
public:
    EmergencyElevator(int idNum, int floor, int cap, string siren = "EMG-911")
        : Elevator(idNum, floor, cap), code(siren) {}
    void triggerEmergencyMode() {
        setStatus("Emergency");
        setDirection(IDLE);
        cout << "  *** Emergency mode activated on Unit #" << getId() << " (Code: " << code << ") ***\n";
    }
    void display() const override {
        Elevator::display();
        cout << "    `--> Priority Emergency Unit (" << code << ")\n";
    }
};

class ElevatorRequest {
private:
    int sourceFloor;
    int destinationFloor;
    Direction desiredDir;
    string status;
public:
    ElevatorRequest(int src, int dest)
        : sourceFloor(src), destinationFloor(dest), status("Waiting") {
        desiredDir = (dest >= src) ? UP : DOWN;
    }
    int getSourceFloor() const { return sourceFloor; }
    int getDestinationFloor() const { return destinationFloor; }
    Direction getDesiredDirection() const { return desiredDir; }
    void setStatus(string s) { status = s; }
    bool operator==(const ElevatorRequest& other) const {
        return (sourceFloor == other.sourceFloor && destinationFloor == other.destinationFloor);
    }
    friend ostream& operator<<(ostream& os, const ElevatorRequest& req) {
        os << "[Request: F" << req.sourceFloor << " -> F" << req.destinationFloor
           << " (" << dirName(req.desiredDir) << ") | " << req.status << "]";
        return os;
    }
    friend void showRequestSummary(const ElevatorRequest& req);
};

void showRequestSummary(const ElevatorRequest& req) {
    cout << "  (Friend Function) Request: F" << req.sourceFloor << " -> F" << req.destinationFloor << "\n";
}

class MaintenanceStaff {
private:
    string name;
public:
    MaintenanceStaff(string staffName) : name(staffName) {}
    void rescue(Elevator& e) {
        cout << "\n  [Maintenance: " << name << "] Rescuing passengers from Elevator #" << e.getId() << "...\n";
        e.setStatus("Maintenance");
        e.openDoor();
        cout << "  [Maintenance] Passengers evacuated safely.\n";
        e.closeDoor();
        e.setStatus("Available");
        cout << "  [Maintenance] Elevator #" << e.getId() << " restored to Available.\n";
    }
};

class ElevatorDispatchSystem {
private:
    vector<Elevator*> elevators;
    static int totalRequests;
public:
    void addElevator(Elevator* e) { elevators.push_back(e); }
    static int getTotalRequests() { return totalRequests; }
    int calculateLookScore(const Elevator* elev, int src, Direction userDir) const {
        if (elev->getStatus() != "Available" && elev->getStatus() != "Busy") return 9999;
        int cur = elev->getFloor();
        Direction dir = elev->getDirection();
        if (dir == IDLE) return abs(cur - src);
        if (dir == UP) {
            if (src >= cur && userDir == UP) return (src - cur);
            if (src >= cur && userDir == DOWN) return (MAX_FLOOR - cur) + (MAX_FLOOR - src) + 2;
            return (MAX_FLOOR - cur) + (MAX_FLOOR - MIN_FLOOR) + (src - MIN_FLOOR) + 5;
        }
        if (dir == DOWN) {
            if (src <= cur && userDir == DOWN) return (cur - src);
            if (src <= cur && userDir == UP) return (cur - MIN_FLOOR) + (src - MIN_FLOOR) + 2;
            return (cur - MIN_FLOOR) + (MAX_FLOOR - MIN_FLOOR) + (MAX_FLOOR - src) + 5;
        }
        return abs(cur - src) + 10;
    }
    int selectBestElevator(int src, Direction userDir) const {
        int bestIdx = -1, lowestCost = 9999;
        cout << "\n  [LOOK Algorithm Evaluation]\n";
        for (size_t i = 0; i < elevators.size(); ++i) {
            int cost = calculateLookScore(elevators[i], src, userDir);
            cout << "    - Elevator #" << elevators[i]->getId()
                 << " @ F" << elevators[i]->getFloor()
                 << " (" << dirName(elevators[i]->getDirection()) << ") -> Cost: " << cost << "\n";
            if (cost < lowestCost) { lowestCost = cost; bestIdx = static_cast<int>(i); }
        }
        return (lowestCost < 9000) ? bestIdx : -1;
    }
    void processRequest(ElevatorRequest& req) {
        int idx = selectBestElevator(req.getSourceFloor(), req.getDesiredDirection());
        if (idx == -1) { cout << "  No available elevator at the moment.\n"; return; }
        Elevator* e = elevators[idx];
        cout << "  >>> Dispatching Elevator #" << e->getId() << " to pickup.\n";
        e->setStatus("Busy");
        req.setStatus("In-Transit");
        totalRequests++;
        e->move(req.getSourceFloor(), "Pickup");
        e->openDoor();
        e->closeDoor();
        e->move(req.getDestinationFloor(), "Dropoff");
        e->openDoor();
        e->closeDoor();
        e->setStatus("Available");
        req.setStatus("Completed");
        cout << "  " << req << "\n";
    }
    void handleEmergency(int floor, MaintenanceStaff& staff) {
        cout << "\n  [ALERT] Emergency reported at Floor " << floor << "!\n";
        int bestIdx = 0, minDist = 999;
        for (size_t i = 0; i < elevators.size(); ++i) {
            int d = abs(elevators[i]->getFloor() - floor);
            if (d < minDist) { minDist = d; bestIdx = static_cast<int>(i); }
        }
        Elevator* e = elevators[bestIdx];
        e->setStatus("Emergency");
        e->move(floor, "Emergency Dispatch");
        staff.rescue(*e);
    }
    Elevator* getElevator(int index) {
        return (index >= 0 && index < static_cast<int>(elevators.size())) ? elevators[index] : nullptr;
    }
    size_t getCount() const { return elevators.size(); }
    void displayStatus() const {
        cout << "\n--- ELEVATOR FLEET STATUS ---\n";
        for (const auto* e : elevators) e->display();
    }
};

int ElevatorDispatchSystem::totalRequests = 0;

int main() {
    Elevator e1(1, 0, 8);
    Elevator e2(2, 6, 10);
    EmergencyElevator e3(3, 2, 8, "RED-ALERT-911");
    e2.setDirection(DOWN);
    ElevatorDispatchSystem system;
    system.addElevator(&e1);
    system.addElevator(&e2);
    system.addElevator(&e3);
    MaintenanceStaff staff("Alpha Response Team");
    int choice = 0;
    while (true) {
        cout << "\n========== ELEVATOR CONTROL PANEL ==========\n"
             << "  [1] Request Elevator (Source & Destination)\n"
             << "  [2] Elevator Car Controls (Doors & Floor)\n"
             << "  [3] Report Emergency & Rescue\n"
             << "  [4] View Elevators Status\n"
             << "  [5] OOP Features & System Stats\n"
             << "  [6] Exit\n"
             << "Enter choice (1-6): ";
        if (!(cin >> choice)) { cin.clear(); cin.ignore(1000, '\n'); continue; }
        if (choice == 1) {
            int src, dest;
            cout << "Enter Source Floor (" << MIN_FLOOR << "-" << MAX_FLOOR << "): ";
            cin >> src;
            cout << "Enter Destination Floor (" << MIN_FLOOR << "-" << MAX_FLOOR << "): ";
            cin >> dest;
            if (src < MIN_FLOOR || src > MAX_FLOOR || dest < MIN_FLOOR || dest > MAX_FLOOR || src == dest) {
                cout << "Invalid floors entered!\n";
                continue;
            }
            ElevatorRequest req(src, dest);
            system.processRequest(req);
        }
        else if (choice == 2) {
            system.displayStatus();
            cout << "Select Elevator (1-" << system.getCount() << "): ";
            int id, act;
            cin >> id;
            Elevator* el = system.getElevator(id - 1);
            if (!el) { cout << "Invalid elevator!\n"; continue; }
            cout << "Actions: [1] Open Door  [2] Close Door  [3] Move to Floor\nChoice: ";
            cin >> act;
            if (act == 1) el->openDoor();
            else if (act == 2) el->closeDoor();
            else if (act == 3) {
                int f;
                cout << "Target Floor: ";
                cin >> f;
                if (f >= MIN_FLOOR && f <= MAX_FLOOR) el->move(f, "Manual Action");
            }
        }
        else if (choice == 3) {
            int f;
            cout << "Emergency Floor (" << MIN_FLOOR << "-" << MAX_FLOOR << "): ";
            cin >> f;
            e3.triggerEmergencyMode();
            system.handleEmergency(f, staff);
        }
        else if (choice == 4) { system.displayStatus(); }
        else if (choice == 5) {
            cout << "\nTotal Requests Processed: " << ElevatorDispatchSystem::getTotalRequests() << "\n";
            ElevatorRequest r1(1, 5), r2(1, 5);
            cout << "Stream Overloading: " << r1 << "\n";
            cout << "Equality Check (r1 == r2): " << (r1 == r2 ? "MATCH" : "DIFFERENT") << "\n";
            showRequestSummary(r1);
        }
        else if (choice == 6) { cout << "Exiting Elevator System.\n"; break; }
    }
    return 0;
}