import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { orsAPI } from '../api';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await orsAPI.getAllPlans();
      setPlans(response.data.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching plans');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await orsAPI.deletePlan(id);
        setPlans(plans.filter((plan) => plan._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting plan');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getScoreColor = (score) => {
    if (score === 'A') return { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-500' };
    if (score === 'B') return { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-500' };
    if (score === 'C') return { bg: 'bg-yellow-100', text: 'text-yellow-700', badge: 'bg-yellow-500' };
    if (score === 'D') return { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'bg-orange-500' };
    return { bg: 'bg-red-100', text: 'text-red-700', badge: 'bg-red-500' };
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return '⚙️';
      case 'inspector':
        return '✏️';
      case 'viewer':
        return '👁️';
      default:
        return '👤';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="text-3xl">📋</div>
                <div>
                  <h1 className="text-3xl font-bold">ORS Dashboard</h1>
                  <p className="text-blue-100 text-sm mt-1">
                    Welcome back, <strong>{user?.username}</strong> {getRoleIcon(user?.role)}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-2 px-6 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Logout →
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 sm:px-8 lg:px-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Plans</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{plans.length}</p>
              </div>
              <div className="text-4xl opacity-30">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Your Role</p>
                <p className="text-2xl font-bold text-green-600 mt-2 capitalize">{user?.role}</p>
              </div>
              <div className="text-4xl">{getRoleIcon(user?.role)}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Actions Available</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">
                  {user?.role === 'admin' ? '✏️ Edit/Delete' : user?.role === 'inspector' ? '✏️ Create/Edit' : '👁️ View Only'}
                </p>
              </div>
              <div className="text-4xl opacity-30">🔐</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {(user?.role === 'admin' || user?.role === 'inspector') && (
          <div className="mb-8">
            <Link
              to="/ors/create"
              className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <span className="text-xl mr-2">➕</span>
              Create New ORS Plan
            </Link>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 mb-6 rounded-r-lg shadow-md">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block">
              <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-600 text-lg mt-4">Loading ORS plans...</p>
          </div>
        )}

        {/* Plans Grid */}
        {!loading && plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const scoreColor = getScoreColor(plan.overallTrafficScore);
              return (
                <div
                  key={plan._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105 overflow-hidden"
                >
                  {/* Card Header with Score */}
                  <div className={`${scoreColor.bg} p-6`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{plan.vehicle}</h3>
                      <span className={`${scoreColor.badge} text-white font-bold px-4 py-2 rounded-full text-lg`}>
                        {plan.overallTrafficScore}
                      </span>
                    </div>
                    <p className="text-gray-700 font-semibold text-sm">{plan.roadWorthinessScore}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-gray-600 text-xs uppercase tracking-wide font-semibold">Action Required</p>
                      <p className="text-gray-800 font-medium mt-1">{plan.actionRequired || '✅ None'}</p>
                    </div>

                    {plan.documents && plan.documents.length > 0 && (
                      <div className="mb-4">
                        <p className="text-gray-600 text-xs uppercase tracking-wide font-semibold">Documents</p>
                        <p className="text-blue-600 font-medium mt-1">📄 {plan.documents.length} document(s)</p>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="text-xs text-gray-500 mb-6 pb-6 border-b border-gray-200">
                      <p>Created by: <strong>{plan.createdBy?.username}</strong></p>
                      <p className="mt-1">
                        {plan.createdAt && new Date(plan.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        to={`/ors/${plan._id}`}
                        className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition transform hover:scale-105 active:scale-95"
                      >
                        👁️ View
                      </Link>
                      {(user?.role === 'admin' || user?.role === 'inspector') && (
                        <>
                          <Link
                            to={`/ors/${plan._id}/edit`}
                            className="flex-1 text-center bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition transform hover:scale-105 active:scale-95"
                          >
                            ✏️ Edit
                          </Link>
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => handleDelete(plan._id)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition transform hover:scale-105 active:scale-95"
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-600 text-lg font-semibold">No ORS plans found</p>
              {user?.role === 'viewer' ? (
                <p className="text-gray-500 mt-2">No ORS plans are currently available for viewing.</p>
              ) : (
                <p className="text-gray-500 mt-2">Start by creating your first ORS plan</p>
              )}
            </div>
          )
        )}
      </main>
    </div>
  );
}
