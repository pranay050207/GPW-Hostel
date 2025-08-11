package com.hostelmanager.app.models;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class MessMenu {
    @SerializedName("id")
    private String id;
    
    @SerializedName("day")
    private String day; // "monday", "tuesday", etc.
    
    @SerializedName("meal_type")
    private String mealType; // "breakfast", "lunch", "dinner"
    
    @SerializedName("items")
    private List<String> items;
    
    @SerializedName("created_at")
    private String createdAt;

    // Constructors
    public MessMenu() {}

    public MessMenu(String day, String mealType, List<String> items) {
        this.day = day;
        this.mealType = mealType;
        this.items = items;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getMealType() {
        return mealType;
    }

    public void setMealType(String mealType) {
        this.mealType = mealType;
    }

    public List<String> getItems() {
        return items;
    }

    public void setItems(List<String> items) {
        this.items = items;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getFormattedMealType() {
        if (mealType == null) return "";
        return mealType.substring(0, 1).toUpperCase() + mealType.substring(1);
    }

    public String getFormattedDay() {
        if (day == null) return "";
        return day.substring(0, 1).toUpperCase() + day.substring(1);
    }
}
