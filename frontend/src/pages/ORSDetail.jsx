import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orsAPI } from '../api';
import { useAuth } from '../context/AuthContext';

export default function ORSDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    try {
      const response = await orsAPI.getPlan(id);
      setPlan(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      try {
        await orsAPI.deletePlan(id);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting plan');
      }
    }
  };

  const getScoreColor = (score) => {
    if (score === 'A') return { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-500', icon: '🟢' };
    if (score === 'B') return { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-500', icon: '🔵' };
    if (score === 'C') return { bg: 'bg-yellow-100', text: 'text-yellow-700', badge: 'bg-yellow-500', icon: '🟡' };
    if (score === 'D') return { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'bg-orange-500', icon: '🟠' };
    return { bg: 'bg-red-100', text: 'text-red-700', badge: 'bg-red-500', icon: '🔴' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 mt-4 font-semibold">Loading plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-gray-600 text-lg font-semibold">Plan not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-6 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const scoreColor = getScoreColor(plan.overallTrafficScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className={`${scoreColor.bg} px-8 py-12 relative overflow-hidden`}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">🚗</div>
                  <h1 className="text-4xl font-bold text-gray-800">{plan.vehicle}</h1>
                </div>
                <span className={`${scoreColor.badge} text-white font-bold px-6 py-3 rounded-full text-3xl shadow-lg`}>
                  {scoreColor.icon} {plan.overallTrafficScore}
                </span>
              </div>
              <p className="text-gray-700 font-semibold text-lg">{plan.roadWorthinessScore}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 mx-8 mt-6 rounded-r-lg">
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          <div className="p-8">
            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                <p className="text-gray-600 text-sm font-semibold uppercase">Road Worthiness</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{plan.roadWorthinessScore}</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-500">
                <p className="text-gray-600 text-sm font-semibold uppercase">Overall Score</p>
                <p className={`text-3xl font-bold mt-2 ${scoreColor.text}`}>
                  {scoreColor.icon} Grade {plan.overallTrafficScore}
                </p>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-500 md:col-span-2">
                <p className="text-gray-600 text-sm font-semibold uppercase">Action Required</p>
                <p className="text-xl font-bold text-red-600 mt-2">
                  {plan.actionRequired ? `⚠️ ${plan.actionRequired}` : '✅ None - Plan is Good'}
                </p>
              </div>
            </div>

            {/* Documents Section */}
            {plan.documents && plan.documents.length > 0 && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="text-3xl">📄</span> Documents
                </h2>

                <div className="space-y-6">
                  {plan.documents.map((doc, docIndex) => (
                    <div key={docIndex} className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Doc {docIndex + 1}</span>
                      </h3>

                      {/* Text Docs */}
                      {doc.textDocs && doc.textDocs.length > 0 && (
                        <div className="space-y-4 mb-4">
                          {doc.textDocs.map((textDoc, textDocIndex) => (
                            <div
                              key={textDocIndex}
                              className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-md transition"
                            >
                              <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                                {textDoc.label}
                              </h4>
                              <p className="text-gray-600 mt-2">{textDoc.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Attachments */}
                      {doc.attachments && doc.attachments.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-300">
                          <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span>📎 Attachments</span>
                            <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded-full text-xs">
                              {doc.attachments.length}
                            </span>
                          </p>
                          <ul className="space-y-2">
                            {doc.attachments.map((attachment, attachIndex) => (
                              <li key={attachIndex} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer">
                                <span>📁</span>
                                <span className="font-medium">{attachment}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">ℹ️</span> Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 font-semibold">Created by</p>
                  <p className="text-gray-800 font-bold mt-1">{plan.createdBy?.username || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Assigned to</p>
                  <p className="text-gray-800 font-bold mt-1">{plan.assignedTo?.username || 'Unassigned'}</p>
                </div>
                {plan.createdAt && (
                  <div>
                    <p className="text-gray-600 font-semibold">Created</p>
                    <p className="text-gray-800 font-bold mt-1">{new Date(plan.createdAt).toLocaleDateString()}</p>
                  </div>
                )}
                {plan.updatedAt && (
                  <div>
                    <p className="text-gray-600 font-semibold">Last Updated</p>
                    <p className="text-gray-800 font-bold mt-1">{new Date(plan.updatedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {(user?.role === 'admin' || user?.role === 'inspector') && (
                <>
                  <button
                    onClick={() => navigate(`/ors/${id}/edit`)}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>✏️</span> Edit
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={handleDelete}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>🗑️</span> Delete
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
