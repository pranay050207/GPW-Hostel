package com.hostelmanager.app.models;

import com.google.gson.annotations.SerializedName;

public class User {
    @SerializedName("id")
    private String id;
    
    @SerializedName("email")
    private String email;
    
    @SerializedName("name")
    private String name;
    
    @SerializedName("role")
    private String role; // "student" or "admin"
    
    @SerializedName("room_number")
    private String roomNumber;
    
    @SerializedName("phone")
    private String phone;

    // Constructors
    public User() {}

    public User(String id, String email, String name, String role, String roomNumber, String phone) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.roomNumber = roomNumber;
        this.phone = phone;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isAdmin() {
        return "admin".equals(role);
    }

    public boolean isStudent() {
        return "student".equals(role);
    }
}
