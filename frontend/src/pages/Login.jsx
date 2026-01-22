import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white text-center">
            <div className="text-5xl mb-4">📋</div>
            <h1 className="text-3xl font-bold">ORS Tracker</h1>
            <p className="text-blue-100 mt-2 text-sm">Operational Roadworthiness Score Management</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
                <p className="font-semibold text-sm">Login Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  placeholder="admin@test.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Login to Dashboard'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold">
                  Register Now
                </Link>
              </p>
            </div>
          </div>

          {/* Demo Credentials Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <p className="text-xs font-bold text-gray-600 uppercase mb-3">🔐 Demo Credentials</p>
            <div className="space-y-2">
              <div className="text-xs text-gray-700 p-2 bg-white rounded border-l-2 border-green-500">
                <span className="font-semibold text-green-700">Admin:</span> admin@test.com / admin123
              </div>
              <div className="text-xs text-gray-700 p-2 bg-white rounded border-l-2 border-blue-500">
                <span className="font-semibold text-blue-700">Inspector:</span> inspector@test.com / inspector123
              </div>
              <div className="text-xs text-gray-700 p-2 bg-white rounded border-l-2 border-purple-500">
                <span className="font-semibold text-purple-700">Viewer:</span> viewer@test.com / viewer123
              </div>
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
