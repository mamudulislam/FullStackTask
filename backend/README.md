# ORS Tracker - Backend

An Express.js API for managing Operational Roadworthiness Score (ORS) plans with role-based authentication and CRUD operations.

## Features

- **Authentication**: JWT-based authentication with user registration and login
- **Role-Based Access Control**: Admin, Inspector, and Viewer roles with different permissions
- **ORS Plan Management**: Full CRUD operations for ORS plans
- **Nested Documents**: Support for textDocs and attachments within ORS plans
- **MongoDB Integration**: Persistent data storage with Mongoose

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/ors-tracker
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

For MongoDB Cloud (Atlas):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ors-tracker
```

## Running the Server

**Development (with auto-reload)**:
```bash
npm run dev
```

**Production**:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register a new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/me` - Get logged-in user info (requires auth)

### ORS Plans (all require authentication)
- **GET** `/api/ors` - Get all ORS plans (filtered by role)
- **GET** `/api/ors/:id` - Get single ORS plan
- **POST** `/api/ors` - Create new ORS plan (Admin/Inspector only)
- **PUT** `/api/ors/:id` - Update ORS plan (Admin/Inspector only)
- **DELETE** `/api/ors/:id` - Delete ORS plan (Admin only)

### Health Check
- **GET** `/api/health` - Check server status

## Sample Credentials

After seeding the database, use these credentials to test:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| Inspector | inspector@test.com | inspector123 |
| Viewer | viewer@test.com | viewer123 |

## Seeding Database

To seed the database with sample data:

```bash
node seed.js
```

This will create:
- 3 sample users (Admin, Inspector, Viewer)
- 5 sample ORS plans

## Role Permissions

| Permission | Admin | Inspector | Viewer |
|-----------|-------|-----------|--------|
| View all plans | ✓ | ✓ (own only) | ✓ (assigned only) |
| Create plans | ✓ | ✓ | ✗ |
| Update plans | ✓ | ✓ (own only) | ✗ |
| Delete plans | ✓ | ✗ | ✗ |

## Project Structure

```
backend/
├── controllers/          # Business logic
│   ├── authController.js
│   └── orsController.js
├── models/              # Mongoose schemas
│   ├── User.js
│   └── ORSPlan.js
├── routes/              # API routes
│   ├── auth.js
│   └── ors.js
├── middleware/          # Custom middleware
│   └── auth.js         # JWT verification & role checking
├── server.js           # Express app setup
├── seed.js             # Database seeding script
├── package.json
└── .env               # Environment variables
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens expire in 7 days
- Role-based authorization middleware
- CORS enabled for frontend communication
- Input validation on all endpoints

## Deployment

The backend can be deployed to:
- Heroku
- Railway
- Render
- AWS
- Azure
- DigitalOcean

## License

MIT
