package com.hostelmanager.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.hostelmanager.app.R;
import com.hostelmanager.app.api.ApiClient;
import com.hostelmanager.app.models.User;
import com.hostelmanager.app.utils.SharedPrefsManager;
import com.hostelmanager.app.fragments.RoomFragment;
import com.hostelmanager.app.fragments.ComplaintsFragment;
import com.hostelmanager.app.fragments.PaymentsFragment;
import com.hostelmanager.app.fragments.RenewalFragment;
import com.hostelmanager.app.fragments.MessMenuFragment;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

public class StudentDashboardActivity extends AppCompatActivity {
    
    private TextView tvWelcome;
    private Button btnLogout;
    private Button btnTabRoom, btnTabComplaints, btnTabPayments, btnTabRenewal, btnTabMessMenu;
    private View loadingView;
    
    private SharedPrefsManager sharedPrefsManager;
    private User currentUser;
    private String currentTab = "room";

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
        loadFragment("room");
    }
    
    private void initViews() {
        tvWelcome = findViewById(R.id.tvWelcome);
        btnLogout = findViewById(R.id.btnLogout);
        
        btnTabRoom = findViewById(R.id.btnTabRoom);
        btnTabComplaints = findViewById(R.id.btnTabComplaints);
        btnTabPayments = findViewById(R.id.btnTabPayments);
        btnTabRenewal = findViewById(R.id.btnTabRenewal);
        btnTabMessMenu = findViewById(R.id.btnTabMessMenu);
        
        loadingView = findViewById(R.id.loadingView);
    }
    
    private void setupListeners() {
        btnLogout.setOnClickListener(v -> logout());
        
        btnTabRoom.setOnClickListener(v -> switchTab("room", btnTabRoom));
        btnTabComplaints.setOnClickListener(v -> switchTab("complaints", btnTabComplaints));
        btnTabPayments.setOnClickListener(v -> switchTab("payments", btnTabPayments));
        btnTabRenewal.setOnClickListener(v -> switchTab("renewal", btnTabRenewal));
        btnTabMessMenu.setOnClickListener(v -> switchTab("mess", btnTabMessMenu));
    }
    
    private void updateWelcomeMessage() {
        String welcomeText = getString(R.string.welcome, currentUser.getName());
        tvWelcome.setText(welcomeText);
    }
    
    private void switchTab(String tab, Button selectedButton) {
        if (currentTab.equals(tab)) {
            return;
        }
        
        currentTab = tab;
        updateTabUI(selectedButton);
        loadFragment(tab);
    }
    
    private void updateTabUI(Button selectedButton) {
        // Reset all tabs
        resetTabButton(btnTabRoom);
        resetTabButton(btnTabComplaints);
        resetTabButton(btnTabPayments);
        resetTabButton(btnTabRenewal);
        resetTabButton(btnTabMessMenu);
        
        // Highlight selected tab
        selectedButton.setBackgroundResource(R.drawable.tab_selected);
        selectedButton.setTextColor(getResources().getColor(R.color.primary_blue, null));
    }
    
    private void resetTabButton(Button button) {
        button.setBackgroundResource(R.drawable.tab_unselected);
        button.setTextColor(getResources().getColor(R.color.text_secondary, null));
    }
    
    private void loadFragment(String tab) {
        Fragment fragment;
        
        switch (tab) {
            case "room":
                fragment = new RoomFragment();
                break;
            case "complaints":
                fragment = new ComplaintsFragment();
                break;
            case "payments":
                fragment = new PaymentsFragment();
                break;
            case "renewal":
                fragment = new RenewalFragment();
                break;
            case "mess":
                fragment = new MessMenuFragment();
                break;
            default:
                fragment = new RoomFragment();
        }
        
        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction transaction = fragmentManager.beginTransaction();
        transaction.replace(R.id.contentContainer, fragment);
        transaction.commit();
    }
    
    private void showLoading(boolean show) {
        loadingView.setVisibility(show ? View.VISIBLE : View.GONE);
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
