package com.hostelmanager.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.hostelmanager.app.R;
import com.hostelmanager.app.models.User;
import com.hostelmanager.app.utils.SharedPrefsManager;

public class StudentDashboardActivity extends AppCompatActivity {
    
    private TextView tvWelcome;
    private Button btnLogout;
    private SharedPrefsManager sharedPrefsManager;
    private User currentUser;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_student_dashboard);
        
        sharedPrefsManager = new SharedPrefsManager(this);
        currentUser = sharedPrefsManager.getUser();
        
        if (currentUser == null) {
            logout();
            return;
        }
        
        initViews();
        setupListeners();
        updateWelcomeMessage();
    }
    
    private void initViews() {
        tvWelcome = findViewById(R.id.tvWelcome);
        btnLogout = findViewById(R.id.btnLogout);
    }
    
    private void setupListeners() {
        btnLogout.setOnClickListener(v -> logout());
    }
    
    private void updateWelcomeMessage() {
        String welcomeText = getString(R.string.welcome, currentUser.getName());
        tvWelcome.setText(welcomeText);
        
        Toast.makeText(this, "Welcome to GPW Hostel Manager!\nDemo mode with full features available.", 
                      Toast.LENGTH_LONG).show();
    }
    
    private void logout() {
        sharedPrefsManager.clearUserData();
        Intent intent = new Intent(this, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
    
    @Override
    public void onBackPressed() {
        // Don't allow back navigation to login screen
        moveTaskToBack(true);
    }
}
