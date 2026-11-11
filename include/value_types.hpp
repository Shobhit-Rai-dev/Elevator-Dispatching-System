#pragma once
#include <iostream>
#include <string>
class CapacityValue {
    int kg;
public:
    explicit CapacityValue(int value);
    operator int() const;
    void display() const;
};
class FloorValue {
    int floorNumber;
public:
    explicit FloorValue(int floor);
    int getFloorNumber() const;
};
class ElevatorFloorValue {
    int floorNumber;
public:
    ElevatorFloorValue(const FloorValue& source);
    void display() const;
};
template <typename T>
void displayTemplateValue(const std::string& label, const T& value) {
    std::cout << label << value << std::endl;
}
template <typename T>
class TemplateBox {
    T value;
public:
    explicit TemplateBox(const T& input) : value(input) {}
    void display(const std::string& label) const {
        std::cout << label << value << std::endl;
    }
};
