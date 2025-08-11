package com.hostelmanager.app.utils;

public class Constants {
    // API Base URL - Update this to your backend URL
    public static final String BASE_URL = "https://51057cfa-c9a2-4e25-b131-f97d76613868.preview.emergentagent.com/";
    
    // API Endpoints
    public static final String ENDPOINT_LOGIN = "api/login";
    public static final String ENDPOINT_REGISTER = "api/register";
    public static final String ENDPOINT_ROOMS = "api/rooms";
    public static final String ENDPOINT_MY_ROOM = "api/my-room";
    public static final String ENDPOINT_STUDENTS = "api/students";
    public static final String ENDPOINT_COMPLAINTS = "api/complaints";
    public static final String ENDPOINT_PAYMENTS = "api/payments";
    public static final String ENDPOINT_MESS_MENU = "api/mess-menu";
    public static final String ENDPOINT_RENEWAL_FORMS = "api/renewal-forms";
    public static final String ENDPOINT_UPLOAD_FILE = "api/upload-file";
    
    // User Roles
    public static final String ROLE_ADMIN = "admin";
    public static final String ROLE_STUDENT = "student";
    
    // Room Status
    public static final String ROOM_STATUS_AVAILABLE = "available";
    public static final String ROOM_STATUS_FULL = "full";
    public static final String ROOM_STATUS_MAINTENANCE = "maintenance";
    
    // Complaint Status
    public static final String COMPLAINT_STATUS_PENDING = "pending";
    public static final String COMPLAINT_STATUS_IN_PROGRESS = "in_progress";
    public static final String COMPLAINT_STATUS_RESOLVED = "resolved";
    
    // Payment Status
    public static final String PAYMENT_STATUS_PENDING = "pending";
    public static final String PAYMENT_STATUS_PAID = "paid";
    public static final String PAYMENT_STATUS_OVERDUE = "overdue";
    
    // Complaint Categories
    public static final String COMPLAINT_CATEGORY_MAINTENANCE = "maintenance";
    public static final String COMPLAINT_CATEGORY_CLEANLINESS = "cleanliness";
    public static final String COMPLAINT_CATEGORY_ELECTRICAL = "electrical";
    public static final String COMPLAINT_CATEGORY_PLUMBING = "plumbing";
    public static final String COMPLAINT_CATEGORY_OTHER = "other";
    
    // Payment Types
    public static final String PAYMENT_TYPE_HOSTEL_FEE = "hostel_fee";
    public static final String PAYMENT_TYPE_MESS_FEE = "mess_fee";
    public static final String PAYMENT_TYPE_SECURITY_DEPOSIT = "security_deposit";
    
    // Room Types
    public static final String ROOM_TYPE_SINGLE = "single";
    public static final String ROOM_TYPE_DOUBLE = "double";
    public static final String ROOM_TYPE_TRIPLE = "triple";
    public static final String ROOM_TYPE_QUAD = "quad";
    
    // File Upload Types
    public static final String FILE_TYPE_AADHAR = "aadhar";
    public static final String FILE_TYPE_RESULT = "result";
    public static final String FILE_TYPE_CASTE_CERT = "caste_cert";
    public static final String FILE_TYPE_PHOTO = "photo";
    
    // Request Codes
    public static final int REQUEST_CODE_PICK_IMAGE = 1001;
    public static final int REQUEST_CODE_CAMERA = 1002;
    public static final int REQUEST_CODE_PICK_FILE = 1003;
    
    // Intent Keys
    public static final String INTENT_KEY_USER_ROLE = "user_role";
    public static final String INTENT_KEY_COMPLAINT_ID = "complaint_id";
    public static final String INTENT_KEY_PAYMENT_ID = "payment_id";
    public static final String INTENT_KEY_ROOM_NUMBER = "room_number";
    
    // Default Values
    public static final int MAX_FILE_SIZE_MB = 5;
    public static final String[] ALLOWED_FILE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf"};
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";
    
    // Network Timeouts
    public static final int CONNECT_TIMEOUT = 30; // seconds
    public static final int READ_TIMEOUT = 30; // seconds
    public static final int WRITE_TIMEOUT = 30; // seconds
}
