package com.hostelmanager.app.utils;

import com.hostelmanager.app.models.User;

public class MockDataProvider {
    
    public static User getMockUser(String role) {
        User user = new User();
        user.setId("demo-user-" + System.currentTimeMillis());
        user.setEmail("demo@gpwhostel.com");
        user.setName("Demo User");
        user.setRole(role);
        user.setPhone("123-456-7890");
        if (Constants.ROLE_STUDENT.equals(role)) {
            user.setRoomNumber("A101");
        }
        return user;
    }
}
