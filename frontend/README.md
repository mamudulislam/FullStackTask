# ORS Tracker - Frontend

A modern React application for tracking Operational Roadworthiness Score (ORS) plans with role-based authentication and management.

## Features

- **Authentication**: User registration and login with JWT token management
- **Role-Based Dashboard**: Different UI based on user roles (Admin, Inspector, Viewer)
- **ORS Plan Management**: Create, read, update, and delete ORS plans
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Modern UI**: Clean and intuitive user interface with color-coded scores
- **Document Management**: Support for nested text documents and attachments

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure API URL**:
The frontend is configured to connect to `http://localhost:5000/api`
To change this, edit the `API_URL` in `src/api.js`

## Running the Application

**Development**:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

**Build for production**:
```bash
npm run build
```

**Preview production build**:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/                 # Page components
│   │   ├── Login.jsx         # Login page
│   │   ├── Register.jsx      # Registration page
│   │   ├── Dashboard.jsx     # ORS plans list
│   │   ├── ORSForm.jsx       # Create/Edit ORS plans
│   │   └── ORSDetail.jsx     # View single ORS plan
│   ├── components/            # Reusable components
│   │   └── ProtectedRoute.jsx # Route protection component
│   ├── context/              # React Context
│   │   └── AuthContext.jsx   # Authentication state management
│   ├── api.js               # API service layer
│   ├── App.jsx              # Main app component with routing
│   ├── index.css            # Global styles (Tailwind)
│   └── main.jsx             # Entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Pages & Features

### Login Page
- Email and password authentication
- Demo credentials display
- Link to registration
- Error handling

### Registration Page
- User registration with username, email, password
- Role selection (Admin, Inspector, Viewer)
- Form validation
- Redirect to dashboard after successful registration

### Dashboard
- Display all ORS plans (filtered by role)
- Color-coded traffic scores (A=Green, B=Blue, C=Yellow, D=Orange, F=Red)
- View, Edit, and Delete buttons (based on role)
- Create new plan button (Admin/Inspector only)
- User info and logout functionality

### ORS Form
- Create or edit ORS plans
- Vehicle information and score fields
- Dynamic document management
- Add/remove text documents and attachments
- Form validation and error handling

### ORS Detail
- View complete ORS plan details
- Display all documents and nested information
- Edit and delete buttons (based on permissions)
- User and timestamp information

## Authentication & Authorization

### Login
1. Navigate to `/login`
2. Enter email and password
3. JWT token is stored in localStorage
4. Redirected to dashboard

### Protected Routes
- `/dashboard` - All authenticated users
- `/ors/:id` - All authenticated users
- `/ors/create` - Admin and Inspector only
- `/ors/:id/edit` - Admin and Inspector only

## Sample Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| Inspector | inspector@test.com | inspector123 |
| Viewer | viewer@test.com | viewer123 |

## User Roles & Permissions

| Action | Admin | Inspector | Viewer |
|--------|-------|-----------|--------|
| View plans | ✓ All | ✓ Own | ✓ Assigned |
| Create plan | ✓ | ✓ | ✗ |
| Edit plan | ✓ All | ✓ Own | ✗ |
| Delete plan | ✓ | ✗ | ✗ |

## API Integration

The frontend communicates with the backend API using Axios:

- `GET /api/auth/me` - Get current user
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/ors` - Get all ORS plans
- `GET /api/ors/:id` - Get single plan
- `POST /api/ors` - Create plan
- `PUT /api/ors/:id` - Update plan
- `DELETE /api/ors/:id` - Delete plan

## Styling

The application uses **Tailwind CSS** for styling:
- Responsive grid and flexbox layouts
- Color-coded components for better UX
- Consistent spacing and typography
- Hover effects and transitions

## Key Dependencies

- **React**: UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Tailwind CSS**: Utility-first CSS framework

## Environment Variables

Create a `.env` file if needed (optional):
```
VITE_API_URL=http://localhost:5000/api
```

## Error Handling

- API error messages are displayed to users
- Form validation prevents invalid submissions
- Unauthorized access redirects to login
- Role-based access is enforced on routes

## Deployment

The frontend can be deployed to:
- **Vercel** (recommended for Next.js, but works with React)
- **Netlify**
- **GitHub Pages**
- **Render**
- **AWS S3 + CloudFront**
- **Azure Static Web Apps**

### Deployment Steps

1. Build the project:
```bash
npm run build
```

2. The `dist` folder contains the production build
3. Deploy the `dist` folder to your hosting provider

## License

MIT
