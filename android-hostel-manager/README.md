# Hostel Manager Android App

A comprehensive Android application for hostel/dormitory management, converted from the original React web application. Built with Java and XML, featuring role-based authentication, room management, complaints system, payment tracking, and more.

## 📱 Features

### Student Features
- **Authentication**: Login/Register with role selection
- **Room Information**: View assigned room details and roommate information
- **Complaints Management**: Submit and track maintenance requests
- **Payment Tracking**: View payment history and pending dues
- **Room Renewal**: Submit renewal applications with document uploads
- **Mess Menu**: Weekly meal schedules

### Admin Features
- **Dashboard Overview**: Complete hostel management interface
- **Room Management**: Create, assign, and manage room allocations
- **Student Management**: View and manage student profiles
- **Complaints Handling**: Review and update complaint status
- **Payment Management**: Create payment records and track payments
- **Renewal Processing**: Review student renewal applications
- **Mess Menu Management**: Create and update weekly menus

## 🏗️ Architecture

### Project Structure
```
app/
├── src/main/java/com/hostelmanager/app/
│   ├── activities/           # Main app activities
│   │   ├── MainActivity.java                 # Login/Register
│   │   ├── StudentDashboardActivity.java     # Student interface
│   │   ├── AdminDashboardActivity.java       # Admin interface
│   │   └── SplashActivity.java               # App startup
│   ├── fragments/            # UI fragments for different features
│   │   ├── RoomFragment.java
│   │   ├── ComplaintsFragment.java
│   │   ├── PaymentsFragment.java
│   │   ├── RenewalFragment.java
│   │   └── MessMenuFragment.java
│   ├── models/              # Data models
│   │   ├── User.java
│   │   ├── Room.java
│   │   ├── Complaint.java
│   │   ├── Payment.java
│   │   ├── MessMenu.java
│   │   └── RenewalForm.java
│   ├── api/                 # Network layer
│   │   ├── ApiInterface.java         # Retrofit API definitions
│   │   ├── ApiClient.java           # Retrofit client setup
│   │   ├── requests/                # API request models
│   │   └── responses/               # API response models
│   └── utils/               # Utility classes
│       ├── SharedPrefsManager.java   # Local storage
│       ├── Constants.java           # App constants
│       └── MockDataProvider.java    # Demo data
└── src/main/res/
    ├── layout/              # XML layouts
    ├── drawable/            # Graphics and styling
    ├── values/              # Colors, strings, styles
    └── xml/                 # Configuration files
```

### Key Technologies
- **Language**: Java
- **UI**: XML Layouts with Material Design
- **Networking**: Retrofit 2 + OkHttp
- **Architecture**: Fragment-based navigation
- **Local Storage**: SharedPreferences
- **Image Loading**: Glide
- **Design**: Material Design Components

## 🚀 Getting Started

### Prerequisites
- Android Studio Arctic Fox or later
- Android SDK (API level 24+)
- Java 8+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd android-hostel-manager
   ```

2. **Open in Android Studio**
   - Launch Android Studio
   - Select "Open an existing project"
   - Navigate to the project directory

3. **Configure Backend URL**
   - Edit `Constants.java`
   - Update `BASE_URL` with your backend server URL:
   ```java
   public static final String BASE_URL = "https://your-backend-url.com/";
   ```

4. **Build and Run**
   - Click "Sync Project with Gradle Files"
   - Select your target device/emulator
   - Click "Run" or press Ctrl+R

### Demo Mode
The app includes a comprehensive demo mode that activates when the backend is unavailable:
- Mock authentication with realistic user data
- Sample room, complaint, and payment data
- Full navigation and UI interaction
- Simulated file upload functionality

## 📋 API Integration

### Backend Compatibility
This Android app is designed to work with the FastAPI backend from the original web application. The API endpoints include:

- **Authentication**: `/api/login`, `/api/register`
- **Room Management**: `/api/rooms`, `/api/my-room`
- **Student Management**: `/api/students`
- **Complaints**: `/api/complaints`
- **Payments**: `/api/payments`
- **File Upload**: `/api/upload-file`
- **Renewal Forms**: `/api/renewal-forms`
- **Mess Menu**: `/api/mess-menu`

### Network Configuration
- Automatic retry logic for failed requests
- Comprehensive error handling
- Mock data fallback for offline/demo mode
- Configurable timeout settings

## 🎨 UI/UX Features

### Design Elements
- **Material Design**: Modern Android UI patterns
- **Gradient Backgrounds**: Beautiful blue-purple gradients
- **Card-based Layout**: Clean, organized information display
- **Tab Navigation**: Intuitive section switching
- **Status Indicators**: Visual feedback for connection and states
- **Responsive Design**: Optimized for various screen sizes

### User Experience
- **Role-based Navigation**: Different interfaces for students and admins
- **Real-time Updates**: Dynamic content loading
- **Form Validation**: Client-side input validation
- **Loading States**: Visual feedback during operations
- **Error Handling**: Graceful error messages and recovery

## 🔒 Security Features

- **Token-based Authentication**: JWT token management
- **Secure Storage**: Encrypted SharedPreferences
- **Input Validation**: Comprehensive form validation
- **Network Security**: HTTPS enforcement
- **Permission Management**: Minimal required permissions

## 📱 Device Requirements

- **Minimum SDK**: API 24 (Android 7.0)
- **Target SDK**: API 34 (Android 14)
- **Permissions**: Internet, Network State, File Access
- **Storage**: ~20MB app size
- **RAM**: 2GB+ recommended

## 🛠️ Development

### Building from Source
```bash
# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# Install on connected device
./gradlew installDebug
```

### Testing
- Unit tests for utility classes
- Integration tests for API calls
- UI tests for critical user flows

### Customization
The app is highly customizable:
- **Colors**: Edit `colors.xml`
- **Strings**: Modify `strings.xml` for localization
- **Layouts**: Customize XML layouts
- **API Endpoints**: Update `Constants.java`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Converted from the original React web application
- Material Design guidelines by Google
- Android development best practices
- Open source libraries and contributors

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the demo mode features

---

**Note**: This Android app maintains feature parity with the original React web application while providing a native mobile experience optimized for Android devices.
