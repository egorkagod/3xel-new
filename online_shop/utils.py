from enum import Enum

class EnumWithDescriptions(str, Enum):
    def __new__(cls, value, description):
        obj = str.__new__(cls, value)
        obj._value_ = value
        obj.description = description
        return obj
    
    @classmethod
    def choices(cls):
        return [(item.value, item.description) for item in cls]