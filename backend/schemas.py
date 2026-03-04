from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List, Optional

class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int
    total_present: Optional[int] = 0
    total_absent: Optional[int] = 0

    class Config:
        from_attributes = True

class AttendanceBase(BaseModel):
    employee_id: str
    date: date
    status: str

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int

    class Config:
        from_attributes = True

class DashboardSummary(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
