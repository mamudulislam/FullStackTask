import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orsAPI } from '../api';

export default function ORSForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    vehicle: '',
    roadWorthinessScore: '',
    overallTrafficScore: 'A',
    actionRequired: '',
    documents: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageLoading, setPageLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      fetchPlan();
    }
  }, [id, isEditing]);

  const fetchPlan = async () => {
    try {
      const response = await orsAPI.getPlan(id);
      setFormData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching plan');
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addDocument = () => {
    setFormData({
      ...formData,
      documents: [...formData.documents, { textDocs: [], attachments: [] }],
    });
  };

  const removeDocument = (index) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index),
    });
  };

  const addTextDoc = (docIndex) => {
    const newDocuments = [...formData.documents];
    newDocuments[docIndex].textDocs = [
      ...newDocuments[docIndex].textDocs,
      { label: '', description: '' },
    ];
    setFormData({ ...formData, documents: newDocuments });
  };

  const removeTextDoc = (docIndex, textDocIndex) => {
    const newDocuments = [...formData.documents];
    newDocuments[docIndex].textDocs = newDocuments[docIndex].textDocs.filter(
      (_, i) => i !== textDocIndex
    );
    setFormData({ ...formData, documents: newDocuments });
  };

  const updateTextDoc = (docIndex, textDocIndex, field, value) => {
    const newDocuments = [...formData.documents];
    newDocuments[docIndex].textDocs[textDocIndex][field] = value;
    setFormData({ ...formData, documents: newDocuments });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        await orsAPI.updatePlan(id, formData);
      } else {
        await orsAPI.createPlan(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving plan');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Page Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
            <div className="text-4xl mb-4">{isEditing ? '✏️' : '➕'}</div>
            <h1 className="text-3xl font-bold">{isEditing ? 'Edit ORS Plan' : 'Create New ORS Plan'}</h1>
            <p className="text-blue-100 mt-2">Fill in all required fields to proceed</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r">
                <p className="font-semibold text-sm">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="text-2xl">🚗</span> Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                      Vehicle Name *
                    </label>
                    <input
                      type="text"
                      name="vehicle"
                      value={formData.vehicle}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      placeholder="e.g., Truck-12"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                      Road Worthiness Score *
                    </label>
                    <input
                      type="text"
                      name="roadWorthinessScore"
                      value={formData.roadWorthinessScore}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      placeholder="e.g., 78%"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                      Overall Traffic Score *
                    </label>
                    <select
                      name="overallTrafficScore"
                      value={formData.overallTrafficScore}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                    >
                      <option value="A">🟢 A (Excellent)</option>
                      <option value="B">🔵 B (Good)</option>
                      <option value="C">🟡 C (Fair)</option>
                      <option value="D">🟠 D (Poor)</option>
                      <option value="F">🔴 F (Critical)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm uppercase tracking-wide">
                      Action Required
                    </label>
                    <input
                      type="text"
                      name="actionRequired"
                      value={formData.actionRequired}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      placeholder="e.g., Replace worn brake pads"
                    />
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="border-t pt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="text-2xl">📄</span> Documents
                </h2>

                {formData.documents.map((doc, docIndex) => (
                  <div key={docIndex} className="mb-6 p-6 border-2 border-gray-200 rounded-xl bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Doc {docIndex + 1}</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeDocument(docIndex)}
                        className="text-red-600 hover:text-red-700 font-semibold text-sm"
                      >
                        🗑️ Remove
                      </button>
                    </div>

                    {/* Text Docs */}
                    <div className="space-y-3 mb-4">
                      {doc.textDocs?.map((textDoc, textDocIndex) => (
                        <div key={textDocIndex} className="p-4 bg-white rounded-lg border-l-4 border-blue-500">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-medium text-gray-700 text-sm">Item {textDocIndex + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeTextDoc(docIndex, textDocIndex)}
                              className="text-red-500 hover:text-red-700 text-sm font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={textDoc.label}
                              onChange={(e) =>
                                updateTextDoc(docIndex, textDocIndex, 'label', e.target.value)
                              }
                              placeholder="Label"
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                            />
                            <input
                              type="text"
                              value={textDoc.description}
                              onChange={(e) =>
                                updateTextDoc(docIndex, textDocIndex, 'description', e.target.value)
                              }
                              placeholder="Description"
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => addTextDoc(docIndex)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition transform hover:scale-105 active:scale-95"
                    >
                      + Add Text Document
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addDocument}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  + Add Document
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-8 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    isEditing ? '✅ Update Plan' : '✅ Create Plan'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
