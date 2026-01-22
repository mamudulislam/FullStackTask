import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'viewer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.role
    );
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'border-red-500 bg-red-50';
      case 'inspector':
        return 'border-blue-500 bg-blue-50';
      case 'viewer':
        return 'border-purple-500 bg-purple-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const roleDescriptions = {
    viewer: '👁️ View ORS plans only',
    inspector: '✏️ Create & edit own plans',
    admin: '⚙️ Full control',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-12 text-white text-center">
            <div className="text-5xl mb-4">✨</div>
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-green-100 mt-2 text-sm">Join the ORS Management System</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
                <p className="font-semibold text-sm">Registration Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                  placeholder="john_doe"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                  Select Your Role
                </label>
                <div className="space-y-2">
                  {['viewer', 'inspector', 'admin'].map((role) => (
                    <label
                      key={role}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                        formData.role === role
                          ? getRoleColor(role)
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={formData.role === role}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <span className="ml-3 font-medium capitalize text-sm">
                        {roleDescriptions[role]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg mt-6"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-green-600 hover:text-green-700 font-bold">
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-xs mt-6 opacity-80">
          © 2026 ORS Tracker. All rights reserved.
        </p>
      </div>
    </div>
  );
}
