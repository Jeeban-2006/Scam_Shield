# 🛡️ Scam Shield

**AI-Powered Scam Detection Platform**

A comprehensive web application that uses advanced Machine Learning and rule-based analysis to detect and prevent online scams, phishing attempts, and fraudulent links in real-time.

---

## 🌟 Features

### 🔗 Link Checker
- **Hybrid ML + Rule Engine**: Combines machine learning predictions with security rules
- **Structural URL Analysis**: Analyzes domain entropy, path patterns, and suspicious characteristics
- **Real-time Detection**: Instant risk assessment with confidence scores
- **6 Scam Categories**: Phishing, Giveaway Scam, Investment Scam, Job Scam, Loan Scam, Legitimate

### 💬 Message Analyzer
- **Multi-language Support**: English, Hindi, and Odia
- **Pattern Recognition**: Detects urgency tactics, financial requests, and suspicious keywords
- **Risk Scoring**: Comprehensive scam score with detailed explanations

### 🎯 Awareness Quiz
- **Interactive Learning**: Test your scam detection knowledge
- **Category-based Questions**: Phishing, social engineering, financial scams
- **Progress Tracking**: View your quiz history and improvement

### 👤 User Features
- **Authentication**: Secure login and registration
- **Scan History**: Track all your link and message checks
- **Profile Management**: Update account details
- **Password Recovery**: Email-based password reset

---

## 🚀 Recent Updates (v2.0)

### ✨ Enhanced ML Model
- **Structural Features Added** (11 new features):
  - Domain: length, dots, subdomains, hyphens, digits, IP detection, entropy
  - Path: length, digits, hyphens, UUID/hash detection
- **Improved Accuracy**: 95.19% (5-fold cross-validation)
- **Better Feature Engineering**: TF-IDF character n-grams (3-5) + scaled structural features
- **Model**: Logistic Regression with balanced class weights

### 🎨 Dynamic UI Overhaul
- **AI Classification Section**: Shows ML prediction with confidence meter
- **Conditional Red Flags**: Only displays when threats are detected
- **Collapsible Explanation Panel**: "Why was this classified this way?"
  - ML prediction details
  - Suspicious patterns detected
  - Rule-based triggers
  - Hybrid decision logic explanation
- **Risk-Level Theming**: Green (Safe), Yellow (Suspicious), Red (Dangerous)
- **Removed Hardcoded Content**: All data now comes from backend API

### 🔧 Backend Improvements
- **Weighted Fusion Update**: 70% Rule-based + 30% ML confidence
- **Legitimate URL Handling**: Fixed ML score logic for safe URLs
- **Better Analysis Text**: Shows specific ML predictions in results

---

## 🏗️ Architecture

### Frontend (React + TypeScript + Vite)
```
FRONTEND/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Home.tsx              # Landing page
│   │   │   ├── LinkChecker.tsx       # URL input form
│   │   │   ├── LinkResult.tsx        # 🆕 Dynamic results display
│   │   │   ├── MessageAnalyzer.tsx   # Message scam detection
│   │   │   └── ...
│   │   ├── api/
│   │   │   ├── link.ts               # Link check API
│   │   │   ├── auth.ts               # Authentication
│   │   │   └── config.ts             # API configuration
│   └── ...
```

### Backend (Django + Django REST Framework)
```
BACKEND/
├── analyzer/
│   ├── ml/
│   │   ├── train_model.py      # 🆕 Enhanced ML training
│   │   ├── predict.py          # 🆕 Prediction with structural features
│   │   ├── add_noise.py        # 🆕 Data augmentation
│   │   ├── model.pkl           # 🆕 Trained model (164 KB)
│   │   ├── vectorizer.pkl      # 🆕 TF-IDF vectorizer (64 KB)
│   │   ├── scaler.pkl          # 🆕 Feature scaler (2 KB)
│   │   └── data/
│   │       └── raw_dataset.csv # Training dataset
│   ├── views.py                # API endpoints
│   ├── link_validator.py       # 🔧 Updated hybrid validation
│   ├── utils.py                # Message analysis utilities
│   └── models.py               # Database models
```

---

## 🧠 ML Model Details

### Training Pipeline
1. **Data Loading**: 9,825 cleaned URLs across 6 categories
2. **Feature Extraction**:
   - **TF-IDF**: Character n-grams (3-5), min_df=3
   - **Structural**: 11 engineered features
3. **Feature Combination**: Horizontal stack of TF-IDF + scaled structural features
4. **Model Training**: Logistic Regression (max_iter=4000, solver=lbfgs)
5. **Evaluation**: Train/Test split + 5-fold cross-validation

### Performance Metrics
- **Training Accuracy**: 95.78%
- **Test Accuracy**: 94.91%
- **Cross-Validation**: 95.19%
- **Best Performance**: Giveaway, Investment, Phishing (100% precision)

### Structural Features
```python
1. Domain length
2. Dot count in domain
3. Subdomain depth
4. Hyphens in domain
5. Digits in domain
6. IP address detection
7. Domain entropy (Shannon)
8. Path length
9. Digits in path
10. Hyphens in path
11. UUID/hash pattern detection
```

---

## 🔄 Hybrid Decision Logic

### Risk Score Calculation
```
Final Score = (Rule-Based Score × 0.7) + (ML Confidence × 0.3)
```

