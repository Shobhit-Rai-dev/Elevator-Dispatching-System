#include "maintenance_staff.hpp"
#include <iostream>
#include <utility>
MaintenanceStaff::MaintenanceStaff(std::string staffName) : name(std::move(staffName)) {}
void MaintenanceStaff::rescue(Elevator& elevator) {
    std::cout << "\n  [Maintenance: " << name << "] Rescuing passengers from Elevator #" << elevator.getId() << "...\n";
    elevator.setStatus("Maintenance"); elevator.openDoor();
    std::cout << "  [Maintenance] Passengers evacuated safely.\n";
    elevator.closeDoor(); elevator.setStatus("Available");
    std::cout << "  [Maintenance] Elevator #" << elevator.getId() << " restored to Available.\n";
}
