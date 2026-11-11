#include "value_types.hpp"
CapacityValue::CapacityValue(int value) : kg(value) {}
CapacityValue::operator int() const { return kg; }
void CapacityValue::display() const { std::cout << kg << " kg"; }
FloorValue::FloorValue(int floor) : floorNumber(floor) {}
int FloorValue::getFloorNumber() const { return floorNumber; }
ElevatorFloorValue::ElevatorFloorValue(const FloorValue& source) : floorNumber(source.getFloorNumber()) {}
void ElevatorFloorValue::display() const { std::cout << "Floor " << floorNumber; }
