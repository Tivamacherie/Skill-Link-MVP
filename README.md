# 🎯 Skill-Link - Knowledge Exchange Platform

A modern web application built with **React**, **Firebase**, **MySQL**, and **Node.js** that connects people who want to exchange knowledge and skills. Think of it as a platform where Martin (who's good at English) can connect with Maria (who's good at guitar) to exchange their knowledge!

## 🚀 **Features**

### **🔥 Core Functionality**
- **Smart Matching Algorithm**: Connects users with complementary skills
- **Real-time Chat**: Firebase Firestore powered messaging with typing indicators
- **Video/Voice Calls**: WebRTC integration for seamless communication
- **Appointment Scheduling**: Interactive calendar with MySQL storage
- **User Profiles**: Comprehensive skill management and bio system
- **Rating System**: Peer review system for quality assurance
- **Online Status**: Real-time presence indicators

### **📱 User Experience**
- **Loading Screen**: 1-2 second branded loading experience
- **Responsive Design**: Mobile-first approach with desktop optimization
- **White & Loyal Blue Theme**: Clean, professional UI design
- **Bottom Navigation**: Easy mobile navigation
- **Search & Filter**: Find users by name, skills, or interests

## 🛠️ **Technology Stack**

### **Frontend**
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **Firebase Auth** - User authentication
- **Firebase Firestore** - Real-time messaging
- **CSS3** - Custom styling with CSS variables

### **Backend**
- **Node.js & Express** - RESTful API server
- **MySQL** - Primary database for user data
- **Firebase Admin SDK** - Server-side Firebase operations
- **JWT** - Token-based authentication
- **Socket.io** - Real-time features (optional)

### **Database Architecture**
- **Firebase Firestore** - Real-time chat messages and presence
- **MySQL** - User profiles, skills, appointments, ratings

## 📁 **Project Structure**

```
Skill-Link/
├── 📂 src/                    # React Frontend
│   ├── 📂 components/         # Reusable components
│   │   ├── LoadingScreen.tsx
│   │   ├── Header.tsx
│   │   └── BottomNavigation.tsx
│   ├── 📂 pages/              # Main application pages
│   │   ├── HomePage.tsx       # Dashboard with calendar
│   │   ├── SearchPage.tsx     # User search & matching
│   │   ├── ChatPage.tsx       # Real-time messaging
│   │   ├── ProfilePage.tsx    # Profile management
│   │   ├── Login.tsx          # Authentication
│   │   └── Register.tsx       # User registration
│   ├── 📂 context/            # React Context API
│   │   └── AuthContext.tsx    # Authentication state
│   ├── 📂 services/           # External service integrations
│   │   └── firebase.ts        # Firebase configuration
│   ├── App.tsx               # Main app component
│   ├── index.tsx             # App entry point
│   └── index.css             # Global styles
├── 📂 backend/                # Node.js API Server
│   ├── 📂 config/             # Configuration files
│   │   ├── database.js        # MySQL connection & queries
│   │   └── firebase.js        # Firebase Admin SDK
│   ├── 📂 routes/             # API endpoints
│   ├── 📂 middleware/         # Express middleware
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   └── .env.example          # Environment variables template
├── 📂 database/               # Database schemas
│   └── schema.sql            # MySQL database structure
├── package.json              # Frontend dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## 🚦 **Getting Started**

### **Prerequisites**
- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **Firebase Project** with Authentication and Firestore enabled

### **1. Clone & Install**
```bash
# Clone the repository
git clone <repository-url>
cd Skill-Link

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### **2. Database Setup**
```bash
# Create MySQL database
mysql -u root -p < database/schema.sql

# The script will create:
# - skill_link database
# - All required tables
# - Sample skills data
# - Indexes for performance
```

### **3. Firebase Configuration**

#### **Frontend (`src/services/firebase.ts`)**
```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

#### **Backend Environment (`.env`)**
```bash
# Copy example environment file
cp .env.example .env

# Configure your environment variables:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=skill_link

FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

