package com.hostelmanager.app.utils;

import android.content.Context;
import android.content.SharedPreferences;
import com.google.gson.Gson;
import com.hostelmanager.app.models.User;

public class SharedPrefsManager {
    private static final String PREFS_NAME = "hostel_manager_prefs";
    private static final String KEY_USER = "user";
    private static final String KEY_TOKEN = "token";
    private static final String KEY_IS_LOGGED_IN = "is_logged_in";
    
    private SharedPreferences sharedPreferences;
    private SharedPreferences.Editor editor;
    private Gson gson;

    public SharedPrefsManager(Context context) {
        sharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        editor = sharedPreferences.edit();
        gson = new Gson();
    }

    // Save user login data
    public void saveUserLogin(User user, String token) {
        String userJson = gson.toJson(user);
        editor.putString(KEY_USER, userJson);
        editor.putString(KEY_TOKEN, token);
        editor.putBoolean(KEY_IS_LOGGED_IN, true);
        editor.apply();
    }

    // Get current user
    public User getUser() {
        String userJson = sharedPreferences.getString(KEY_USER, null);
        if (userJson != null) {
            return gson.fromJson(userJson, User.class);
        }
        return null;
    }

    // Get auth token
    public String getToken() {
        return sharedPreferences.getString(KEY_TOKEN, null);
    }

    // Check if user is logged in
    public boolean isLoggedIn() {
        return sharedPreferences.getBoolean(KEY_IS_LOGGED_IN, false);
    }

    // Clear user data (logout)
    public void clearUserData() {
        editor.clear();
        editor.apply();
    }

    // Update user data
    public void updateUser(User user) {
        String userJson = gson.toJson(user);
        editor.putString(KEY_USER, userJson);
        editor.apply();
    }

    // Check if user is admin
    public boolean isAdmin() {
        User user = getUser();
        return user != null && user.isAdmin();
    }

    // Check if user is student
    public boolean isStudent() {
        User user = getUser();
        return user != null && user.isStudent();
    }
}
