#pragma once
#include "elevator.hpp"
class EmergencyElevator : public Elevator {
    std::string code;
public:
    EmergencyElevator(int idNum, int floor, int cap, std::string siren = "EMG-911");
    void triggerEmergencyMode();
    void display() const override;
};
