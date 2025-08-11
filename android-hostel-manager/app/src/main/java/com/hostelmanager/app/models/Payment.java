package com.hostelmanager.app.models;

import com.google.gson.annotations.SerializedName;

public class Payment {
    @SerializedName("id")
    private String id;
    
    @SerializedName("student_id")
    private String studentId;
    
    @SerializedName("student_name")
    private String studentName;
    
    @SerializedName("amount")
    private double amount;
    
    @SerializedName("month")
    private String month;
    
    @SerializedName("year")
    private String year;
    
    @SerializedName("payment_type")
    private String paymentType; // "hostel_fee", "mess_fee", "security_deposit"
    
    @SerializedName("status")
    private String status; // "pending", "paid", "overdue"
    
    @SerializedName("due_date")
    private String dueDate;
    
    @SerializedName("paid_date")
    private String paidDate;

    // Constructors
    public Payment() {}

    public Payment(String studentId, double amount, String month, String year, String paymentType, String dueDate) {
        this.studentId = studentId;
        this.amount = amount;
        this.month = month;
        this.year = year;
        this.paymentType = paymentType;
        this.dueDate = dueDate;
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

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getPaidDate() {
        return paidDate;
    }

    public void setPaidDate(String paidDate) {
        this.paidDate = paidDate;
    }

    public boolean isPaid() {
        return "paid".equals(status);
    }

    public boolean isPending() {
        return "pending".equals(status);
    }

    public boolean isOverdue() {
        return "overdue".equals(status);
    }

    public String getFormattedAmount() {
        return "₹" + String.format("%.0f", amount);
    }
}
