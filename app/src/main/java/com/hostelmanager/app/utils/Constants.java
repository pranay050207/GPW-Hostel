package com.hostelmanager.app.utils;

public class Constants {
    // API Base URL - Update this to your backend URL
    public static final String BASE_URL = "https://your-backend-url.com/";
    
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
    
    // Network Timeouts
    public static final int CONNECT_TIMEOUT = 30; // seconds
    public static final int READ_TIMEOUT = 30; // seconds
    public static final int WRITE_TIMEOUT = 30; // seconds
}
