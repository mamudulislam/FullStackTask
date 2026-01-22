import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ORSForm from './pages/ORSForm';
import ORSDetail from './pages/ORSDetail';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ors/create"
            element={
              <ProtectedRoute requiredRoles={['admin', 'inspector']}>
                <ORSForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ors/:id"
            element={
              <ProtectedRoute>
                <ORSDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ors/:id/edit"
            element={
              <ProtectedRoute requiredRoles={['admin', 'inspector']}>
                <ORSForm />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
