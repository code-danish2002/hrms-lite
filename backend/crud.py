from sqlalchemy.orm import Session
from datetime import date
import models, schemas

def get_employee_by_id(db: Session, employee_id: str):
    return db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()

def get_employee_by_email(db: Session, email: str):
    return db.query(models.Employee).filter(models.Employee.email == email).first()

def get_employees(db: Session, skip: int = 0, limit: int = 100):
    employees = db.query(models.Employee).offset(skip).limit(limit).all()
    for emp in employees:
        emp.total_present = db.query(models.Attendance).filter(
            models.Attendance.employee_id == emp.employee_id,
            models.Attendance.status == "Present"
        ).count()
        emp.total_absent = db.query(models.Attendance).filter(
            models.Attendance.employee_id == emp.employee_id,
            models.Attendance.status == "Absent"
        ).count()
    return employees

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_employee = models.Employee(
        employee_id=employee.employee_id,
        full_name=employee.full_name,
        email=employee.email,
        department=employee.department
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, employee_id: str):
    db_employee = db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()
    if db_employee:
        db.delete(db_employee)
        db.commit()
    return db_employee

def mark_attendance(db: Session, attendance: schemas.AttendanceCreate):
    db_attendance = models.Attendance(
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def get_attendance_by_employee(db: Session, employee_id: str):
    return db.query(models.Attendance).filter(models.Attendance.employee_id == employee_id).all()

def get_dashboard_summary(db: Session, target_date: date = None):
    if target_date is None:
        target_date = date.today()
        
    total_employees = db.query(models.Employee).count()
    present_today = db.query(models.Attendance).filter(models.Attendance.date == target_date, models.Attendance.status == "Present").count()
    absent_today = db.query(models.Attendance).filter(models.Attendance.date == target_date, models.Attendance.status == "Absent").count()
    
    return schemas.DashboardSummary(
        total_employees=total_employees,
        present_today=present_today,
        absent_today=absent_today
    )
