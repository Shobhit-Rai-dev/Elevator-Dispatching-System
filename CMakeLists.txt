cmake_minimum_required(VERSION 3.16)
project(LiftSync_Modular LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
find_package(Threads REQUIRED)
add_executable(liftsync
    src/main.cpp src/direction.cpp src/exceptions.cpp src/value_types.cpp
    src/elevator.cpp src/emergency_elevator.cpp src/elevator_request.cpp
    src/maintenance_staff.cpp src/elevator_dispatch_system.cpp)
target_include_directories(liftsync PRIVATE include)
target_link_libraries(liftsync PRIVATE Threads::Threads)
