# 🛡️ ScamShield - Advanced AI-Powered Scam Detection Platform

<div align="center">

**Protect yourself from online scams with cutting-edge AI technology**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Node.js](https://img.shields.io/badge/node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-18+-61DAFB.svg)](https://reactjs.org/)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

ScamShield is a comprehensive, multi-platform scam detection system that uses **AI and Machine Learning** to protect users from phishing, fraud, and online scams. The platform provides real-time analysis of messages, links, and suspicious content across web, mobile, and browser extension interfaces.

### Why ScamShield?

- 🤖 **AI-Powered Analysis**: Uses Groq AI and custom ML models for accurate scam detection
- 🌐 **Multi-Platform**: Web app, browser extension, and WhatsApp bot
- 🔒 **Privacy-First**: Firebase authentication with secure token management
- 📊 **Real-Time Insights**: Instant risk scoring and detailed threat analysis
- 🎓 **Educational**: Interactive quizzes and safety tips
- 🌍 **Multilingual**: Supports English, Hindi, and Odia languages

---

## ✨ Features

### 🔍 Core Detection Features

#### 1. **Message Analyzer**
- AI-powered text analysis using Groq API
- Multilingual support (English, Hindi, Odia)
- Detects phishing, lottery scams, urgency tactics, and more
- Real-time risk scoring (0-100)
- Detailed explanations and red flags
- Personalized safety tips

#### 2. **Link Checker**
- Hybrid URL validation (Rule-based + ML)
- SSL/HTTPS verification
- Suspicious TLD detection (.tk, .xyz, .ml, etc.)
- Phishing keyword detection
- ML-based pattern recognition
- Risk level classification (Safe, Suspicious, Dangerous)

#### 3. **Scam Reporting**
- User-submitted scam reports
- Evidence upload (screenshots, links)
- Platform categorization (WhatsApp, Email, SMS, etc.)
- Scam type classification
- Community-driven threat intelligence

#### 4. **Educational Quizzes**
- Interactive scam awareness quizzes
- Gamified learning experience
- Score tracking and history
- Multiple difficulty levels
- Real-world scam scenarios

### 🎨 User Interface Features

#### Web Application
- **Modern, Responsive Design**: Premium UI with glassmorphism and animations
- **Dark Mode**: Eye-friendly dark theme
- **Real-Time Feedback**: Instant scan results with visual indicators
- **User Dashboard**: Profile management and activity history
- **Scan History**: Track all analyzed messages and links
- **Statistics**: Personal scam detection stats

#### Browser Extension
- **Quick Access**: Analyze messages and links from any webpage
- **Popup Interface**: Compact, user-friendly design
- **Offline Capable**: Works without constant backend connection
- **Safety Tips**: Context-aware security advice
- **Risk Badges**: Visual risk level indicators

#### WhatsApp Bot
- **Conversational Interface**: Natural language interaction
- **Instant Analysis**: Send messages or links for immediate scanning
- **Report Scams**: Submit scam reports via WhatsApp
- **Help Commands**: `/help`, `/analyze`, `/check`, `/report`

### 🔐 Authentication & Security

- **Firebase Authentication**: Google Sign-In integration
- **JWT Token Management**: Secure API authentication
- **User Sessions**: Persistent login with token refresh
- **Privacy Protection**: No storage of sensitive user data
- **Secure API Endpoints**: CORS-protected backend

### 📊 Data Management

- **Dual Storage System**:
  - **Django SQLite**: User accounts, scans, reports
  - **MongoDB**: URL history, analytics data
  - **localStorage**: Instant client-side history
- **Real-Time Sync**: Background synchronization
- **Data Persistence**: Scan history across sessions
- **Export Capabilities**: Download scan reports

### 🤖 AI & Machine Learning

- **Groq AI Integration**: Advanced language model analysis
- **Custom ML Models**: TF-IDF + Logistic Regression for URL classification
- **Pattern Recognition**: Detects phishing patterns and suspicious keywords
- **Confidence Scoring**: ML prediction confidence levels
- **Hybrid Approach**: Combines rule-based and AI-based detection

---

## 🏗️ Architecture

```
ScamShield/
│
├── FRONTEND/                 # React + Vite Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # UI Components
│   │   │   ├── api/          # API Integration
│   │   │   ├── lib/          # Utilities & Helpers
│   │   │   └── firebase.ts   # Firebase Config
│   │   └── main.tsx
│   └── .env                  # Firebase Config
│
├── BACKEND/                  # Django REST API
│   ├── analyzer/
│   │   ├── views.py          # API Endpoints
│   │   ├── models.py         # Database Models
│   │   ├── utils.py          # Message Analysis
│   │   ├── link_validator.py # URL Validation
│   │   ├── auth_views.py     # Authentication
│   │   └── ml/               # Machine Learning Models
│   ├── manage.py
│   └── .env                  # Django + API Keys
│
├── MONGO_SERVICE/            # MongoDB Microservice
│   ├── index.js              # Express Server
│   └── .env                  # MongoDB URI
│
├── BROWSER_EXTENSION/        # Chrome Extension
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
│
└── WHATSAPP_BOT/             # WhatsApp Integration
    ├── bot.js                # Web.js Bot
    └── .env                  # Backend URL
```

### Technology Stack

#### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom CSS
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **State Management**: React Hooks
- **Icons**: Lucide React

#### Backend
- **Framework**: Django 6.0
- **API**: Django REST Framework
- **Database**: SQLite (Development), PostgreSQL (Production)
- **Authentication**: Firebase JWT + Django Token Auth
- **AI**: Groq API (Llama 3.3 70B)
- **ML**: scikit-learn, TF-IDF, Logistic Regression

#### Database Services
- **Primary**: Django SQLite/PostgreSQL
- **Secondary**: MongoDB Atlas
- **Cache**: localStorage (Client-side)

#### Additional Services
- **Authentication**: Firebase Auth
- **Email**: Gmail SMTP
- **WhatsApp**: Twilio / Web.js
- **Deployment**: Vercel (Frontend), Render/Railway (Backend)

---

## 📸 Screenshots

### Web Application
- **Home Page**: Hero section with quick access to features
- **Message Analyzer**: Real-time text analysis with risk scoring
- **Link Checker**: URL validation with detailed red flags
- **Profile Dashboard**: User stats and scan history
- **Quiz Section**: Interactive scam awareness quizzes

### Browser Extension
- **Popup Interface**: Compact analysis tool
- **Risk Badges**: Visual threat indicators
- **Safety Tips**: Context-aware security advice

---

## 🚀 Installation

### Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.8+
- **MongoDB** Account (MongoDB Atlas)
- **Firebase** Project (for authentication)
- **Groq API** Key (for AI analysis)
- **Git** (for cloning)

### Quick Start

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/scamshield.git
cd scamshield
```

#### 2. Backend Setup (Django)
```bash
cd BACKEND

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (see Configuration section)
# Copy .env.example to .env and fill in values

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```
Backend runs on `http://localhost:8000`

#### 3. Frontend Setup (React)
```bash
cd FRONTEND

# Install dependencies
npm install

# Create .env file (see Configuration section)
# Copy .env.example to .env and fill in Firebase config

# Start development server
npm run dev
```
Frontend runs on `http://localhost:5173`

#### 4. MongoDB Service Setup
```bash
cd MONGO_SERVICE

# Install dependencies
npm install

# Create .env file
# Add MONGO_URI and PORT

# Start service
node index.js
```
Service runs on `http://localhost:5000`

#### 5. Browser Extension Setup
```bash
# No installation needed, just load in browser:

1. Open Chrome/Edge
2. Navigate to chrome://extensions/ or edge://extensions/
3. Enable "Developer Mode" (top-right toggle)
4. Click "Load Unpacked"
5. Select the BROWSER_EXTENSION folder
6. Extension is now active!
```

#### 6. WhatsApp Bot Setup (Optional)
```bash
cd WHATSAPP_BOT

# Install dependencies
npm install

# Create .env file
# Add BACKEND_URL

# Start bot
npm start

# Scan QR code with WhatsApp
```

---

## ⚙️ Configuration

### Backend Configuration (`BACKEND/.env`)

```env
# Django Settings
SECRET_KEY=your-super-secret-django-key-change-this
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (MongoDB for analytics)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/scamshield

# AI API Keys
GROQ_API_KEY=gsk_your_groq_api_key_here

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password

# CORS Settings (for frontend)
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend Configuration (`FRONTEND/.env`)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Backend API URL
VITE_API_URL=http://localhost:8000
```

### MongoDB Service Configuration (`MONGO_SERVICE/.env`)

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/scamshield
PORT=5000
```

### WhatsApp Bot Configuration (`WHATSAPP_BOT/.env`)

```env
BACKEND_URL=http://localhost:8000/api
```

---

## 📖 Usage

### Web Application

#### 1. **Analyze a Message**
1. Navigate to "Message Analyzer"
2. Paste the suspicious message
3. Click "Analyze Scam Risk"
4. View risk score, red flags, and safety tips

#### 2. **Check a Link**
1. Navigate to "Link Checker"
2. Enter the URL
3. Click "Scan Link"
4. View risk level and security analysis

#### 3. **Report a Scam**
1. Navigate to "Report Scam"
2. Fill in scam details
3. Upload evidence (optional)
4. Submit report

#### 4. **Take a Quiz**
1. Navigate to "Quiz"
2. Select difficulty level
3. Answer questions
4. View score and explanations

#### 5. **View History**
1. Navigate to "Profile"
2. View scan history
3. Check statistics
4. Manage account

### Browser Extension

#### 1. **Analyze Message**
1. Click extension icon
2. Select "Analyze Message" tab
3. Paste message
4. Click "Analyze"

#### 2. **Check Link**
1. Click extension icon
2. Select "Check Link" tab
3. Enter URL
4. Click "Check Link"

### WhatsApp Bot

#### Available Commands:
- `/help` - Show help menu
- `/analyze <message>` - Analyze a message
- `/check <url>` - Check a link
- `/report` - Report a scam
- `/stats` - View your statistics

#### Example Usage:
```
User: /analyze You have won $1000! Click here to claim
Bot: ⚠️ HIGH RISK SCAM DETECTED
     Risk Score: 85/100
     Red Flags:
     - Lottery/Prize scam pattern
     - Urgency tactics
     - Suspicious link
     
     Safety Tips:
     ✅ Do NOT click any links
     ✅ Do NOT share personal information
     ✅ Report and delete this message
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication
Most endpoints require Firebase JWT token:
```
Authorization: Token <firebase-id-token>
```

### Endpoints

#### Message Analysis
```http
POST /api/analyze/
Content-Type: application/json

{
  "message": "Your text message here"
}

Response:
{
  "risk_level": "High Risk Scam",
  "scam_score": 85,
  "detected_keywords": ["urgent", "click", "prize"],
  "scam_type": "Lottery Scam",
  "explanation_for_user": "⚠️ THIS MESSAGE IS A SCAM...",
  "detailed_reasons": ["Lottery scam pattern", "Urgency tactics"],
  "safety_tips": ["Do not click links", "Report this message"]
}
```

#### Link Validation
```http
POST /api/link/check/
Content-Type: application/json

{
  "url": "http://suspicious-site.tk"
}

Response:
{
  "is_valid": true,
  "is_safe": false,
  "domain": "suspicious-site.tk",
  "ssl_valid": false,
  "risk_level": "DANGEROUS",
  "risk_score": 82,
  "red_flags": ["No HTTPS encryption", "Suspicious domain extension (.tk)"],
  "ml_prediction": "phishing",
  "ml_confidence": 87
}
```

#### User Profile
```http
GET /api/user/profile/
Authorization: Token <firebase-token>

Response:
{
  "email": "user@example.com",
  "name": "John Doe",
  "created_at": "2026-01-15T10:30:00Z"
}
```

#### Scan History
```http
GET /api/link/history/?page=1&limit=10
Authorization: Token <firebase-token>

Response:
{
  "scans": [
    {
      "id": 1,
      "content": "http://example.com",
      "risk_level": "Safe",
      "risk_score": 10,
      "created_at": "2026-02-16T10:00:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "pages": 3
}
```

#### Submit Report
```http
POST /api/report/submit/
Authorization: Token <firebase-token>
Content-Type: application/json

{
  "scam_type": "Phishing",
  "platform": "WhatsApp",
  "description": "Fake bank message",
  "evidence_url": "http://example.com/screenshot.png"
}

Response:
{
  "id": 123,
  "status": "pending",
  "created_at": "2026-02-16T10:00:00Z"
}
```

---

## 🌐 Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd FRONTEND
vercel

# Set environment variables in Vercel dashboard
# Add all VITE_* variables from .env
```

### Backend (Render/Railway)

#### Render:
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn scamshield.wsgi:application`
5. Add environment variables from `.env`
6. Deploy

#### Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd BACKEND
railway up

# Add environment variables in Railway dashboard
```

### MongoDB Service
Can be deployed as a separate Node.js service or integrated into the backend.

### Browser Extension
1. Build production version
2. Zip the `BROWSER_EXTENSION` folder
3. Submit to Chrome Web Store
4. Or distribute as unpacked extension

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 📝 Recent Updates

### v2.0.0 (February 2026)
- ✅ **Fixed Authentication**: Real Firebase token integration
- ✅ **LocalStorage History**: Instant scan history display
- ✅ **Browser Extension Safety Tips**: Added default tips for all risk levels
- ✅ **Improved Risk Detection**: Better handling of all backend response formats
- ✅ **Message Analyzer Fix**: Fixed missing `re` module import
- ✅ **Profile Dashboard**: Enhanced with real-time data loading
- ✅ **Multilingual Support**: Added Hindi and Odia language detection

### Known Issues
- Quiz history authentication needs improvement
- Some ML model version warnings (non-critical)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Groq AI for powerful language model API
- Firebase for authentication services
- MongoDB Atlas for database hosting
- The open-source community

---

## 📞 Support

For support, email support@scamshield.com or join our Discord server.

---

<div align="center">

**Made with ❤️ by the ScamShield Team**

[Website](https://scamshield.com) • [Documentation](https://docs.scamshield.com) • [Report Bug](https://github.com/yourusername/scamshield/issues) • [Request Feature](https://github.com/yourusername/scamshield/issues)

</div>
