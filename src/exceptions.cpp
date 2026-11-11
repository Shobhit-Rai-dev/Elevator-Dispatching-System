#include "exceptions.hpp"
BaseException::BaseException(std::string msg) : message(std::move(msg)) {}
std::string BaseException::getMessage() const { return message; }
FloorException::FloorException(std::string msg) : BaseException(std::move(msg)) {}
FinallyBlock::~FinallyBlock() { std::cout << "Finally block equivalent executed.\n"; }