JWT_SECRET=your_super_secret_jwt_key
```

### **4. Start Development Servers**

#### **Backend Server**
```bash
cd backend
npm run dev
# Server starts on http://localhost:3001
```

#### **Frontend React App**
```bash
# In project root
npm start
# App starts on http://localhost:3000
```

## 🗄️ **Database Schema**

### **Key Tables**
- **`users`** - User profiles and authentication data
- **`skills`** - Available skills/subjects (English, Guitar, Programming, etc.)
- **`user_skills`** - Skills users can teach
- **`user_learning_interests`** - Skills users want to learn
- **`skill_matches`** - Connections between users
- **`appointments`** - Scheduled learning sessions
- **`user_reviews`** - Ratings and feedback system

### **Firebase Collections**
- **`conversations`** - Chat metadata and participants
- **`messages`** - Real-time chat messages
- **`user_presence`** - Online/offline status

## 🔑 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification
- `POST /api/auth/refresh` - Refresh tokens

### **Users**
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users by skills/name
- `GET /api/users/matches` - Get potential skill matches

### **Skills**
- `GET /api/skills` - Get all available skills
- `POST /api/skills` - Add new skill
- `PUT /api/users/skills` - Update user skills
- `PUT /api/users/interests` - Update learning interests

### **Appointments**
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### **Real-time Features**
- Firebase Firestore handles real-time messaging
- WebRTC for video/voice calls (integration ready)

## 🎨 **UI/UX Design**

### **Color Scheme**
- **Primary**: Loyal Blue (#4A90E2)
- **Background**: White (#FFFFFF)
- **Secondary**: Light Gray (#f5f5f5)
- **Text**: Dark Gray (#333333)
- **Success**: Green (#4CAF50)
- **Error**: Red (#f44336)

### **Key Features**
- **Loading Animation**: 2-second branded spinner
- **Responsive Design**: Mobile-first with desktop support
- **Smooth Transitions**: CSS animations throughout
- **Accessibility**: WCAG compliant color contrast
- **Modern Layout**: Card-based design system

## 🔄 **User Flow Example**

1. **Registration**: User signs up with Firebase Auth
2. **Profile Setup**: Add skills (e.g., "English, Writing") and interests (e.g., "Guitar, Piano")
3. **Matching**: Algorithm finds Martin ↔ Maria match (English ↔ Guitar)
4. **Connection**: Users can chat and schedule appointments
5. **Session**: Video call integration for learning sessions
6. **Review**: Rate each other after sessions

## 📊 **Smart Matching Algorithm**

The matching system considers:
- **Complementary Skills**: What you teach ↔ What they want to learn
- **Mutual Exchange**: Bi-directional skill sharing
- **User Ratings**: Higher-rated users get priority
- **Online Status**: Active users shown first
- **Compatibility Score**: Algorithm-calculated match quality

## 🛡️ **Security Features**

- **Firebase Authentication**: Secure user management
- **JWT Tokens**: API authentication
- **Input Validation**: All user inputs sanitized
- **Rate Limiting**: API abuse protection
- **CORS Configuration**: Secure cross-origin requests
- **Environment Variables**: Sensitive data protection

## 🚀 **Production Deployment**

### **Frontend (Vercel/Netlify)**
```bash
npm run build
# Deploy build/ folder to hosting service
```

### **Backend (Heroku/AWS)**
```bash
# Set environment variables in hosting platform
# Deploy backend with process manager (PM2)
```

### **Database**
- **MySQL**: Use managed service (AWS RDS, Google Cloud SQL)
- **Firebase**: Production project with proper security rules

## 📈 **Future Enhancements**

- **Mobile App**: React Native version
- **AI Recommendations**: Machine learning for better matching
- **Payment Integration**: Premium features and session payments
- **Group Sessions**: Multiple users in single learning session
- **Content Sharing**: File upload for learning materials
- **Gamification**: Points, badges, and achievements
- **Multi-language**: Internationalization support

## 👥 **Contributing**

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Support**

- **Issues**: GitHub Issues tab
- **Documentation**: Check `/docs` folder
- **Email**: support@skill-link.app
- **Discord**: Join our developer community

---

**Built with ❤️ for the learning community**

*Skill-Link makes knowledge sharing accessible, engaging, and mutually beneficial for everyone!*