package com.hostelmanager.app.models;

import com.google.gson.annotations.SerializedName;
import java.util.Map;

public class RenewalForm {
    @SerializedName("id")
    private String id;
    
    @SerializedName("student_id")
    private String studentId;
    
    @SerializedName("student_name")
    private String studentName;
    
    @SerializedName("room_number")
    private String roomNumber;
    
    @SerializedName("status")
    private String status; // "submitted", "under_review", "approved", "rejected"
    
    @SerializedName("files")
    private Map<String, String> files; // {"aadhar": "filename", "result": "filename", etc.}
    
    @SerializedName("admin_comments")
    private String adminComments;
    
    @SerializedName("created_at")
    private String createdAt;
    
    @SerializedName("updated_at")
    private String updatedAt;
    
    @SerializedName("reviewed_at")
    private String reviewedAt;
    
    @SerializedName("reviewed_by")
    private String reviewedBy;

    // Constructors
    public RenewalForm() {}

    public RenewalForm(String studentId, String studentName, String roomNumber) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.roomNumber = roomNumber;
        this.status = "submitted";
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Map<String, String> getFiles() {
        return files;
    }

    public void setFiles(Map<String, String> files) {
        this.files = files;
    }

    public String getAdminComments() {
        return adminComments;
    }

    public void setAdminComments(String adminComments) {
        this.adminComments = adminComments;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(String reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    // Status check methods
    public boolean isSubmitted() {
        return "submitted".equals(status);
    }

    public boolean isUnderReview() {
        return "under_review".equals(status);
    }

    public boolean isApproved() {
        return "approved".equals(status);
    }

    public boolean isRejected() {
        return "rejected".equals(status);
    }

    public String getFormattedStatus() {
        if (status == null) return "";
        return status.replace("_", " ").toUpperCase();
    }
}
