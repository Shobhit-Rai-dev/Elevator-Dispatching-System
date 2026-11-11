#include "elevator_request.hpp"
#include <utility>
ElevatorRequest::ElevatorRequest(int src, int dest)
    : sourceFloor(src), destinationFloor(dest), desiredDir(dest >= src ? UP : DOWN), status("Waiting") {}
int ElevatorRequest::getSourceFloor() const { return sourceFloor; }
int ElevatorRequest::getDestinationFloor() const { return destinationFloor; }
Direction ElevatorRequest::getDesiredDirection() const { return desiredDir; }
void ElevatorRequest::setStatus(std::string newStatus) { status = std::move(newStatus); }
bool ElevatorRequest::operator==(const ElevatorRequest& other) const {
    return sourceFloor == other.sourceFloor && destinationFloor == other.destinationFloor;
}
std::ostream& operator<<(std::ostream& output, const ElevatorRequest& request) {
    output << "[Request: F" << request.sourceFloor << " -> F" << request.destinationFloor << " (" << dirName(request.desiredDir) << ") | " << request.status << "]";
    return output;
}
void showRequestSummary(const ElevatorRequest& request) {
    std::cout << "  (Friend Function) Request: F" << request.sourceFloor << " -> F" << request.destinationFloor << "\n";
}
