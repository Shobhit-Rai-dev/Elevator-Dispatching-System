#include "constants.hpp"
#include "exceptions.hpp"
#include "value_types.hpp"
#include "elevator.hpp"
#include "emergency_elevator.hpp"
#include "elevator_request.hpp"
#include "maintenance_staff.hpp"
#include "elevator_dispatch_system.hpp"
#include <iostream>
#include <limits>
using namespace std;
int main() {
    Elevator elevator1(1,0,8), elevator2(2,6,10);
    EmergencyElevator elevator3(3,2,8,"RED-ALERT-911");
    elevator2.setDirection(DOWN);
    ElevatorDispatchSystem system;
    system.addElevator(&elevator1); system.addElevator(&elevator2); system.addElevator(&elevator3);
    MaintenanceStaff staff("Alpha Response Team");
    int choice=0;
    while (true) {
        cout << "\n========== ELEVATOR CONTROL PANEL ==========\n"
             << "  [1] Request Elevator (Source & Destination)\n"
             << "  [2] Elevator Car Controls (Doors & Floor)\n"
             << "  [3] Report Emergency & Rescue\n"
             << "  [4] View Elevators Status\n"
             << "  [5] OOP Features & System Stats\n"
             << "  [6] Exception Handling (Base/Derived/Finally)\n"
             << "  [7] Multithreading Demonstration\n"
             << "  [8] Exit\nEnter choice (1-8): ";
        if (!(cin>>choice)) { cin.clear(); cin.ignore(numeric_limits<streamsize>::max(),'\n'); continue; }
        if (choice==1) {
            int src,dest; cout << "Enter Source Floor (0-10): "; cin>>src; cout << "Enter Destination Floor (0-10): "; cin>>dest;
            if (src<MIN_FLOOR||src>MAX_FLOOR||dest<MIN_FLOOR||dest>MAX_FLOOR||src==dest) { cout<<"Invalid floors entered!\n"; continue; }
            ElevatorRequest request(src,dest); system.processRequest(request);
        } else if (choice==2) {
            system.displayStatus(); cout<<"Select Elevator (1-"<<system.getCount()<<"): "; int number; cin>>number;
            Elevator* lift=system.getElevator(number-1); if (!lift) { cout<<"Invalid elevator!\n"; continue; }
            cout<<"Actions: [1] Open Door  [2] Close Door  [3] Move to Floor\nChoice: "; int action; cin>>action;
            if(action==1) lift->openDoor(); else if(action==2) lift->closeDoor(); else if(action==3) { int target; cout<<"Target Floor: "; cin>>target; if(target>=MIN_FLOOR&&target<=MAX_FLOOR) lift->move(target,"Manual Action"); else cout<<"Invalid floor!\n"; }
        } else if (choice==3) {
            int floor; cout<<"Emergency Floor (0-10): "; cin>>floor; if(floor<MIN_FLOOR||floor>MAX_FLOOR){cout<<"Invalid floor!\n";continue;}
            elevator3.triggerEmergencyMode(); system.handleEmergency(floor,staff);
        } else if (choice==4) system.displayStatus();
        else if (choice==5) {
            cout<<"\nTotal Requests Processed: "<<ElevatorDispatchSystem::getTotalRequests()<<"\n";
            ElevatorRequest r1(1,5),r2(1,5); cout<<"Stream Overloading: "<<r1<<"\n";
            cout<<"Equality Check (r1 == r2): "<<(r1==r2?"MATCH":"DIFFERENT")<<"\n"; showRequestSummary(r1);
            cout<<"\n--- Type Casting Demonstrations ---\n";
            int cap=elevator1.getCapacity(); CapacityValue capObject(cap); cout<<"Basic-to-Class: "; capObject.display(); cout<<endl;
            int extracted=capObject; cout<<"Class-to-Basic: "<<extracted<<" kg\n";
            FloorValue source(5); ElevatorFloorValue destination=source; cout<<"Class-to-Class: "; destination.display(); cout<<endl;
            cout<<"\n--- Function Template Demonstration ---\n"; displayTemplateValue("Elevator ID: ",elevator1.getId()); displayTemplateValue("Elevator status: ",elevator1.getStatus());
            cout<<"\n--- Class Template Demonstration ---\n"; TemplateBox<int> floorBox(elevator1.getFloor()); TemplateBox<string> statusBox(elevator1.getStatus()); floorBox.display("Elevator floor: "); statusBox.display("Elevator status: ");
        } else if (choice==6) {
            int floor; cout<<"Enter a floor to validate (0-10): "; cin>>floor; FinallyBlock finallyBlock;
            try { if(floor<MIN_FLOOR) throw BaseException("Floor cannot be negative."); else if(floor>MAX_FLOOR) throw FloorException("Floor exceeds the maximum floor (10)."); cout<<"Valid floor number: "<<floor<<"\n"; }
            catch(const FloorException& e){cout<<"Derived exception caught: "<<e.getMessage()<<"\n";}
            catch(const BaseException& e){cout<<"Base exception caught: "<<e.getMessage()<<"\n";}
        } else if (choice==7) { system.runMultithreadingDemo(); }
        else if (choice==8) { cout<<"Exiting Elevator System.\n"; break; }
        else cout<<"Invalid choice. Please enter a number from 1 to 8.\n";
    }
    return 0;
}
