package com.hostelmanager.app.models;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class Room {
    @SerializedName("room_number")
    private String roomNumber;
    
    @SerializedName("capacity")
    private int capacity;
    
    @SerializedName("occupied")
    private int occupied;
    
    @SerializedName("students")
    private List<String> students;
    
    @SerializedName("room_type")
    private String roomType; // "single", "double", "triple", "quad"
    
    @SerializedName("floor")
    private String floor;
    
    @SerializedName("status")
    private String status; // "available", "full", "maintenance"
    
    @SerializedName("roommates")
    private List<User> roommates;

    // Constructors
    public Room() {}

    public Room(String roomNumber, int capacity, int occupied, String roomType, String floor, String status) {
        this.roomNumber = roomNumber;
        this.capacity = capacity;
        this.occupied = occupied;
        this.roomType = roomType;
        this.floor = floor;
        this.status = status;
    }

    // Getters and Setters
    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public int getOccupied() {
        return occupied;
    }

    public void setOccupied(int occupied) {
        this.occupied = occupied;
    }

    public List<String> getStudents() {
        return students;
    }

    public void setStudents(List<String> students) {
        this.students = students;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<User> getRoommates() {
        return roommates;
    }

    public void setRoommates(List<User> roommates) {
        this.roommates = roommates;
    }

    public boolean isAvailable() {
        return "available".equals(status);
    }

    public boolean isFull() {
        return "full".equals(status) || occupied >= capacity;
    }

    public boolean isUnderMaintenance() {
        return "maintenance".equals(status);
    }
}
