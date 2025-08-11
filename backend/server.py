from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import jwt
import bcrypt
from datetime import datetime, timedelta
import os
from pymongo import MongoClient
import uuid
import aiofiles
import shutil

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
UPLOAD_DIR = "/app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount static files for file access
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Database connection
MONGO_URL = os.environ.get('MONGO_URL')
client = MongoClient(MONGO_URL)
db = client.hostel_management

# JWT configuration
SECRET_KEY = "hostel_secret_key_2024"
security = HTTPBearer()

# Pydantic models
class User(BaseModel):
    id: str
    email: str
    name: str
    role: str  # "student" or "admin"
    room_number: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    role: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class Room(BaseModel):
    room_number: str
    capacity: int
    occupied: int
    students: List[str] = []
    room_type: str  # "single", "double", "triple", "quad"
    floor: str
    status: str = "available"  # "available", "full", "maintenance"

class RoomCreate(BaseModel):
    room_number: str
    capacity: int
    room_type: str
    floor: str

class Complaint(BaseModel):
    id: str
    student_id: str
    student_name: str
    room_number: str
    title: str
    description: str
    category: str  # "maintenance", "cleanliness", "electrical", "plumbing", "other"
    status: str = "pending"  # "pending", "in_progress", "resolved"
    created_at: str
    resolved_at: Optional[str] = None

class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str

class Payment(BaseModel):
    id: str
    student_id: str
    student_name: str
    amount: float
    month: str
    year: str
    payment_type: str  # "hostel_fee", "mess_fee", "security_deposit"
    status: str = "pending"  # "pending", "paid", "overdue"
    due_date: str
    paid_date: Optional[str] = None

class PaymentCreate(BaseModel):
    student_id: str
    amount: float
    month: str
    year: str
    payment_type: str
    due_date: str

class MessMenu(BaseModel):
    id: str
    day: str  # "monday", "tuesday", etc.
    meal_type: str  # "breakfast", "lunch", "dinner"
    items: List[str]
    created_at: str

class MessMenuCreate(BaseModel):
    day: str
    meal_type: str
    items: List[str]

class RenewalForm(BaseModel):
    id: str
    student_id: str
    student_name: str
    room_number: str
    status: str = "submitted"  # "submitted", "under_review", "approved", "rejected"
    files: dict = {}  # {"aadhar": "filename", "result": "filename", "caste_cert": "filename", "photo": "filename"}
    admin_comments: Optional[str] = None
    created_at: str
    updated_at: str
    reviewed_at: Optional[str] = None
    reviewed_by: Optional[str] = None

class RenewalFormCreate(BaseModel):
    files: dict = {}

class RenewalFormUpdate(BaseModel):
    status: Optional[str] = None
    admin_comments: Optional[str] = None

# JWT utility functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email = payload.get("email")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# Authentication endpoints
@app.post("/api/register")
async def register(user: UserCreate):
    # Check if user exists
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    
    # Create user document
    user_doc = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "password": hashed_password,
        "name": user.name,
        "role": user.role,
        "phone": user.phone,
        "room_number": None,
        "created_at": datetime.now().isoformat()
    }
    
    db.users.insert_one(user_doc)
    
    # Create access token
    token = create_access_token({"email": user.email, "role": user.role})
    
    return {
        "message": "User registered successfully",
        "token": token,
        "user": {
            "id": user_doc["id"],
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "phone": user.phone,
            "room_number": user_doc["room_number"]
        }
    }

@app.post("/api/login")
async def login(credentials: UserLogin):
    user = db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Check password
    if not bcrypt.checkpw(credentials.password.encode('utf-8'), user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    token = create_access_token({"email": user["email"], "role": user["role"]})
    
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "phone": user.get("phone"),
            "room_number": user.get("room_number")
        }
    }

# Room management endpoints
@app.get("/api/rooms")
async def get_rooms(current_user: dict = Depends(verify_token)):
    rooms = list(db.rooms.find({}, {"_id": 0}))
    return rooms