### Rule-Based Checks (70% weight)
- ✅ HTTPS/SSL validation
- ✅ Suspicious TLD detection (.tk, .xyz, .ml, etc.)
- ✅ Suspicious keywords (login, verify, account, etc.)

### ML-Based Classification (30% weight)
- ✅ TF-IDF pattern matching
- ✅ Structural anomaly detection
- ✅ Multi-class prediction (6 categories)
- ✅ Confidence scoring

### Risk Levels
- **SAFE** (0-39): Green theme, minimal warnings
- **SUSPICIOUS** (40-69): Yellow theme, caution advised
- **DANGEROUS** (70-100): Red theme, strong warnings

---

## 🛠️ Installation

### Prerequisites
- **Python**: 3.8+
- **Node.js**: 16+
- **pip**: Latest version
- **npm**: Latest version

### Backend Setup
```bash
cd BACKEND

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed quiz questions (optional)
python manage.py migrate --run-syncdb

# Train ML model (if needed)
python analyzer/ml/train_model.py

# Start server
python manage.py runserver
```

### Frontend Setup
```bash
cd FRONTEND

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

---

## 📡 API Endpoints

### Link Analysis
```http
POST /api/link/check/
Content-Type: application/json

{
  "url": "https://example.com"
}

Response:
{
  "is_valid": true,
  "is_safe": true,
  "domain": "example.com",
  "ssl_valid": true,
  "risk_level": "SAFE",
  "risk_score": 0,
  "red_flags": [],
  "analysis": "No major red flags detected...",
  "ml_prediction": "legitimate",
  "ml_confidence": 98.6,
  "ml_patterns": ["...", "..."]
}
```

### Message Analysis
```http
POST /api/analyze/
Content-Type: application/json

{
  "message": "Your message text here"
}
```

### Authentication
```http
POST /api/auth/register/
POST /api/auth/login/
GET  /api/auth/me/
POST /api/auth/recovery/request/
POST /api/auth/recovery/verify/
POST /api/auth/change-password/
```

### User Features
```http
GET  /api/link/history/
GET  /api/message/history/
GET  /api/user/profile/
PUT  /api/user/profile/
GET  /api/user/stats/
```

---

## 🎨 UI Components

### Link Result Page Features
1. **Risk Score Card**
   - Large animated score (0-100)
   - Progress bar with color coding
   - Scam type badge (if detected)
   - Hybrid fusion indicator

2. **AI Classification Card**
   - Predicted category with badge
   - Confidence meter (animated)
   - Detected patterns list
   - Green "Legitimate" badge for safe URLs

3. **Technical Analysis**
   - Domain information
   - SSL certificate status
   - Safety assessment

4. **Red Flags Section** (Conditional)
   - Only shown when flags exist
   - Dynamic badge list from backend

5. **Collapsible Explanation**
   - ML analysis details
   - Suspicious patterns
   - Rule-based triggers
   - Hybrid logic explanation

6. **Analysis Summary**
   - Backend-generated text
   - Color-coded by risk level

---

## 🧪 Testing

### Test URLs
```bash
# Legitimate
https://www.google.com
https://github.com

# Phishing
http://paypal-verify.tk/login
http://secure-account-update.ml/verify

# Giveaway Scam
http://free-iphone-winner.tk/claim
http://prize-giveaway.xyz/winner

# Job Scam
http://work-from-home-easy.xyz/apply
http://earn-money-fast.tk/signup
```

### Run Tests
```bash
# Backend tests
cd BACKEND
python manage.py test

# Frontend tests
cd FRONTEND
npm test
```

---

## 📊 Database Schema

### Models
- **User**: Django's built-in User model
- **ScamCheck**: Message analysis records
- **ScamReport**: User-submitted scam reports
- **Scan**: Link/message scan history
- **QuizQuestion**: Quiz questions and answers
- **QuizAttempt**: User quiz attempts
- **PasswordResetCode**: Password recovery codes

---

## 🔐 Security Features

- ✅ Token-based authentication
- ✅ Password hashing (Django's PBKDF2)
- ✅ CORS protection
- ✅ Input sanitization (bleach)
- ✅ SQL injection prevention (Django ORM)
- ✅ XSS protection
- ✅ CSRF tokens

---

## 🌐 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

---

## 📈 Performance

- **ML Prediction**: < 100ms per URL
- **API Response**: < 200ms average
- **Frontend Load**: < 1s initial load
- **Model Size**: 230 KB total (all artifacts)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- **Scikit-learn**: Machine learning library
- **Django**: Backend framework
- **React**: Frontend library
- **Vite**: Build tool
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **TailwindCSS**: Styling framework

---

## 📚 Documentation

For detailed documentation, see:
- [Integration Verification](docs/integration_verification.md)
- [UI Walkthrough](docs/walkthrough.md)
- [Git Changes Summary](docs/git_push_summary.md)

---

## 🐛 Known Issues

- None currently reported

---

## 🗺️ Roadmap

- [ ] Browser extension for real-time protection
- [ ] Mobile app (React Native)
- [ ] Advanced ML models (Deep Learning)
- [ ] Community-driven scam database
- [ ] API rate limiting
- [ ] Multi-factor authentication

---

## 📞 Support

For support, email support@scamshield.com or open an issue on GitHub.

---

**Made with ❤️ to protect users from online scams**
