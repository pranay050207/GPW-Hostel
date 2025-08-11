import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';

// Create Auth Context
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// API utility functions
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

// Login Component
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const payload = isLogin ? 
        { email: formData.email, password: formData.password } :
        formData;

      const response = await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      login(response.user, response.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Hostel Manager</h1>
          <p className="text-gray-600 mt-2">Modern Dorm Management System</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
};

// File Upload Component
const FileUploadComponent = ({ fileType, uploadedFile, onUpload, uploadProgress, accept }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleFileSelect = async (file) => {
    if (file) {
      try {
        await onUpload(file, fileType);
      } catch (err) {
        alert(`Failed to upload ${fileType}: ${err.message}`);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const renderProgress = () => {
    if (uploadProgress === undefined) return null;
    if (uploadProgress === -1) {
      return (
        <div className="mt-2 flex items-center text-red-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-sm">Upload failed</span>
        </div>
      );
    }
    if (uploadProgress === 100) {
      return (
        <div className="mt-2 flex items-center text-green-600">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm">Upload complete</span>
        </div>
      );
    }
    return (
      <div className="mt-2">
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600">{uploadProgress}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : uploadedFile
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files[0])}
          className="hidden"
        />
        
        {uploadedFile ? (
          <div className="flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-left">
              <p className="text-sm font-medium text-green-800">File uploaded</p>
              <p className="text-xs text-green-600">{uploadedFile}</p>
            </div>
          </div>
        ) : (
          <div>
            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600">
              Drop file here or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept.replace(/\./g, '').toUpperCase()} files only (Max 5MB)
            </p>
          </div>
        )}
      </div>
      {renderProgress()}
    </div>
  );
};

// Student Dashboard
const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('room');
  const [roomInfo, setRoomInfo] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [payments, setPayments] = useState([]);
  const [messMenu, setMessMenu] = useState([]);
  const [renewalForms, setRenewalForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: 'maintenance'
  });
  const [currentRenewalForm, setCurrentRenewalForm] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const { user, logout } = useAuth();

  useEffect(() => {
    if (activeTab === 'room') loadRoomInfo();
    else if (activeTab === 'complaints') loadComplaints();
    else if (activeTab === 'payments') loadPayments();
    else if (activeTab === 'renewal') loadRenewalForms();
    else if (activeTab === 'mess') loadMessMenu();
  }, [activeTab]);

  const loadRoomInfo = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/my-room');
      setRoomInfo(response.room);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/complaints');
      setComplaints(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/payments');
      setPayments(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessMenu = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/mess-menu');
      setMessMenu(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRenewalForms = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/renewal-forms');
      setRenewalForms(response);
      // Load the current pending form if exists
      const pendingForm = response.find(form => ['submitted', 'under_review'].includes(form.status));
      setCurrentRenewalForm(pendingForm || null);
      if (pendingForm) {
        setUploadedFiles(pendingForm.files || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file, fileType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);

    setUploadProgress(prev => ({ ...prev, [fileType]: 0 }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/upload-file`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      
      // Update uploaded files
      const newUploadedFiles = { ...uploadedFiles, [fileType]: result.filename };
      setUploadedFiles(newUploadedFiles);
      
      // Update current renewal form or create new one
      if (currentRenewalForm) {
        await apiCall(`/api/renewal-forms/${currentRenewalForm.id}/files`, {
          method: 'PUT',
          body: JSON.stringify(newUploadedFiles),
        });
      }

      setUploadProgress(prev => ({ ...prev, [fileType]: 100 }));
      
      return result;
    } catch (err) {
      setUploadProgress(prev => ({ ...prev, [fileType]: -1 }));
      throw err;
    }
  };

  const submitRenewalForm = async () => {
    try {
      if (Object.keys(uploadedFiles).length === 0) {
        alert('Please upload at least one document');
        return;
      }

      if (currentRenewalForm) {
        // Update existing form
        await apiCall(`/api/renewal-forms/${currentRenewalForm.id}/files`, {
          method: 'PUT',
          body: JSON.stringify(uploadedFiles),
        });
        alert('Renewal form updated successfully!');
      } else {
        // Create new form
        await apiCall('/api/renewal-forms', {
          method: 'POST',
          body: JSON.stringify({ files: uploadedFiles }),
        });
        alert('Renewal form submitted successfully!');
      }
      
      loadRenewalForms();
    } catch (err) {
      alert(err.message);
    }
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    try {
      await apiCall('/api/complaints', {
        method: 'POST',
        body: JSON.stringify(newComplaint),
      });
      setNewComplaint({ title: '', description: '', category: 'maintenance' });
      loadComplaints();
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const menuTabs = [
    { id: 'room', name: 'My Room', icon: '🏠' },
    { id: 'complaints', name: 'Complaints', icon: '📝' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'renewal', name: 'Renewal', icon: '🔄' },
    { id: 'mess', name: 'Mess Menu', icon: '🍽️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Welcome, {user.name}</h1>
              <p className="text-sm text-gray-500">Student Dashboard</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {menuTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}

          {/* Room Tab */}
          {activeTab === 'room' && !loading && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Room Information</h2>
              {roomInfo ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Room Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Room Number:</span> {roomInfo.room_number}</p>
                      <p><span className="font-medium">Type:</span> {roomInfo.room_type}</p>
                      <p><span className="font-medium">Floor:</span> {roomInfo.floor}</p>
                      <p><span className="font-medium">Capacity:</span> {roomInfo.capacity}</p>
                      <p><span className="font-medium">Currently Occupied:</span> {roomInfo.occupied}</p>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Roommates</h3>
                    {roomInfo.roommates && roomInfo.roommates.length > 0 ? (
                      <div className="space-y-2">
                        {roomInfo.roommates.map((roommate, index) => (
                          <div key={index} className="text-sm">
                            <p className="font-medium">{roommate.name}</p>
                            <p className="text-gray-600">{roommate.email}</p>
                            {roommate.phone && <p className="text-gray-600">{roommate.phone}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm">No roommates</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <svg className="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-yellow-800 font-medium">No Room Assigned</p>
                    <p className="text-yellow-700 text-sm mt-1">Please contact the admin to assign you a room.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && !loading && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Complaints</h2>
              </div>

              {/* Submit New Complaint */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-3">Submit New Complaint</h3>
                <form onSubmit={submitComplaint} className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Complaint Title"
                      required
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newComplaint.title}
                      onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                    />
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newComplaint.category}
                      onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                    >
                      <option value="maintenance">Maintenance</option>
                      <option value="cleanliness">Cleanliness</option>
                      <option value="electrical">Electrical</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Describe your complaint in detail..."
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Submit Complaint
                  </button>
                </form>
              </div>

              {/* Complaints List */}
              <div className="space-y-4">
                {complaints.length > 0 ? (
                  complaints.map((complaint) => (
                    <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{complaint.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                          {complaint.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{complaint.description}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Category: {complaint.category}</span>
                        <span>Room: {complaint.room_number}</span>
                        <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No complaints submitted yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && !loading && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Payment Status</h2>
              <div className="space-y-4">
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{payment.payment_type.replace('_', ' ').toUpperCase()}</h4>
                          <p className="text-sm text-gray-600">{payment.month} {payment.year}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">₹{payment.amount}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Due: {new Date(payment.due_date).toLocaleDateString()}</span>
                        {payment.paid_date && <span>Paid: {new Date(payment.paid_date).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No payment records found.</p>
                )}
              </div>
            </div>
          )}

          {/* Renewal Tab */}
          {activeTab === 'renewal' && !loading && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Room Renewal Application</h2>
              
              {/* Check if user has room */}
              {!roomInfo ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-yellow-800 font-medium">No Room Assigned</p>
                  <p className="text-yellow-700 text-sm mt-1">You must be assigned to a room to submit a renewal form.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Status */}
                  {currentRenewalForm && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-blue-900">Current Application Status</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentRenewalForm.status)}`}>
                          {currentRenewalForm.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-blue-800 text-sm">Submitted: {new Date(currentRenewalForm.created_at).toLocaleDateString()}</p>
                      {currentRenewalForm.admin_comments && (
                        <div className="mt-3 p-3 bg-white rounded border">
                          <p className="text-sm font-medium text-gray-700">Admin Comments:</p>
                          <p className="text-sm text-gray-600 mt-1">{currentRenewalForm.admin_comments}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* File Upload Section */}
                  {(!currentRenewalForm || ['submitted', 'under_review'].includes(currentRenewalForm?.status)) && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold mb-4">
                        {currentRenewalForm ? 'Update Documents' : 'Upload Required Documents'}
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Aadhar Card */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Aadhar Card <span className="text-red-500">*</span>
                          </label>
                          <FileUploadComponent 
                            fileType="aadhar"
                            uploadedFile={uploadedFiles.aadhar}
                            onUpload={uploadFile}
                            uploadProgress={uploadProgress.aadhar}
                            accept=".jpg,.jpeg,.png,.pdf"
                          />
                        </div>

                        {/* Previous Semester Result */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Previous Semester Result <span className="text-red-500">*</span>
                          </label>
                          <FileUploadComponent 
                            fileType="result"
                            uploadedFile={uploadedFiles.result}
                            onUpload={uploadFile}
                            uploadProgress={uploadProgress.result}
                            accept=".jpg,.jpeg,.png,.pdf"
                          />
                        </div>

                        {/* Caste Certificate */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Caste Certificate (if applicable)
                          </label>
                          <FileUploadComponent 
                            fileType="caste_cert"
                            uploadedFile={uploadedFiles.caste_cert}
                            onUpload={uploadFile}
                            uploadProgress={uploadProgress.caste_cert}
                            accept=".jpg,.jpeg,.png,.pdf"
                          />
                        </div>

                        {/* Passport Size Photo */}
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Passport Size Photo <span className="text-red-500">*</span>
                          </label>
                          <FileUploadComponent 
                            fileType="photo"
                            uploadedFile={uploadedFiles.photo}
                            onUpload={uploadFile}
                            uploadProgress={uploadProgress.photo}
                            accept=".jpg,.jpeg,.png"
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={submitRenewalForm}
                          disabled={Object.keys(uploadedFiles).length === 0}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {currentRenewalForm ? 'Update Application' : 'Submit Renewal Application'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Application History */}
                  {renewalForms.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4">Application History</h3>
                      <div className="space-y-3">
                        {renewalForms.map((form) => (
                          <div key={form.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-sm text-gray-600">Room: {form.room_number}</p>
                                <p className="text-sm text-gray-500">Submitted: {new Date(form.created_at).toLocaleDateString()}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}>
                                {form.status.replace('_', ' ')}
                              </span>
                            </div>
                            {form.admin_comments && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                <p className="font-medium text-gray-700">Admin Comments:</p>
                                <p className="text-gray-600">{form.admin_comments}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Renewals Tab */}
          {activeTab === 'renewals' && !loading && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Room Renewal Applications</h2>
              
              {renewals.length > 0 ? (
                <div className="space-y-6">
                  {/* Filter buttons */}
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => setRenewals(renewals)} 
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                    >
                      All ({renewals.length})
                    </button>
                    <button 
                      onClick={() => setRenewals(renewals.filter(r => r.status === 'submitted'))} 
                      className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium"
                    >
                      Pending ({renewals.filter(r => r.status === 'submitted').length})
                    </button>
                    <button 
                      onClick={() => setRenewals(renewals.filter(r => r.status === 'under_review'))} 
                      className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium"
                    >
                      Under Review ({renewals.filter(r => r.status === 'under_review').length})
                    </button>
                  </div>

                  {/* Renewal applications */}
                  <div className="grid gap-6">
                    {renewals.map((renewal) => (
                      <div key={renewal.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{renewal.student_name}</h3>
                            <p className="text-sm text-gray-600">Room: {renewal.room_number}</p>
                            <p className="text-sm text-gray-500">Submitted: {new Date(renewal.created_at).toLocaleDateString()}</p>
                            {renewal.updated_at !== renewal.created_at && (
                              <p className="text-sm text-gray-500">Updated: {new Date(renewal.updated_at).toLocaleDateString()}</p>
                            )}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(renewal.status)}`}>
                            {renewal.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>

                        {/* Documents section */}
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-700 mb-2">Uploaded Documents:</h4>
                          <div className="grid md:grid-cols-2 gap-3">
                            {Object.entries(renewal.files || {}).map(([fileType, filename]) => (
                              <div key={fileType} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span className="text-sm font-medium capitalize">
                                    {fileType.replace('_', ' ')}
                                  </span>
                                </div>
                                <a
                                  href={`${API_BASE_URL}/api/download-file/${renewal.student_id}/${filename}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  View
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Admin actions */}
                        {['submitted', 'under_review'].includes(renewal.status) && (
                          <div className="border-t pt-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                              <button
                                onClick={() => updateRenewalStatus(renewal.id, 'under_review')}
                                disabled={renewal.status === 'under_review'}
                                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Mark Under Review
                              </button>
                              <button
                                onClick={() => {
                                  const comments = prompt('Approval comments (optional):');
                                  updateRenewalStatus(renewal.id, 'approved', comments || '');
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  const comments = prompt('Rejection reason (optional):');
                                  updateRenewalStatus(renewal.id, 'rejected', comments || '');
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Admin comments */}
                        {renewal.admin_comments && (
                          <div className="mt-4 p-3 bg-blue-50 rounded border">
                            <p className="text-sm font-medium text-blue-900">Admin Comments:</p>
                            <p className="text-sm text-blue-800 mt-1">{renewal.admin_comments}</p>
                            {renewal.reviewed_at && (
                              <p className="text-xs text-blue-600 mt-1">
                                Reviewed on: {new Date(renewal.reviewed_at).toLocaleDateString()}
                                {renewal.reviewed_by && ` by ${renewal.reviewed_by}`}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 font-medium">No renewal applications found</p>
                  <p className="text-gray-400 text-sm">Renewal applications will appear here when students submit them.</p>
                </div>
              )}
            </div>
          )}

          {/* Mess Menu Tab */}
          {activeTab === 'mess' && !loading && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Weekly Mess Menu</h2>
              {messMenu.length > 0 ? (
                <div className="grid gap-4">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                    const dayMenu = messMenu.filter(menu => menu.day === day);
                    return (
                      <div key={day} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium text-lg capitalize mb-3">{day}</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          {['breakfast', 'lunch', 'dinner'].map((meal) => {
                            const mealMenu = dayMenu.find(m => m.meal_type === meal);
                            return (
                              <div key={meal} className="bg-gray-50 rounded-md p-3">
                                <h4 className="font-medium capitalize mb-2">{meal}</h4>
                                {mealMenu ? (
                                  <ul className="text-sm text-gray-600 space-y-1">
                                    {mealMenu.items.map((item, index) => (
                                      <li key={index}>• {item}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-gray-500">Not available</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No mess menu available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [payments, setPayments] = useState([]);
  const [renewals, setRenewals] = useState([]);
  const [messMenu, setMessMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  const [newRoom, setNewRoom] = useState({
    room_number: '',
    capacity: 2,
    room_type: 'double',
    floor: '1'
  });

  const [newPayment, setNewPayment] = useState({
    student_id: '',
    amount: '',
    month: '',
    year: new Date().getFullYear().toString(),
    payment_type: 'hostel_fee',
    due_date: ''
  });

  const [newMessMenu, setNewMessMenu] = useState({
    day: 'monday',
    meal_type: 'breakfast',
    items: []
  });

  const [menuItem, setMenuItem] = useState('');

  useEffect(() => {
    if (activeTab === 'rooms') loadRooms();
    else if (activeTab === 'students') loadStudents();
    else if (activeTab === 'complaints') loadComplaints();
    else if (activeTab === 'payments') loadPayments();
    else if (activeTab === 'renewals') loadRenewals();
    else if (activeTab === 'mess') loadMessMenu();
  }, [activeTab]);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/rooms');
      setRooms(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/students');
      setStudents(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/complaints');
      setComplaints(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/payments');
      setPayments(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessMenu = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/mess-menu');
      setMessMenu(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRenewals = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/renewal-forms');
      setRenewals(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateRenewalStatus = async (renewalId, status, adminComments = '') => {
    try {
      await apiCall(`/api/renewal-forms/${renewalId}`, {
        method: 'PUT',
        body: JSON.stringify({ status, admin_comments: adminComments }),
      });
      loadRenewals();
    } catch (err) {
      alert(err.message);
    }
  };

  const createRoom = async (e) => {
    e.preventDefault();
    try {
      await apiCall('/api/rooms', {
        method: 'POST',
        body: JSON.stringify(newRoom),
      });
      setNewRoom({ room_number: '', capacity: 2, room_type: 'double', floor: '1' });
      loadRooms();
    } catch (err) {
      alert(err.message);
    }
  };

  const assignRoom = async (roomNumber, studentId) => {
    try {
      await apiCall(`/api/rooms/${roomNumber}/assign/${studentId}`, {
        method: 'PUT',
      });
      loadRooms();
      loadStudents();
    } catch (err) {
      alert(err.message);
    }
  };

  const updateComplaintStatus = async (complaintId, status) => {
    try {
      await apiCall(`/api/complaints/${complaintId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      loadComplaints();
    } catch (err) {
      alert(err.message);
    }
  };

  const createPayment = async (e) => {
    e.preventDefault();
    try {
      await apiCall('/api/payments', {
        method: 'POST',
        body: JSON.stringify({ ...newPayment, amount: parseFloat(newPayment.amount) }),
      });
      setNewPayment({
        student_id: '',
        amount: '',
        month: '',
        year: new Date().getFullYear().toString(),
        payment_type: 'hostel_fee',
        due_date: ''
      });
      loadPayments();
    } catch (err) {
      alert(err.message);
    }
  };

  const markPaymentPaid = async (paymentId) => {
    try {
      await apiCall(`/api/payments/${paymentId}/mark-paid`, {
        method: 'PUT',
      });
      loadPayments();
    } catch (err) {
      alert(err.message);
    }
  };

  const addMenuItem = () => {
    if (menuItem.trim()) {
      setNewMessMenu({
        ...newMessMenu,
        items: [...newMessMenu.items, menuItem.trim()]
      });
      setMenuItem('');
    }
  };

  const removeMenuItem = (index) => {
    const updatedItems = newMessMenu.items.filter((_, i) => i !== index);
    setNewMessMenu({ ...newMessMenu, items: updatedItems });
  };

  const saveMessMenu = async () => {
    if (newMessMenu.items.length === 0) {
      alert('Please add at least one menu item');
      return;
    }

    try {
      await apiCall('/api/mess-menu', {
        method: 'POST',
        body: JSON.stringify(newMessMenu),
      });
      setNewMessMenu({
        day: 'monday',
        meal_type: 'breakfast',
        items: []
      });
      loadMessMenu();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteMessMenu = async (menuId) => {
    try {
      await apiCall(`/api/mess-menu/${menuId}`, {
        method: 'DELETE',
      });
      loadMessMenu();
    } catch (err) {
      alert(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'available': return 'bg-green-100 text-green-800';
      case 'full': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const adminTabs = [
    { id: 'rooms', name: 'Rooms', icon: '🏠' },
    { id: 'students', name: 'Students', icon: '👥' },
    { id: 'complaints', name: 'Complaints', icon: '📝' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'renewals', name: 'Renewals', icon: '🔄' },
    { id: 'mess', name: 'Mess Menu', icon: '🍽️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Welcome, {user.name}</h1>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {adminTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}

          {/* Rooms Tab */}
          {activeTab === 'rooms' && !loading && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Room Management</h2>
              </div>

              {/* Add New Room */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-3">Add New Room</h3>
                <form onSubmit={createRoom} className="grid md:grid-cols-5 gap-3">
                  <input
                    type="text"
                    placeholder="Room Number"
                    required
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={newRoom.room_number}
                    onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
                  />
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={newRoom.capacity}
                    onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                  >
                    <option value={1}>1 Person</option>
                    <option value={2}>2 People</option>
                    <option value={3}>3 People</option>
                    <option value={4}>4 People</option>
                  </select>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={newRoom.room_type}
                    onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value })}
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                    <option value="quad">Quad</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Floor"
                    required
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={newRoom.floor}
                    onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Room
                  </button>
                </form>
              </div>

              {/* Rooms Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <div key={room.room_number} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-lg">Room {room.room_number}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <p>Type: {room.room_type}</p>
                      <p>Floor: {room.floor}</p>
                      <p>Occupancy: {room.occupied}/{room.capacity}</p>
                    </div>
                    {room.students.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Students:</p>
                        {room.students.map((studentId) => {
                          const student = students.find(s => s.id === studentId);
                          return student ? (
                            <p key={studentId} className="text-gray-600">{student.name}</p>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && !loading && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Student Management</h2>
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{student.name}</h4>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        {student.phone && <p className="text-sm text-gray-600">{student.phone}</p>}
                        <p className="text-sm text-gray-600">
                          Room: {student.room_number || 'Not Assigned'}
                        </p>
                      </div>
                      {!student.room_number && rooms.some(room => room.occupied < room.capacity) && (
                        <div className="flex flex-col gap-2">
                          <select
                            onChange={(e) => e.target.value && assignRoom(e.target.value, student.id)}
                            className="text-sm px-3 py-1 border border-gray-300 rounded-md"
                            defaultValue=""
                          >
                            <option value="">Assign Room</option>
                            {rooms
                              .filter(room => room.occupied < room.capacity)
                              .map((room) => (
                                <option key={room.room_number} value={room.room_number}>
                                  Room {room.room_number} ({room.occupied}/{room.capacity})
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && !loading && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Maintenance Requests</h2>
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{complaint.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>Student: {complaint.student_name}</span>
                          <span>Room: {complaint.room_number}</span>
                          <span>Category: {complaint.category}</span>
                          <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                          {complaint.status.replace('_', ' ')}
                        </span>
                        <select
                          value={complaint.status}
                          onChange={(e) => updateComplaintStatus(complaint.id, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded-md"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && !loading && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Payment Management</h2>
              </div>

              {/* Add New Payment */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-3">Create Payment Record</h3>
                <form onSubmit={createPayment} className="grid md:grid-cols-6 gap-3">
                  <select
                    required
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={newPayment.student_id}
                    onChange={(e) => setNewPayment({ ...newPayment, student_id: e.target.value })}
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Amount"
                    required
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Month"
                    required
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={newPayment.month}
                    onChange={(e) => setNewPayment({ ...newPayment, month: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    required
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={newPayment.year}
                    onChange={(e) => setNewPayment({ ...newPayment, year: e.target.value })}
                  />
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={newPayment.payment_type}
                    onChange={(e) => setNewPayment({ ...newPayment, payment_type: e.target.value })}
                  >
                    <option value="hostel_fee">Hostel Fee</option>
                    <option value="mess_fee">Mess Fee</option>
                    <option value="security_deposit">Security Deposit</option>
                  </select>
                  <input
                    type="date"
                    required
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={newPayment.due_date}
                    onChange={(e) => setNewPayment({ ...newPayment, due_date: e.target.value })}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create
                  </button>
                </form>
              </div>

              {/* Payments List */}
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{payment.student_name}</h4>
                        <p className="text-sm text-gray-600">{payment.payment_type.replace('_', ' ').toUpperCase()}</p>
                        <p className="text-sm text-gray-600">{payment.month} {payment.year}</p>
                        <p className="font-medium">₹{payment.amount}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                        {payment.status !== 'paid' && (
                          <button
                            onClick={() => markPaymentPaid(payment.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700 transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                        <p className="text-xs text-gray-500">
                          Due: {new Date(payment.due_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mess Menu Tab */}
          {activeTab === 'mess' && !loading && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Mess Menu Management</h2>
              </div>

              {/* Add New Menu */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-3">Manage Menu</h3>
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={newMessMenu.day}
                    onChange={(e) => setNewMessMenu({ ...newMessMenu, day: e.target.value })}
                  >
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={newMessMenu.meal_type}
                    onChange={(e) => setNewMessMenu({ ...newMessMenu, meal_type: e.target.value })}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add menu item"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    value={menuItem}
                    onChange={(e) => setMenuItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addMenuItem()}
                  />
                  <button
                    type="button"
                    onClick={addMenuItem}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Add Item
                  </button>
                </div>

                {newMessMenu.items.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-2">Menu Items:</p>
                    <div className="flex flex-wrap gap-2">
                      {newMessMenu.items.map((item, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          {item}
                          <button
                            onClick={() => removeMenuItem(index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={saveMessMenu}
                  disabled={newMessMenu.items.length === 0}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Menu
                </button>
              </div>

              {/* Current Menu Display */}
              <div className="grid gap-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const dayMenu = messMenu.filter(menu => menu.day === day);
                  return (
                    <div key={day} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-lg capitalize mb-3">{day}</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {['breakfast', 'lunch', 'dinner'].map((meal) => {
                          const mealMenu = dayMenu.find(m => m.meal_type === meal);
                          return (
                            <div key={meal} className="bg-gray-50 rounded-md p-3">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium capitalize">{meal}</h4>
                                {mealMenu && (
                                  <button
                                    onClick={() => deleteMessMenu(mealMenu.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                              {mealMenu ? (
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {mealMenu.items.map((item, index) => (
                                    <li key={index}>• {item}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-500">Not set</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return user.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />;
}

const AppWithProvider = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithProvider;