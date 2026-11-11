#pragma once
#include "direction.hpp"
#include <iostream>
class ElevatorRequest {
    int sourceFloor;
    int destinationFloor;
    Direction desiredDir;
    std::string status;
public:
    ElevatorRequest(int src, int dest);
    int getSourceFloor() const;
    int getDestinationFloor() const;
    Direction getDesiredDirection() const;
    void setStatus(std::string newStatus);
    bool operator==(const ElevatorRequest& other) const;
    friend std::ostream& operator<<(std::ostream& output, const ElevatorRequest& request);
    friend void showRequestSummary(const ElevatorRequest& request);
};
void showRequestSummary(const ElevatorRequest& request);
