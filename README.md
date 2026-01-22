# ORS Tracker - Full Stack Application

A complete MERN stack application for managing Operational Roadworthiness Score (ORS) plans for vehicles with role-based authentication and modern UI.

## 🚀 Project Overview

This is a mini ORS (Operational Roadworthiness Score) tracking app that allows users to:
- Register and login with role-based access
- View, create, edit, and delete ORS plans based on their role
- Manage nested documents with text docs and attachments
- Experience a modern, responsive UI

**Stack**: MongoDB, Express, React, Node.js (MERN)

## 📋 Features

### Authentication
- User registration with role selection
- Secure login with JWT tokens
- Protected routes based on authentication status
- Logout functionality
- Token persistence in localStorage

### Role-Based Access Control
- **Admin**: Full access to all ORS plans, can manage all users' plans
- **Inspector**: Can create and update their own ORS plans
- **Viewer**: Can only view ORS plans assigned to them

### ORS Plan Management
- Create new ORS plans with detailed information
- Edit existing plans (based on role)
- Delete plans (admin only)
- View plan details with nested documents
- Color-coded traffic scores for quick assessment

### Modern UI
- Responsive design using Tailwind CSS
- Intuitive navigation and layout
- Color-coded status indicators
- Form validation and error handling
- Loading states and user feedback

## 📁 Project Structure

```
FullStackTask/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── orsController.js
│   ├── models/
│   │   ├── User.js
│   │   └── ORSPlan.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── ors.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   ├── .env
│   └── README.md
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ORSForm.jsx
    │   │   └── ORSDetail.jsx
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   └── App.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── README.md
```

## 🔧 Tech Stack

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM (Object Data Modeling)
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **CORS**: Cross-origin resource sharing

### Frontend
- **React**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Build tool and dev server

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or cloud)
- Git

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/ors-tracker
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

4. Seed the database (optional):
```bash
node seed.js
```

5. Start the server:
```bash
npm run dev  # Development with auto-reload
# or
npm start   # Production
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Application runs on `http://localhost:5173`

4. For production build:
```bash
npm run build
npm run preview
```

## 🔐 Test Credentials

Use these credentials to login and test different roles:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| Inspector | inspector@test.com | inspector123 |
| Viewer | viewer@test.com | viewer123 |

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (admin|inspector|viewer),
  createdAt: Date,
  updatedAt: Date
}
```

### ORS Plan Model
```javascript
{
  vehicle: String,
  roadWorthinessScore: String,
  overallTrafficScore: String (A|B|C|D|F),
  actionRequired: String,
  documents: [{
    textDocs: [{
      label: String,
      description: String
    }],
    attachments: [String]
  }],
  createdBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### ORS Plans (Protected)
- `GET /api/ors` - List plans (filtered by role)
- `GET /api/ors/:id` - Get single plan
- `POST /api/ors` - Create plan (Admin/Inspector)
- `PUT /api/ors/:id` - Update plan (Admin/Inspector)
- `DELETE /api/ors/:id` - Delete plan (Admin only)

## 🎯 Features by Role

### Admin
- ✅ View all ORS plans
- ✅ Create new plans
- ✅ Edit any plan
- ✅ Delete any plan
- ✅ Manage all users' plans

### Inspector
- ✅ View their own ORS plans
- ✅ Create new plans
- ✅ Edit their own plans
- ✅ ❌ Delete plans
- ✅ ❌ View other inspectors' plans

### Viewer
- ✅ View assigned ORS plans only
- ❌ Create plans
- ❌ Edit plans
- ❌ Delete plans

## 🚀 Deployment

### Backend Deployment Options
- Heroku
- Railway
- Render
- AWS (EC2, Lambda)
- Azure App Service
- DigitalOcean

### Frontend Deployment Options
- Vercel
- Netlify
- GitHub Pages
- Render
- AWS S3 + CloudFront
- Azure Static Web Apps

### Environment Variables for Deployment

**Backend (.env)**
```
MONGODB_URI=your-mongodb-cloud-url
JWT_SECRET=your-secure-secret-key
PORT=5000
NODE_ENV=production
```

**Frontend (optional .env)**
```
VITE_API_URL=your-deployed-backend-url
```

## 📝 Development Notes

### Authentication Flow
1. User registers or logs in
2. Backend validates credentials
3. JWT token is generated and returned
4. Frontend stores token in localStorage
5. Token is sent in Authorization header for protected routes
6. Backend verifies token and role before allowing access

### State Management
- Uses React Context API for authentication state
- Global auth state available throughout the app
- Protected routes check authentication and role

### Error Handling
- API errors are caught and displayed to users
- Form validation prevents invalid submissions
- Loading states during API calls
- Unauthorized access redirects to login

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [JWT Introduction](https://jwt.io/introduction)

## 📄 License

MIT License

## 👤 Author

Full Stack ORS Tracker Application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Last Updated**: February 2026

**Submission Deadline**: 25/02/2026 11:59 PM
