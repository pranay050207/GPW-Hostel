const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GPW Hostel Manager - Android App</title>
        <style>
            body {
                font-family: 'Roboto', sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: white;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.1);
                padding: 30px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            h1 {
                text-align: center;
                margin-bottom: 30px;
                font-size: 2.5em;
            }
            .android-icon {
                text-align: center;
                font-size: 4em;
                margin-bottom: 20px;
            }
            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 30px 0;
            }
            .feature-card {
                background: rgba(255, 255, 255, 0.1);
                padding: 20px;
                border-radius: 10px;
                text-align: center;
            }
            .info-section {
                margin: 20px 0;
                padding: 20px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }
            .tech-stack {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center;
                margin: 20px 0;
            }
            .tech-badge {
                background: rgba(255, 255, 255, 0.2);
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 0.9em;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="android-icon">📱</div>
            <h1>GPW Hostel Manager</h1>
            <p style="text-align: center; font-size: 1.2em;">Android Application for Comprehensive Hostel Management</p>
            
            <div class="info-section">
                <h2>📋 About This Project</h2>
                <p>This is an <strong>Android application</strong> built with Java and XML for hostel/dormitory management. It features role-based authentication, room management, complaints system, payment tracking, and more.</p>
            </div>

            <div class="feature-grid">
                <div class="feature-card">
                    <h3>🎓 Student Features</h3>
                    <ul style="text-align: left;">
                        <li>Room Information</li>
                        <li>Complaints Management</li>
                        <li>Payment Tracking</li>
                        <li>Room Renewal</li>
                        <li>Mess Menu</li>
                    </ul>
                </div>
                <div class="feature-card">
                    <h3>👨‍💼 Admin Features</h3>
                    <ul style="text-align: left;">
                        <li>Dashboard Overview</li>
                        <li>Room Management</li>
                        <li>Student Management</li>
                        <li>Payment Management</li>
                        <li>Renewal Processing</li>
                    </ul>
                </div>
            </div>

            <div class="info-section">
                <h2>🛠️ Technology Stack</h2>
                <div class="tech-stack">
                    <span class="tech-badge">Java</span>
                    <span class="tech-badge">Android SDK</span>
                    <span class="tech-badge">XML Layouts</span>
                    <span class="tech-badge">Material Design</span>
                    <span class="tech-badge">Retrofit</span>
                    <span class="tech-badge">Glide</span>
                    <span class="tech-badge">Gradle</span>
                </div>
            </div>

            <div class="info-section">
                <h2>🚀 Development Setup</h2>
                <p><strong>To run this Android application:</strong></p>
                <ol>
                    <li>Open the project in <strong>Android Studio</strong></li>
                    <li>Sync project with Gradle files</li>
                    <li>Connect an Android device or start an emulator</li>
                    <li>Click "Run" to build and install the app</li>
                </ol>
            </div>

            <div class="info-section">
                <h2>📱 Requirements</h2>
                <ul>
                    <li><strong>Android Studio:</strong> Arctic Fox or later</li>
                    <li><strong>Android SDK:</strong> API level 24+ (Android 7.0+)</li>
                    <li><strong>Java:</strong> 8+</li>
                    <li><strong>Target Device:</strong> Android 7.0+ device or emulator</li>
                </ul>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <p style="opacity: 0.8;">This is a web preview of an Android project. The actual app runs on Android devices.</p>
            </div>
        </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`GPW Hostel Manager info server running on http://localhost:${PORT}`);
});
