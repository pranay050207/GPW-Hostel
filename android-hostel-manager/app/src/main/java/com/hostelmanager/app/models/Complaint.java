package com.hostelmanager.app.models;

import com.google.gson.annotations.SerializedName;

public class Complaint {
    @SerializedName("id")
    private String id;
    
    @SerializedName("student_id")
    private String studentId;
    
    @SerializedName("student_name")
    private String studentName;
    
    @SerializedName("room_number")
    private String roomNumber;
    
    @SerializedName("title")
    private String title;
    
    @SerializedName("description")
    private String description;
    
    @SerializedName("category")
    private String category; // "maintenance", "cleanliness", "electrical", "plumbing", "other"
    
    @SerializedName("status")
    private String status; // "pending", "in_progress", "resolved"
    
    @SerializedName("created_at")
    private String createdAt;
    
    @SerializedName("resolved_at")
    private String resolvedAt;

    // Constructors
    public Complaint() {}

    public Complaint(String title, String description, String category) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.status = "pending";
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(String resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public boolean isPending() {
        return "pending".equals(status);
    }

    public boolean isInProgress() {
        return "in_progress".equals(status);
    }

    public boolean isResolved() {
        return "resolved".equals(status);
    }
}
