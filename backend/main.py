from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

import crud, models, schemas
from database import SessionLocal, engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to HRMS Lite API"}

# Employee Endpoints
@app.post("/employees", response_model=schemas.Employee, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = crud.get_employee_by_id(db, employee_id=employee.employee_id)
    if db_employee:
        raise HTTPException(status_code=400, detail="Employee ID already registered")
    
    email_exists = crud.get_employee_by_email(db, email=employee.email)
    if email_exists:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    return crud.create_employee(db=db, employee=employee)

@app.get("/employees", response_model=List[schemas.Employee])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    employees = crud.get_employees(db, skip=skip, limit=limit)
    return employees

@app.delete("/employees/{employee_id}", response_model=schemas.Employee)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    db_employee = crud.delete_employee(db, employee_id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

# Attendance Endpoints
@app.post("/attendance", response_model=schemas.Attendance, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    # Check if employee exists
    db_employee = crud.get_employee_by_id(db, employee_id=attendance.employee_id)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee ID not found")
    
    # Check if attendance already marked for this day
    existing = db.query(models.Attendance).filter(
        models.Attendance.employee_id == attendance.employee_id,
        models.Attendance.date == attendance.date
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")

    return crud.mark_attendance(db=db, attendance=attendance)

@app.get("/attendance/{employee_id}", response_model=List[schemas.Attendance])
def read_attendance(employee_id: str, db: Session = Depends(get_db)):
    return crud.get_attendance_by_employee(db, employee_id=employee_id)

# Dashboard Endpoint
from datetime import date as date_type

@app.get("/dashboard/summary", response_model=schemas.DashboardSummary)
def read_dashboard_summary(date: Optional[date_type] = None, db: Session = Depends(get_db)):
    return crud.get_dashboard_summary(db, target_date=date)
