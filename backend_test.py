#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Hostel Management System
Tests all API endpoints with realistic hostel data
"""

import requests
import json
import sys
from datetime import datetime, timedelta

# Backend URL from environment
BACKEND_URL = "https://02771881-43f4-4949-b76f-8546df5d2e55.preview.emergentagent.com/api"

class HostelTestSuite:
    def __init__(self):
        self.admin_token = None
        self.student_token = None
        self.admin_user = None
        self.student_user = None
        self.test_room = None
        self.test_complaint = None
        self.test_payment = None
        self.test_menu = None
        self.results = {
            "authentication": {"passed": 0, "failed": 0, "errors": []},
            "room_management": {"passed": 0, "failed": 0, "errors": []},
            "complaint_system": {"passed": 0, "failed": 0, "errors": []},
            "payment_system": {"passed": 0, "failed": 0, "errors": []},
            "mess_menu": {"passed": 0, "failed": 0, "errors": []},
            "student_management": {"passed": 0, "failed": 0, "errors": []}
        }

    def log_result(self, category, test_name, success, error_msg=None):
        """Log test results"""
        if success:
            self.results[category]["passed"] += 1
            print(f"✅ {test_name}")
        else:
            self.results[category]["failed"] += 1
            self.results[category]["errors"].append(f"{test_name}: {error_msg}")
            print(f"❌ {test_name}: {error_msg}")

    def test_authentication_system(self):
        """Test user registration and login for both roles"""
        print("\n🔐 Testing Authentication System...")
        
        # Test admin registration
        admin_data = {
            "email": "admin@hostel.edu",
            "password": "AdminPass123!",
            "name": "Dr. Sarah Wilson",
            "role": "admin",
            "phone": "+1-555-0101"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/register", json=admin_data)
            if response.status_code == 200:
                data = response.json()
                self.admin_token = data["token"]
                self.admin_user = data["user"]
                self.log_result("authentication", "Admin Registration", True)
            else:
                self.log_result("authentication", "Admin Registration", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_result("authentication", "Admin Registration", False, str(e))

        # Test student registration
        student_data = {
            "email": "john.doe@student.edu",
            "password": "StudentPass123!",
            "name": "John Doe",
            "role": "student",
            "phone": "+1-555-0201"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/register", json=student_data)
            if response.status_code == 200:
                data = response.json()
                self.student_token = data["token"]
                self.student_user = data["user"]
                self.log_result("authentication", "Student Registration", True)
            else:
                self.log_result("authentication", "Student Registration", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_result("authentication", "Student Registration", False, str(e))

        # Test admin login
        try:
            login_data = {"email": "admin@hostel.edu", "password": "AdminPass123!"}
            response = requests.post(f"{BACKEND_URL}/login", json=login_data)
            if response.status_code == 200:
                self.log_result("authentication", "Admin Login", True)
            else:
                self.log_result("authentication", "Admin Login", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("authentication", "Admin Login", False, str(e))

        # Test student login
        try:
            login_data = {"email": "john.doe@student.edu", "password": "StudentPass123!"}
            response = requests.post(f"{BACKEND_URL}/login", json=login_data)
            if response.status_code == 200:
                self.log_result("authentication", "Student Login", True)
            else:
                self.log_result("authentication", "Student Login", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("authentication", "Student Login", False, str(e))

        # Test invalid credentials
        try:
            login_data = {"email": "admin@hostel.edu", "password": "wrongpassword"}
            response = requests.post(f"{BACKEND_URL}/login", json=login_data)
            if response.status_code == 401:
                self.log_result("authentication", "Invalid Credentials Rejection", True)
            else:
                self.log_result("authentication", "Invalid Credentials Rejection", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_result("authentication", "Invalid Credentials Rejection", False, str(e))

    def test_room_management_system(self):
        """Test room CRUD operations and assignments"""
        print("\n🏠 Testing Room Management System...")
        
        if not self.admin_token:
            self.log_result("room_management", "Room Management Tests", False, "No admin token available")
            return

        headers = {"Authorization": f"Bearer {self.admin_token}"}

        # Test room creation
        room_data = {
            "room_number": "A101",
            "capacity": 2,
            "room_type": "double",
            "floor": "1st Floor"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/rooms", json=room_data, headers=headers)
            if response.status_code == 200:
                self.test_room = room_data
                self.log_result("room_management", "Room Creation", True)
            else:
                self.log_result("room_management", "Room Creation", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_result("room_management", "Room Creation", False, str(e))

        # Test room listing
        try:
            response = requests.get(f"{BACKEND_URL}/rooms", headers=headers)
            if response.status_code == 200:
                rooms = response.json()
                if isinstance(rooms, list):
                    self.log_result("room_management", "Room Listing", True)
                else:
                    self.log_result("room_management", "Room Listing", False, "Response is not a list")
            else:
                self.log_result("room_management", "Room Listing", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("room_management", "Room Listing", False, str(e))

        # Test room assignment
        if self.student_user and self.test_room:
            try:
                response = requests.put(
                    f"{BACKEND_URL}/rooms/{room_data['room_number']}/assign/{self.student_user['id']}", 
                    headers=headers
                )
                if response.status_code == 200:
                    self.log_result("room_management", "Room Assignment", True)
                else:
                    self.log_result("room_management", "Room Assignment", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result("room_management", "Room Assignment", False, str(e))

        # Test student room view
        if self.student_token:
            student_headers = {"Authorization": f"Bearer {self.student_token}"}
            try:
                response = requests.get(f"{BACKEND_URL}/my-room", headers=student_headers)
                if response.status_code == 200:
                    self.log_result("room_management", "Student Room View", True)
                else:
                    self.log_result("room_management", "Student Room View", False, f"Status: {response.status_code}")
            except Exception as e:
                self.log_result("room_management", "Student Room View", False, str(e))

        # Test unauthorized room creation (student trying to create room)
        if self.student_token:
            student_headers = {"Authorization": f"Bearer {self.student_token}"}
            try:
                response = requests.post(f"{BACKEND_URL}/rooms", json=room_data, headers=student_headers)
                if response.status_code == 403:
                    self.log_result("room_management", "Unauthorized Room Creation Block", True)
                else:
                    self.log_result("room_management", "Unauthorized Room Creation Block", False, f"Expected 403, got {response.status_code}")
            except Exception as e:
                self.log_result("room_management", "Unauthorized Room Creation Block", False, str(e))

    def test_complaint_system(self):
        """Test complaint submission and management"""
        print("\n📝 Testing Complaint Management System...")
        
        if not self.student_token or not self.admin_token:
            self.log_result("complaint_system", "Complaint System Tests", False, "Missing required tokens")
            return

        student_headers = {"Authorization": f"Bearer {self.student_token}"}
        admin_headers = {"Authorization": f"Bearer {self.admin_token}"}

        # Test complaint submission by student
        complaint_data = {
            "title": "Air Conditioning Not Working",
            "description": "The AC unit in room A101 has been making loud noises and not cooling properly for the past 3 days.",
            "category": "maintenance"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/complaints", json=complaint_data, headers=student_headers)
            if response.status_code == 200:
                self.log_result("complaint_system", "Student Complaint Submission", True)
            else:
                self.log_result("complaint_system", "Student Complaint Submission", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_result("complaint_system", "Student Complaint Submission", False, str(e))

        # Test student viewing their complaints
        try:
            response = requests.get(f"{BACKEND_URL}/complaints", headers=student_headers)
            if response.status_code == 200:
                complaints = response.json()
                if isinstance(complaints, list):
                    self.log_result("complaint_system", "Student Complaint Viewing", True)
                    if complaints:
                        self.test_complaint = complaints[0]
                else:
                    self.log_result("complaint_system", "Student Complaint Viewing", False, "Response is not a list")
            else:
                self.log_result("complaint_system", "Student Complaint Viewing", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("complaint_system", "Student Complaint Viewing", False, str(e))

        # Test admin viewing all complaints
        try:
            response = requests.get(f"{BACKEND_URL}/complaints", headers=admin_headers)
            if response.status_code == 200:
                complaints = response.json()
                if isinstance(complaints, list):
                    self.log_result("complaint_system", "Admin Complaint Viewing", True)
                else:
                    self.log_result("complaint_system", "Admin Complaint Viewing", False, "Response is not a list")
            else:
                self.log_result("complaint_system", "Admin Complaint Viewing", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("complaint_system", "Admin Complaint Viewing", False, str(e))

        # Test admin updating complaint status
        if self.test_complaint:
            try:
                response = requests.put(
                    f"{BACKEND_URL}/complaints/{self.test_complaint['id']}/status?status=in_progress", 
                    headers=admin_headers
                )
                if response.status_code == 200:
                    self.log_result("complaint_system", "Admin Complaint Status Update", True)
                else:
                    self.log_result("complaint_system", "Admin Complaint Status Update", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result("complaint_system", "Admin Complaint Status Update", False, str(e))

        # Test unauthorized complaint status update (student trying to update)
        if self.test_complaint:
            try:
                response = requests.put(
                    f"{BACKEND_URL}/complaints/{self.test_complaint['id']}/status?status=resolved", 
                    headers=student_headers
                )
                if response.status_code == 403:
                    self.log_result("complaint_system", "Unauthorized Status Update Block", True)
                else:
                    self.log_result("complaint_system", "Unauthorized Status Update Block", False, f"Expected 403, got {response.status_code}")
            except Exception as e:
                self.log_result("complaint_system", "Unauthorized Status Update Block", False, str(e))

    def test_payment_system(self):
        """Test payment record creation and tracking"""
        print("\n💰 Testing Payment Tracking System...")
        
        if not self.admin_token or not self.student_token or not self.student_user:
            self.log_result("payment_system", "Payment System Tests", False, "Missing required tokens or user data")
            return

        admin_headers = {"Authorization": f"Bearer {self.admin_token}"}
        student_headers = {"Authorization": f"Bearer {self.student_token}"}

        # Test payment record creation by admin
        payment_data = {
            "student_id": self.student_user["id"],
            "amount": 1200.00,
            "month": "January",
            "year": "2024",
            "payment_type": "hostel_fee",
            "due_date": "2024-01-31"
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/payments", json=payment_data, headers=admin_headers)
            if response.status_code == 200:
                self.log_result("payment_system", "Admin Payment Record Creation", True)
            else:
                self.log_result("payment_system", "Admin Payment Record Creation", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_result("payment_system", "Admin Payment Record Creation", False, str(e))

        # Test student viewing their payments
        try:
            response = requests.get(f"{BACKEND_URL}/payments", headers=student_headers)
            if response.status_code == 200:
                payments = response.json()
                if isinstance(payments, list):
                    self.log_result("payment_system", "Student Payment Viewing", True)
                    if payments:
                        self.test_payment = payments[0]
                else:
                    self.log_result("payment_system", "Student Payment Viewing", False, "Response is not a list")
            else:
                self.log_result("payment_system", "Student Payment Viewing", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("payment_system", "Student Payment Viewing", False, str(e))

        # Test admin viewing all payments
        try:
            response = requests.get(f"{BACKEND_URL}/payments", headers=admin_headers)
            if response.status_code == 200:
                payments = response.json()
                if isinstance(payments, list):
                    self.log_result("payment_system", "Admin Payment Viewing", True)
                else:
                    self.log_result("payment_system", "Admin Payment Viewing", False, "Response is not a list")
            else:
                self.log_result("payment_system", "Admin Payment Viewing", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("payment_system", "Admin Payment Viewing", False, str(e))

        # Test admin marking payment as paid
        if self.test_payment:
            try:
                response = requests.put(
                    f"{BACKEND_URL}/payments/{self.test_payment['id']}/mark-paid", 
                    headers=admin_headers
                )
                if response.status_code == 200:
                    self.log_result("payment_system", "Admin Mark Payment Paid", True)
                else:
                    self.log_result("payment_system", "Admin Mark Payment Paid", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result("payment_system", "Admin Mark Payment Paid", False, str(e))

        # Test unauthorized payment creation (student trying to create payment)
        try:
            response = requests.post(f"{BACKEND_URL}/payments", json=payment_data, headers=student_headers)
            if response.status_code == 403:
                self.log_result("payment_system", "Unauthorized Payment Creation Block", True)
            else:
                self.log_result("payment_system", "Unauthorized Payment Creation Block", False, f"Expected 403, got {response.status_code}")
        except Exception as e:
            self.log_result("payment_system", "Unauthorized Payment Creation Block", False, str(e))

    def test_mess_menu_management(self):
        """Test mess menu CRUD operations"""
        print("\n🍽️ Testing Mess Menu Management...")
        
        if not self.admin_token or not self.student_token:
            self.log_result("mess_menu", "Mess Menu Tests", False, "Missing required tokens")
            return

        admin_headers = {"Authorization": f"Bearer {self.admin_token}"}
        student_headers = {"Authorization": f"Bearer {self.student_token}"}

        # Test menu creation by admin
        menu_data = {
            "day": "monday",
            "meal_type": "breakfast",
            "items": ["Scrambled Eggs", "Toast", "Orange Juice", "Fresh Fruit", "Coffee"]
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/mess-menu", json=menu_data, headers=admin_headers)
            if response.status_code == 200:
                self.log_result("mess_menu", "Admin Menu Creation", True)
            else:
                self.log_result("mess_menu", "Admin Menu Creation", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_result("mess_menu", "Admin Menu Creation", False, str(e))

        # Test menu viewing by student
        try:
            response = requests.get(f"{BACKEND_URL}/mess-menu", headers=student_headers)
            if response.status_code == 200:
                menu = response.json()
                if isinstance(menu, list):
                    self.log_result("mess_menu", "Student Menu Viewing", True)
                    if menu:
                        self.test_menu = menu[0]
                else:
                    self.log_result("mess_menu", "Student Menu Viewing", False, "Response is not a list")
            else:
                self.log_result("mess_menu", "Student Menu Viewing", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("mess_menu", "Student Menu Viewing", False, str(e))

        # Test menu viewing by admin
        try:
            response = requests.get(f"{BACKEND_URL}/mess-menu", headers=admin_headers)
            if response.status_code == 200:
                menu = response.json()
                if isinstance(menu, list):
                    self.log_result("mess_menu", "Admin Menu Viewing", True)
                else:
                    self.log_result("mess_menu", "Admin Menu Viewing", False, "Response is not a list")
            else:
                self.log_result("mess_menu", "Admin Menu Viewing", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("mess_menu", "Admin Menu Viewing", False, str(e))

        # Test menu update (creating same day/meal type should update)
        updated_menu_data = {
            "day": "monday",
            "meal_type": "breakfast",
            "items": ["Pancakes", "Maple Syrup", "Orange Juice", "Fresh Berries", "Coffee"]
        }
        
        try:
            response = requests.post(f"{BACKEND_URL}/mess-menu", json=updated_menu_data, headers=admin_headers)
            if response.status_code == 200:
                self.log_result("mess_menu", "Admin Menu Update", True)
            else:
                self.log_result("mess_menu", "Admin Menu Update", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_result("mess_menu", "Admin Menu Update", False, str(e))

        # Test menu deletion
        if self.test_menu:
            try:
                response = requests.delete(f"{BACKEND_URL}/mess-menu/{self.test_menu['id']}", headers=admin_headers)
                if response.status_code == 200:
                    self.log_result("mess_menu", "Admin Menu Deletion", True)
                else:
                    self.log_result("mess_menu", "Admin Menu Deletion", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result("mess_menu", "Admin Menu Deletion", False, str(e))

        # Test unauthorized menu creation (student trying to create menu)
        try:
            response = requests.post(f"{BACKEND_URL}/mess-menu", json=menu_data, headers=student_headers)
            if response.status_code == 403:
                self.log_result("mess_menu", "Unauthorized Menu Creation Block", True)
            else:
                self.log_result("mess_menu", "Unauthorized Menu Creation Block", False, f"Expected 403, got {response.status_code}")
        except Exception as e:
            self.log_result("mess_menu", "Unauthorized Menu Creation Block", False, str(e))

    def test_student_management(self):
        """Test student listing and management"""
        print("\n👥 Testing Student Management...")
        
        if not self.admin_token or not self.student_token:
            self.log_result("student_management", "Student Management Tests", False, "Missing required tokens")
            return

        admin_headers = {"Authorization": f"Bearer {self.admin_token}"}
        student_headers = {"Authorization": f"Bearer {self.student_token}"}

        # Test admin viewing all students
        try:
            response = requests.get(f"{BACKEND_URL}/students", headers=admin_headers)
            if response.status_code == 200:
                students = response.json()
                if isinstance(students, list):
                    self.log_result("student_management", "Admin Student Listing", True)
                else:
                    self.log_result("student_management", "Admin Student Listing", False, "Response is not a list")
            else:
                self.log_result("student_management", "Admin Student Listing", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("student_management", "Admin Student Listing", False, str(e))

        # Test unauthorized student listing (student trying to view all students)
        try:
            response = requests.get(f"{BACKEND_URL}/students", headers=student_headers)
            if response.status_code == 403:
                self.log_result("student_management", "Unauthorized Student Listing Block", True)
            else:
                self.log_result("student_management", "Unauthorized Student Listing Block", False, f"Expected 403, got {response.status_code}")
        except Exception as e:
            self.log_result("student_management", "Unauthorized Student Listing Block", False, str(e))

        # Create a test student for deletion
        test_student_data = {
            "email": "test.student@hostel.edu",
            "password": "TestPass123!",
            "name": "Test Student",
            "role": "student",
            "phone": "+1-555-0999"
        }
        
        test_student_id = None
        try:
            response = requests.post(f"{BACKEND_URL}/register", json=test_student_data)
            if response.status_code == 200:
                test_student_id = response.json()["user"]["id"]
                self.log_result("student_management", "Test Student Creation for Deletion", True)
            else:
                self.log_result("student_management", "Test Student Creation for Deletion", False, f"Status: {response.status_code}")
        except Exception as e:
            self.log_result("student_management", "Test Student Creation for Deletion", False, str(e))

        # Test student deletion by admin
        if test_student_id:
            try:
                response = requests.delete(f"{BACKEND_URL}/students/{test_student_id}", headers=admin_headers)
                if response.status_code == 200:
                    self.log_result("student_management", "Admin Student Deletion", True)
                else:
                    self.log_result("student_management", "Admin Student Deletion", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_result("student_management", "Admin Student Deletion", False, str(e))

        # Test unauthorized student deletion (student trying to delete another student)
        if self.student_user:
            try:
                response = requests.delete(f"{BACKEND_URL}/students/{self.student_user['id']}", headers=student_headers)
                if response.status_code == 403:
                    self.log_result("student_management", "Unauthorized Student Deletion Block", True)
                else:
                    self.log_result("student_management", "Unauthorized Student Deletion Block", False, f"Expected 403, got {response.status_code}")
            except Exception as e:
                self.log_result("student_management", "Unauthorized Student Deletion Block", False, str(e))

    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Hostel Management System Backend Tests...")
        print(f"🌐 Testing against: {BACKEND_URL}")
        
        self.test_authentication_system()
        self.test_room_management_system()
        self.test_complaint_system()
        self.test_payment_system()
        self.test_mess_menu_management()
        self.test_student_management()
        
        self.print_summary()

    def print_summary(self):
        """Print test results summary"""
        print("\n" + "="*60)
        print("📊 TEST RESULTS SUMMARY")
        print("="*60)
        
        total_passed = 0
        total_failed = 0
        
        for category, results in self.results.items():
            passed = results["passed"]
            failed = results["failed"]
            total_passed += passed
            total_failed += failed
            
            status = "✅ PASS" if failed == 0 else "❌ FAIL"
            print(f"{category.replace('_', ' ').title()}: {passed} passed, {failed} failed {status}")
            
            if results["errors"]:
                for error in results["errors"]:
                    print(f"  ⚠️  {error}")
        
        print("-" * 60)
        print(f"TOTAL: {total_passed} passed, {total_failed} failed")
        
        if total_failed == 0:
            print("🎉 ALL TESTS PASSED! Backend is working correctly.")
        else:
            print(f"⚠️  {total_failed} tests failed. Please review the errors above.")
        
        return total_failed == 0

if __name__ == "__main__":
    test_suite = HostelTestSuite()
    success = test_suite.run_all_tests()
    sys.exit(0 if success else 1)