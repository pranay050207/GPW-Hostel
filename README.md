# GPW Hostel Manager

A comprehensive Android application for hostel/dormitory management, featuring role-based authentication, room management, complaints system, payment tracking, and more. Built with Java and XML using modern Android development practices.

## 📱 Features

### 🎓 Student Features
- **Authentication**: Secure login/register with role selection
- **Room Information**: View assigned room details and roommate information
- **Complaints Management**: Submit and track maintenance requests
- **Payment Tracking**: View payment history and pending dues
- **Room Renewal**: Submit renewal applications with document uploads
- **Mess Menu**: View weekly meal schedules

### 👨‍💼 Admin Features
- **Dashboard Overview**: Complete hostel management interface
- **Room Management**: Create, assign, and manage room allocations
- **Student Management**: View and manage student profiles
- **Complaints Handling**: Review and update complaint status
- **Payment Management**: Create payment records and track payments
- **Renewal Processing**: Review student renewal applications
- **Mess Menu Management**: Create and update weekly menus

## 🏗️ Architecture

### Modern Android Stack
- **Language**: Java
- **UI Framework**: XML Layouts with Material Design Components
- **Networking**: Retrofit 2 + OkHttp
- **Architecture**: Fragment-based navigation with MVVM patterns
- **Local Storage**: SharedPreferences for user data
- **Image Loading**: Glide for efficient image handling

### Project Structure
```
app/
├── src/main/java/com/hostelmanager/app/
│   ├── activities/           # Main app activities
│   ├── fragments/            # UI fragments for different features
│   ├── models/              # Data models (User, Room, Complaint, etc.)
│   ├── api/                 # Network layer (Retrofit interfaces)
│   └���─ utils/               # Utility classes
└── src/main/res/
    ├── layout/              # XML layouts
    ├── drawable/            # Graphics and styling
    └── values/              # Colors, strings, styles
```

## 🚀 Getting Started

### Prerequisites
- **Android Studio**: Meerkat Feature Drop 2024.3.2 or later
- **Android SDK**: API level 35 (Android 15) - compile SDK
- **Java**: 11+ (recommended for latest Android Studio)
- **Gradle**: 8.11.1 (included with wrapper)
- **Device/Emulator**: Android 7.0+ (API 24) device or emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gpw-hostel.git
   cd gpw-hostel
   ```

2. **Open in Android Studio**
   - Launch Android Studio
   - Select "Open an existing project"
   - Navigate to the cloned directory

3. **Configure Backend URL**
   - Edit `app/src/main/java/com/hostelmanager/app/utils/Constants.java`
   - Update `BASE_URL` with your backend server:
   ```java
   public static final String BASE_URL = "https://your-backend-url.com/";
   ```

4. **Build and Run**
   - Click "Sync Project with Gradle Files"
   - Select your target device/emulator
   - Click "Run" or press Ctrl+R

### 🎮 Demo Mode
The app includes comprehensive demo functionality:
- **Mock Authentication**: Works without backend connection
- **Sample Data**: Realistic room, complaint, and payment information
- **Full Navigation**: Complete UI interaction available
- **File Upload Simulation**: Demo file handling

## 📋 API Integration

### Backend Compatibility
Compatible with FastAPI backend featuring these endpoints:

- **Authentication**: `/api/login`, `/api/register`
- **Room Management**: `/api/rooms`, `/api/my-room`
- **Student Management**: `/api/students`
- **Complaints**: `/api/complaints`
- **Payments**: `/api/payments`
- **File Operations**: `/api/upload-file`, `/api/download-file`
- **Renewal Forms**: `/api/renewal-forms`
- **Mess Menu**: `/api/mess-menu`

### Network Features
- **Automatic Retry**: Failed request handling
- **Error Management**: Comprehensive error handling
- **Offline Support**: Mock data fallback
- **Timeout Configuration**: Configurable network timeouts

## 🎨 Design System

### Visual Design
- **Material Design**: Modern Android UI guidelines
- **Color Scheme**: Blue-purple gradient theme
- **Typography**: Roboto font family with proper hierarchy
- **Icons**: Material Design icons throughout
- **Cards**: Clean, organized information display

### User Experience
- **Role-based Navigation**: Different interfaces for students/admins
- **Intuitive Flow**: Logical user journey design
- **Real-time Feedback**: Loading states and progress indicators
- **Error Recovery**: Graceful error handling and user guidance

## 🔒 Security

- **Authentication**: JWT token-based security
- **Local Storage**: Encrypted SharedPreferences
- **Input Validation**: Client-side form validation
- **Network Security**: HTTPS enforcement
- **Permissions**: Minimal required Android permissions

## 📱 Device Support

- **Minimum SDK**: API 24 (Android 7.0)
- **Target SDK**: API 34 (Android 14)
- **Architecture**: ARM64, ARM, x86, x86_64
- **Screen Sizes**: Phone and tablet optimized
- **Orientation**: Portrait and landscape support

## 🛠️ Development

### Building
```bash
# Clean and build debug
./gradlew clean assembleDebug

# Release build with R8 optimization
./gradlew clean assembleRelease

# Install debug on connected device
./gradlew installDebug

# Run tests
./gradlew test

# Generate APK
./gradlew build
```

### Testing
- **Unit Tests**: Model and utility testing
- **Integration Tests**: API integration testing
- **UI Tests**: Critical user flow validation

### Code Quality
- **Linting**: Android lint integration
- **Code Style**: Standard Java conventions
- **Documentation**: Comprehensive inline documentation

## 🔧 Android Studio 2024.3.2 Compatibility

### ✅ Verified Features
- **Android Gradle Plugin**: 8.7.2 (latest compatible)
- **Gradle Version**: 8.11.1 with wrapper
- **Target SDK**: 35 (Android 15)
- **Compile SDK**: 35 (Android 15)
- **Java Version**: 11 (recommended)
- **Material Design**: 3.0 components
- **ViewBinding**: Enabled for type-safe view references
- **Build Optimizations**: R8 full mode, configuration cache, parallel builds

### 🚀 Quick Setup for AS 2024.3.2
1. **Open Project**: File → Open → Select project folder
2. **Gradle Sync**: Android Studio will automatically sync
3. **Build**: Build → Make Project (Ctrl+F9)
4. **Run**: Select device/emulator → Run (Shift+F10)

### 🔧 Configuration

### Customization Options
- **Backend URL**: Update in `Constants.java`
- **Colors**: Modify `res/values/colors.xml`
- **Strings**: Edit `res/values/strings.xml` for localization
- **Layouts**: Customize XML layouts for UI changes
- **API Endpoints**: Configure in `Constants.java`

### Environment Setup
- **Debug**: Development configuration with logging
- **Release**: Production-ready optimized build
- **Testing**: Test environment configuration

## 📚 Documentation

### Code Documentation
- **Javadoc**: Comprehensive API documentation
- **README**: Setup and usage instructions
- **Architecture**: Design pattern documentation
- **API Reference**: Endpoint documentation

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow Android development best practices
- Maintain code style consistency
- Add tests for new features
- Update documentation for changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material Design**: Google's design system
- **Android Architecture**: Google's recommended patterns
- **Open Source Libraries**: Community contributions
- **Educational Purpose**: GPW Institute hostel management

## 📞 Support

For support and questions:
- **Issues**: Create a GitHub issue
- **Documentation**: Check the README and code comments
- **Demo Mode**: Use offline functionality for testing

---

**GPW Hostel Manager** - Modern Android application for comprehensive hostel management with beautiful UI and robust functionality.