@app.post("/api/rooms")
async def create_room(room: RoomCreate, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create rooms")
    
    # Check if room exists
    if db.rooms.find_one({"room_number": room.room_number}):
        raise HTTPException(status_code=400, detail="Room already exists")
    
    room_doc = {
        "room_number": room.room_number,
        "capacity": room.capacity,
        "occupied": 0,
        "students": [],
        "room_type": room.room_type,
        "floor": room.floor,
        "status": "available",
        "created_at": datetime.now().isoformat()
    }
    
    db.rooms.insert_one(room_doc)
    return {"message": "Room created successfully"}

@app.put("/api/rooms/{room_number}/assign/{student_id}")
async def assign_room(room_number: str, student_id: str, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can assign rooms")
    
    room = db.rooms.find_one({"room_number": room_number})
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    student = db.users.find_one({"id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if room["occupied"] >= room["capacity"]:
        raise HTTPException(status_code=400, detail="Room is full")
    
    # Update room
    db.rooms.update_one(
        {"room_number": room_number},
        {
            "$push": {"students": student_id},
            "$inc": {"occupied": 1},
            "$set": {"status": "full" if room["occupied"] + 1 >= room["capacity"] else "available"}
        }
    )
    
    # Update student
    db.users.update_one(
        {"id": student_id},
        {"$set": {"room_number": room_number}}
    )
    
    return {"message": "Room assigned successfully"}

@app.get("/api/my-room")
async def get_my_room(current_user: dict = Depends(verify_token)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can view their room")
    
    user = db.users.find_one({"email": current_user["email"]})
    if not user["room_number"]:
        return {"message": "No room assigned", "room": None}
    
    room = db.rooms.find_one({"room_number": user["room_number"]}, {"_id": 0})
    
    # Get roommate details
    roommates = []
    for student_id in room["students"]:
        if student_id != user["id"]:
            roommate = db.users.find_one({"id": student_id}, {"_id": 0, "password": 0})
            if roommate:
                roommates.append({
                    "name": roommate["name"],
                    "email": roommate["email"],
                    "phone": roommate.get("phone")
                })
    
    room["roommates"] = roommates
    return {"room": room}

# Complaint management endpoints
@app.get("/api/complaints")
async def get_complaints(current_user: dict = Depends(verify_token)):
    if current_user["role"] == "student":
        user = db.users.find_one({"email": current_user["email"]})
        complaints = list(db.complaints.find({"student_id": user["id"]}, {"_id": 0}))
    else:
        complaints = list(db.complaints.find({}, {"_id": 0}))
    
    return complaints

@app.post("/api/complaints")
async def create_complaint(complaint: ComplaintCreate, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can create complaints")
    
    user = db.users.find_one({"email": current_user["email"]})
    if not user["room_number"]:
        raise HTTPException(status_code=400, detail="You must be assigned to a room to create complaints")
    
    complaint_doc = {
        "id": str(uuid.uuid4()),
        "student_id": user["id"],
        "student_name": user["name"],
        "room_number": user["room_number"],
        "title": complaint.title,
        "description": complaint.description,
        "category": complaint.category,
        "status": "pending",
        "created_at": datetime.now().isoformat(),
        "resolved_at": None
    }
    
    db.complaints.insert_one(complaint_doc)
    return {"message": "Complaint submitted successfully"}

@app.put("/api/complaints/{complaint_id}/status")
async def update_complaint_status(complaint_id: str, status: str, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can update complaint status")
    
    update_data = {"status": status}
    if status == "resolved":
        update_data["resolved_at"] = datetime.now().isoformat()
    
    result = db.complaints.update_one({"id": complaint_id}, {"$set": update_data})
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    return {"message": "Complaint status updated successfully"}

# Payment management endpoints
@app.get("/api/payments")
async def get_payments(current_user: dict = Depends(verify_token)):
    if current_user["role"] == "student":
        user = db.users.find_one({"email": current_user["email"]})
        payments = list(db.payments.find({"student_id": user["id"]}, {"_id": 0}))
    else:
        payments = list(db.payments.find({}, {"_id": 0}))
    
    return payments

@app.post("/api/payments")
async def create_payment(payment: PaymentCreate, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create payment records")
    
    student = db.users.find_one({"id": payment.student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    payment_doc = {
        "id": str(uuid.uuid4()),
        "student_id": payment.student_id,
        "student_name": student["name"],
        "amount": payment.amount,
        "month": payment.month,
        "year": payment.year,
        "payment_type": payment.payment_type,
        "status": "pending",
        "due_date": payment.due_date,
        "paid_date": None,
        "created_at": datetime.now().isoformat()
    }
    
    db.payments.insert_one(payment_doc)
    return {"message": "Payment record created successfully"}

@app.put("/api/payments/{payment_id}/mark-paid")
async def mark_payment_paid(payment_id: str, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can mark payments as paid")
    
    result = db.payments.update_one(
        {"id": payment_id},
        {
            "$set": {
                "status": "paid",
                "paid_date": datetime.now().isoformat()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    return {"message": "Payment marked as paid successfully"}

# Mess menu endpoints
@app.get("/api/mess-menu")
async def get_mess_menu(current_user: dict = Depends(verify_token)):
    menu = list(db.mess_menu.find({}, {"_id": 0}))
    return menu

@app.post("/api/mess-menu")
async def create_mess_menu(menu: MessMenuCreate, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can manage mess menu")
    
    # Check if menu for this day and meal type already exists
    existing = db.mess_menu.find_one({"day": menu.day, "meal_type": menu.meal_type})
    if existing:
        # Update existing
        db.mess_menu.update_one(
            {"day": menu.day, "meal_type": menu.meal_type},
            {"$set": {"items": menu.items, "updated_at": datetime.now().isoformat()}}
        )
        return {"message": "Menu updated successfully"}
    else:
        # Create new
        menu_doc = {
            "id": str(uuid.uuid4()),
            "day": menu.day,
            "meal_type": menu.meal_type,
            "items": menu.items,
            "created_at": datetime.now().isoformat()
        }
        db.mess_menu.insert_one(menu_doc)
        return {"message": "Menu created successfully"}

@app.delete("/api/mess-menu/{menu_id}")
async def delete_mess_menu(menu_id: str, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can manage mess menu")
    
    result = db.mess_menu.delete_one({"id": menu_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Menu not found")
    
    return {"message": "Menu deleted successfully"}

# Student management endpoints
@app.get("/api/students")
async def get_students(current_user: dict = Depends(verify_token)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can view all students")
    
    students = list(db.users.find({"role": "student"}, {"_id": 0, "password": 0}))
    return students

@app.delete("/api/students/{student_id}")
async def delete_student(student_id: str, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete students")
    
    student = db.users.find_one({"id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Remove from room if assigned
    if student.get("room_number"):
        db.rooms.update_one(
            {"room_number": student["room_number"]},
            {
                "$pull": {"students": student_id},
                "$inc": {"occupied": -1},
                "$set": {"status": "available"}
            }
        )
    
    # Delete student
    db.users.delete_one({"id": student_id})
    
    return {"message": "Student deleted successfully"}

# File upload endpoints
@app.post("/api/upload-file")
async def upload_file(
    file: UploadFile = File(...),
    file_type: str = Form(...),  # "aadhar", "result", "caste_cert", "photo"
    current_user: dict = Depends(verify_token)
):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can upload files")
    
    # Validate file type
    if file_type not in ["aadhar", "result", "caste_cert", "photo"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    # Validate file size (max 5MB per file)
    if file.size > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size too large (max 5MB)")
    
    # Validate file extension
    allowed_extensions = [".jpg", ".jpeg", ".png", ".pdf"]
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid file format. Only JPG, PNG, and PDF files are allowed")
    
    # Get current user info
    user = db.users.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create user-specific directory
    user_upload_dir = os.path.join(UPLOAD_DIR, user["id"])
    os.makedirs(user_upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_id = str(uuid.uuid4())
    filename = f"{file_type}_{file_id}{file_extension}"
    file_path = os.path.join(user_upload_dir, filename)
    
    try:
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        return {
            "message": "File uploaded successfully",
            "file_id": file_id,
            "filename": filename,
            "file_type": file_type,
            "file_path": f"/uploads/{user['id']}/{filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@app.get("/api/download-file/{user_id}/{filename}")
async def download_file(user_id: str, filename: str, current_user: dict = Depends(verify_token)):
    # Admin can access all files, students can only access their own files
    if current_user["role"] == "student":
        user = db.users.find_one({"email": current_user["email"]})
        if not user or user["id"] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    file_path = os.path.join(UPLOAD_DIR, user_id, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(file_path)

# Renewal form endpoints
@app.get("/api/renewal-forms")
async def get_renewal_forms(current_user: dict = Depends(verify_token)):
    if current_user["role"] == "student":
        user = db.users.find_one({"email": current_user["email"]})
        renewal_forms = list(db.renewal_forms.find({"student_id": user["id"]}, {"_id": 0}))
    else:
        renewal_forms = list(db.renewal_forms.find({}, {"_id": 0}))
    
    return renewal_forms

@app.post("/api/renewal-forms")
async def create_renewal_form(renewal_form: RenewalFormCreate, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can create renewal forms")
    
    user = db.users.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.get("room_number"):
        raise HTTPException(status_code=400, detail="You must be assigned to a room to submit a renewal form")
    
    # Check if student already has a pending renewal form
    existing_form = db.renewal_forms.find_one({
        "student_id": user["id"],
        "status": {"$in": ["submitted", "under_review"]}
    })
    
    if existing_form:
        raise HTTPException(status_code=400, detail="You already have a pending renewal form")
    
    renewal_form_doc = {
        "id": str(uuid.uuid4()),
        "student_id": user["id"],
        "student_name": user["name"],
        "room_number": user["room_number"],
        "status": "submitted",
        "files": renewal_form.files,
        "admin_comments": None,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "reviewed_at": None,
        "reviewed_by": None
    }
    
    db.renewal_forms.insert_one(renewal_form_doc)
    return {"message": "Renewal form submitted successfully"}

@app.get("/api/renewal-forms/{form_id}")
async def get_renewal_form(form_id: str, current_user: dict = Depends(verify_token)):
    renewal_form = db.renewal_forms.find_one({"id": form_id}, {"_id": 0})
    if not renewal_form:
        raise HTTPException(status_code=404, detail="Renewal form not found")
    
    # Students can only access their own forms, admins can access all
    if current_user["role"] == "student":
        user = db.users.find_one({"email": current_user["email"]})
        if renewal_form["student_id"] != user["id"]:
            raise HTTPException(status_code=403, detail="Access denied")
    
    return renewal_form

@app.put("/api/renewal-forms/{form_id}")
async def update_renewal_form(form_id: str, update_data: RenewalFormUpdate, current_user: dict = Depends(verify_token)):
    renewal_form = db.renewal_forms.find_one({"id": form_id})
    if not renewal_form:
        raise HTTPException(status_code=404, detail="Renewal form not found")
    
    if current_user["role"] == "student":
        # Students can only update their own forms and only if not approved/rejected
        user = db.users.find_one({"email": current_user["email"]})
        if renewal_form["student_id"] != user["id"]:
            raise HTTPException(status_code=403, detail="Access denied")
        
        if renewal_form["status"] in ["approved", "rejected"]:
            raise HTTPException(status_code=400, detail="Cannot update approved or rejected renewal forms")
        
        # Students can only update files, not status or admin_comments
        if update_data.status or update_data.admin_comments:
            raise HTTPException(status_code=403, detail="Students cannot update status or admin comments")
        
        # For students, we'll handle file updates through a separate endpoint
        raise HTTPException(status_code=400, detail="Use file upload endpoints to update files")
        
    else:
        # Admins can update status and comments
        update_fields = {"updated_at": datetime.now().isoformat()}
        
        if update_data.status:
            update_fields["status"] = update_data.status
            if update_data.status in ["approved", "rejected"]:
                update_fields["reviewed_at"] = datetime.now().isoformat()
                update_fields["reviewed_by"] = current_user["email"]
        
        if update_data.admin_comments is not None:
            update_fields["admin_comments"] = update_data.admin_comments
        
        db.renewal_forms.update_one(
            {"id": form_id},
            {"$set": update_fields}
        )
        
        return {"message": "Renewal form updated successfully"}

@app.put("/api/renewal-forms/{form_id}/files")
async def update_renewal_form_files(form_id: str, files: dict, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can update files")
    
    renewal_form = db.renewal_forms.find_one({"id": form_id})
    if not renewal_form:
        raise HTTPException(status_code=404, detail="Renewal form not found")
    
    user = db.users.find_one({"email": current_user["email"]})
    if renewal_form["student_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if renewal_form["status"] in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Cannot update approved or rejected renewal forms")
    
    # Update files and reset status to submitted if it was under_review
    update_fields = {
        "files": {**renewal_form.get("files", {}), **files},
        "updated_at": datetime.now().isoformat()
    }
    
    if renewal_form["status"] == "under_review":
        update_fields["status"] = "submitted"
    
    db.renewal_forms.update_one(
        {"id": form_id},
        {"$set": update_fields}
    )
    
    return {"message": "Renewal form files updated successfully"}

@app.delete("/api/renewal-forms/{form_id}")
async def delete_renewal_form(form_id: str, current_user: dict = Depends(verify_token)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete renewal forms")
    
    renewal_form = db.renewal_forms.find_one({"id": form_id})
    if not renewal_form:
        raise HTTPException(status_code=404, detail="Renewal form not found")
    
    # Delete associated files
    try:
        user_upload_dir = os.path.join(UPLOAD_DIR, renewal_form["student_id"])
        for file_type, filename in renewal_form.get("files", {}).items():
            file_path = os.path.join(user_upload_dir, filename)
            if os.path.exists(file_path):
                os.remove(file_path)
    except Exception as e:
        print(f"Error deleting files: {e}")
    
    result = db.renewal_forms.delete_one({"id": form_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Renewal form not found")
    
    return {"message": "Renewal form deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)