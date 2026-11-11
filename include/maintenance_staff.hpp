#pragma once
#include "elevator.hpp"
#include <string>
class MaintenanceStaff {
    std::string name;
public:
    explicit MaintenanceStaff(std::string staffName);
    void rescue(Elevator& elevator);
};
