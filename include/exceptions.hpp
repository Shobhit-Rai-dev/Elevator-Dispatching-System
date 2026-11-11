#pragma once
#include <iostream>
#include <string>
class BaseException {
    std::string message;
public:
    explicit BaseException(std::string msg);
    virtual std::string getMessage() const;
    virtual ~BaseException() = default;
};
class FloorException : public BaseException {
public:
    explicit FloorException(std::string msg);
};
// C++ has no finally keyword; this destructor provides finally-like cleanup.
class FinallyBlock {
public:
    ~FinallyBlock();
};
