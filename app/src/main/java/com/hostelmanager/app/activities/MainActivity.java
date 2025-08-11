package com.hostelmanager.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import com.hostelmanager.app.R;
import com.hostelmanager.app.models.User;
import com.hostelmanager.app.utils.Constants;
import com.hostelmanager.app.utils.MockDataProvider;
import com.hostelmanager.app.utils.SharedPrefsManager;

public class MainActivity extends AppCompatActivity {
    
    private Button btnLogin, btnRegister, btnSubmit;
    private TextInputEditText etEmail, etPassword, etName, etPhone;
    private TextInputLayout nameInputLayout, phoneInputLayout, roleInputLayout;
    private Spinner spinnerRole;
    private TextView errorMessage, connectionStatusText;
    private ProgressBar progressBar;
    private View statusIndicator;
    
    private boolean isLoginMode = true;
    private SharedPrefsManager sharedPrefsManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        sharedPrefsManager = new SharedPrefsManager(this);
        
        // Check if user is already logged in
        if (sharedPrefsManager.isLoggedIn()) {
            navigateToDashboard();
            return;
        }
        
        initViews();
        setupListeners();
        setupRoleSpinner();
        checkConnectionStatus();
    }
    
    private void initViews() {
        btnLogin = findViewById(R.id.btnLogin);
        btnRegister = findViewById(R.id.btnRegister);
        btnSubmit = findViewById(R.id.btnSubmit);
        
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        etName = findViewById(R.id.etName);
        etPhone = findViewById(R.id.etPhone);
        
        nameInputLayout = findViewById(R.id.nameInputLayout);
        phoneInputLayout = findViewById(R.id.phoneInputLayout);
        roleInputLayout = findViewById(R.id.roleInputLayout);
        
        spinnerRole = findViewById(R.id.spinnerRole);
        errorMessage = findViewById(R.id.errorMessage);
        connectionStatusText = findViewById(R.id.connectionStatusText);
        progressBar = findViewById(R.id.progressBar);
        statusIndicator = findViewById(R.id.statusIndicator);
    }
    
    private void setupListeners() {
        btnLogin.setOnClickListener(v -> switchToLogin());
        btnRegister.setOnClickListener(v -> switchToRegister());
        btnSubmit.setOnClickListener(v -> handleSubmit());
    }
    
    private void setupRoleSpinner() {
        String[] roles = {getString(R.string.student), getString(R.string.admin)};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, roles);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerRole.setAdapter(adapter);
    }
    
    private void checkConnectionStatus() {
        // Demo mode - always show connected
        connectionStatusText.setText(getString(R.string.demo_mode));
        statusIndicator.setBackgroundResource(android.R.color.holo_orange_light);
    }
    
    private void switchToLogin() {
        isLoginMode = true;
        updateUI();
    }
    
    private void switchToRegister() {
        isLoginMode = false;
        updateUI();
    }
    
    private void updateUI() {
        if (isLoginMode) {
            nameInputLayout.setVisibility(View.GONE);
            phoneInputLayout.setVisibility(View.GONE);
            roleInputLayout.setVisibility(View.GONE);
            
            btnSubmit.setText(getString(R.string.login));
        } else {
            nameInputLayout.setVisibility(View.VISIBLE);
            phoneInputLayout.setVisibility(View.VISIBLE);
            roleInputLayout.setVisibility(View.VISIBLE);
            
            btnSubmit.setText(getString(R.string.create_account));
        }
        hideError();
    }
    
    private void handleSubmit() {
        if (!validateFields()) {
            return;
        }
        
        showLoading(true);
        
        // Simulate network call with demo mode
        String email = etEmail.getText().toString().trim();
        String role = spinnerRole.getSelectedItemPosition() == 0 ? Constants.ROLE_STUDENT : Constants.ROLE_ADMIN;
        
        handleDemoMode(email, role);
    }
    
    private boolean validateFields() {
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString().trim();
        
        if (email.isEmpty() || password.isEmpty()) {
            showError(getString(R.string.error_required_fields));
            return false;
        }
        
        if (!isLoginMode) {
            String name = etName.getText().toString().trim();
            if (name.isEmpty()) {
                showError(getString(R.string.error_required_fields));
                return false;
            }
        }
        
        return true;
    }
    
    private void handleDemoMode(String email, String role) {
        // Create mock user for demo
        User mockUser = MockDataProvider.getMockUser(role);
        mockUser.setEmail(email);
        
        if (!isLoginMode) {
            String name = etName.getText().toString().trim();
            String phone = etPhone.getText().toString().trim();
            mockUser.setName(name.isEmpty() ? "Demo User" : name);
            mockUser.setPhone(phone.isEmpty() ? "123-456-7890" : phone);
        }
        
        String mockToken = "demo-token-" + System.currentTimeMillis();
        sharedPrefsManager.saveUserLogin(mockUser, mockToken);
        
        showLoading(false);
        Toast.makeText(this, "Demo mode activated", Toast.LENGTH_SHORT).show();
        navigateToDashboard();
    }
    
    private void navigateToDashboard() {
        User user = sharedPrefsManager.getUser();
        Intent intent;
        
        if (user != null && user.isAdmin()) {
            intent = new Intent(this, AdminDashboardActivity.class);
        } else {
            intent = new Intent(this, StudentDashboardActivity.class);
        }
        
        startActivity(intent);
        finish();
    }
    
    private void showLoading(boolean show) {
        progressBar.setVisibility(show ? View.VISIBLE : View.GONE);
        btnSubmit.setEnabled(!show);
        
        if (show) {
            btnSubmit.setText(getString(R.string.please_wait));
        } else {
            btnSubmit.setText(isLoginMode ? getString(R.string.login) : getString(R.string.create_account));
        }
    }
    
    private void showError(String message) {
        errorMessage.setText(message);
        errorMessage.setVisibility(View.VISIBLE);
    }
    
    private void hideError() {
        errorMessage.setVisibility(View.GONE);
    }
}
