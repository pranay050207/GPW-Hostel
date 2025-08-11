package com.hostelmanager.app.utils;

import com.hostelmanager.app.models.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MockDataProvider {
    
    public static User getMockUser(String role) {
        User user = new User();
        user.setId("demo-user-" + System.currentTimeMillis());
        user.setEmail("demo@hostel.com");
        user.setName("Demo User");
        user.setRole(role);
        user.setPhone("123-456-7890");
        if (Constants.ROLE_STUDENT.equals(role)) {
            user.setRoomNumber("A101");
        }
        return user;
    }
    
    public static Room getMockRoom() {
        Room room = new Room();
        room.setRoomNumber("A101");
        room.setCapacity(2);
        room.setOccupied(1);
        room.setRoomType("double");
        room.setFloor("1");
        room.setStatus("available");
        
        List<User> roommates = new ArrayList<>();
        User roommate = new User();
        roommate.setName("John Doe");
        roommate.setEmail("john.doe@example.com");
        roommate.setPhone("123-456-7890");
        roommates.add(roommate);
        room.setRoommates(roommates);
        
        return room;
    }
    
    public static List<Room> getMockRooms() {
        List<Room> rooms = new ArrayList<>();
        
        Room room1 = new Room("A101", 2, 1, "double", "1", "available");
        Room room2 = new Room("A102", 2, 2, "double", "1", "full");
        Room room3 = new Room("B101", 1, 1, "single", "2", "available");
        Room room4 = new Room("B102", 4, 3, "quad", "2", "available");
        
        rooms.add(room1);
        rooms.add(room2);
        rooms.add(room3);
        rooms.add(room4);
        
        return rooms;
    }
    
    public static List<Complaint> getMockComplaints() {
        List<Complaint> complaints = new ArrayList<>();
        
        Complaint complaint1 = new Complaint("Broken AC", "Air conditioning unit not working properly", "maintenance");
        complaint1.setId("comp-1");
        complaint1.setStudentId("student-1");
        complaint1.setStudentName("Demo Student");
        complaint1.setRoomNumber("A101");
        complaint1.setStatus("pending");
        complaint1.setCreatedAt("2024-01-15T10:00:00");
        
        Complaint complaint2 = new Complaint("Water leakage", "Bathroom faucet is leaking", "plumbing");
        complaint2.setId("comp-2");
        complaint2.setStudentId("student-1");
        complaint2.setStudentName("Demo Student");
        complaint2.setRoomNumber("A101");
        complaint2.setStatus("in_progress");
        complaint2.setCreatedAt("2024-01-14T15:30:00");
        
        complaints.add(complaint1);
        complaints.add(complaint2);
        
        return complaints;
    }
    
    public static List<Payment> getMockPayments() {
        List<Payment> payments = new ArrayList<>();
        
        Payment payment1 = new Payment("student-1", 5000.0, "January", "2024", "hostel_fee", "2024-01-15");
        payment1.setId("pay-1");
        payment1.setStudentName("Demo Student");
        payment1.setStatus("paid");
        payment1.setPaidDate("2024-01-10");
        
        Payment payment2 = new Payment("student-1", 3000.0, "February", "2024", "mess_fee", "2024-02-15");
        payment2.setId("pay-2");
        payment2.setStudentName("Demo Student");
        payment2.setStatus("pending");
        
        payments.add(payment1);
        payments.add(payment2);
        
        return payments;
    }
    
    public static List<MessMenu> getMockMessMenu() {
        List<MessMenu> menuList = new ArrayList<>();
        
        MessMenu menu1 = new MessMenu();
        menu1.setId("menu-1");
        menu1.setDay("monday");
        menu1.setMealType("breakfast");
        menu1.setItems(Arrays.asList("Bread", "Butter", "Tea", "Boiled Eggs"));
        menu1.setCreatedAt("2024-01-01T00:00:00");
        
        MessMenu menu2 = new MessMenu();
        menu2.setId("menu-2");
        menu2.setDay("monday");
        menu2.setMealType("lunch");
        menu2.setItems(Arrays.asList("Rice", "Dal", "Vegetables", "Roti"));
        menu2.setCreatedAt("2024-01-01T00:00:00");
        
        menuList.add(menu1);
        menuList.add(menu2);
        
        return menuList;
    }
    
    public static List<User> getMockStudents() {
        List<User> students = new ArrayList<>();
        
        User student1 = new User("student-1", "demo@student.com", "Demo Student", "student", "A101", "123-456-7890");
        User student2 = new User("student-2", "john@student.com", "John Smith", "student", "A102", "987-654-3210");
        User student3 = new User("student-3", "jane@student.com", "Jane Doe", "student", null, "555-123-4567");
        
        students.add(student1);
        students.add(student2);
        students.add(student3);
        
        return students;
    }
    
    public static List<RenewalForm> getMockRenewalForms() {
        List<RenewalForm> forms = new ArrayList<>();
        
        RenewalForm form1 = new RenewalForm();
        form1.setId("renewal-1");
        form1.setStudentId("student-1");
        form1.setStudentName("Demo Student");
        form1.setRoomNumber("A101");
        form1.setStatus("submitted");
        form1.setCreatedAt("2024-01-10T10:00:00");
        form1.setUpdatedAt("2024-01-10T10:00:00");
        
        forms.add(form1);
        
        return forms;
    }
}
