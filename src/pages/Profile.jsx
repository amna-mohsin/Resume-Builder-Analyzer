import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Edit2, Save, X, CheckCircle, AlertCircle, Phone, Shield, Globe, Clock } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ 
    name: 'User', 
    email: '', 
    phone: '', 
    createdAt: '',
    role: 'Premium User',
    accountType: 'Professional'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  useEffect(() => {
    const getProfile = async () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const userSession = localStorage.getItem('userSession');
      
      if (isAuthenticated && userSession) {
        try {
          const user = JSON.parse(userSession);
          setUserData({
            name: user.name || 'User',
            email: user.email || '',
            phone: user.phone || '',
            createdAt: user.createdAt || new Date().toLocaleDateString(),
            role: 'Premium User',
            accountType: 'Professional'
          });
          setEditedName(user.name || 'User');
          setEditedPhone(user.phone || '');
          return;
        } catch (err) {
          console.error('Error parsing user session:', err);
        }
      }
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserData({
            name: user.user_metadata?.full_name || 'User',
            email: user.email || '',
            phone: user.user_metadata?.phone || '',
            createdAt: user.created_at ? new Date(user.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
            role: 'Premium User',
            accountType: 'Professional'
          });
          setEditedName(user.user_metadata?.full_name || 'User');
          setEditedPhone(user.user_metadata?.phone || '');
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Error fetching user from Supabase:', err);
        navigate('/login');
      }
    };
    
    getProfile();
  }, [navigate]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const userSession = localStorage.getItem('userSession');
      
      if (isAuthenticated && userSession) {
        const user = JSON.parse(userSession);
        const updatedUser = {
          ...user,
          name: editedName,
          phone: editedPhone
        };
        localStorage.setItem('userSession', JSON.stringify(updatedUser));
        
        setUserData(prev => ({ ...prev, name: editedName, phone: editedPhone }));
        setIsEditing(false);
        showToast('Profile updated successfully!', 'success');
        return;
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.auth.updateUser({
          data: { 
            full_name: editedName,
            phone: editedPhone
          }
        });
        
        if (error) throw error;
        
        setUserData(prev => ({ ...prev, name: editedName, phone: editedPhone }));
        setIsEditing(false);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sidebarGradient = 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)';
  const accentGradient = 'linear-gradient(135deg, #7AA1D2, #CC95C0, #DBD4B4)';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans overflow-hidden">
      {/* SIDEBAR - Hidden on mobile, visible on desktop */}
      <div className="hidden md:flex md:w-72 lg:w-80 fixed inset-y-0 left-0 text-white flex-col shadow-2xl z-20 transition-all duration-300" style={{ background: sidebarGradient }}>
        <div className="p-8 flex items-center gap-4 border-b border-white/10">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform" style={{ background: accentGradient }}>
            <User size={22} className="text-white" />
          </div>
          <div>
            <span className="font-black tracking-tighter text-xl lg:text-2xl uppercase italic">ResumeAI+</span>
            <p className="text-xs text-white/60 mt-1 font-medium">Professional Profile</p>
          </div>
        </div>
        
        <div className="flex-1 px-6 py-8">
          <div className="bg-white/5 rounded-2xl p-6 mb-8 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-white text-lg">{userData.name.split(' ')[0]}</p>
                <p className="text-sm text-white/70 font-medium">Profile View</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/80">
                <Shield size={16} />
                <span className="text-sm font-medium">{userData.role}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Globe size={16} />
                <span className="text-sm font-medium">{userData.accountType} Account</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-white/10">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all bg-white/5 hover:bg-white/10 text-white/80 hover:text-white group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-base">Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-30 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">Back</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {userData.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm">{userData.name.split(' ')[0]}</p>
            <p className="text-xs text-slate-500 font-medium">Profile</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-72 lg:ml-80 pt-16 md:pt-0">
        <div className="p-4 md:p-8 lg:p-12 max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-2 tracking-tight">Profile Settings</h1>
            <p className="text-slate-600 font-medium text-sm sm:text-base md:text-lg">Manage your personal information and account details</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden mb-8">
            {/* Card Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl md:text-4xl font-black shadow-2xl">
                      {userData.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      PRO
                    </div>
                  </div>
                  <div>
                    {isEditing ? (
                      <div className="space-y-3 w-full">
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="w-full text-xl md:text-2xl font-black text-slate-900 bg-white border-2 border-blue-500 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/20"
                          autoFocus
                          placeholder="Full Name"
                        />
                        <input
                          type="tel"
                          value={editedPhone}
                          onChange={(e) => setEditedPhone(e.target.value)}
                          className="w-full text-base md:text-lg font-medium text-slate-700 bg-white border-2 border-blue-500 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-500/20"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">{userData.name}</h2>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-slate-400" />
                            <span className="text-slate-600 font-medium text-sm md:text-base break-all">{userData.email}</span>
                          </div>
                          {userData.phone && (
                            <div className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></div>
                              <Phone size={16} className="text-slate-400" />
                              <span className="text-slate-600 font-medium text-sm md:text-base">{userData.phone}</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={18} />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedName(userData.name);
                          setEditedPhone(userData.phone);
                        }}
                        className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Account Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-100 hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Mail className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</h4>
                      <p className="text-sm md:text-base font-bold text-slate-900 break-all">{userData.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Primary contact email</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-100 hover:border-green-200 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Phone className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Phone</h4>
                      <p className="text-sm md:text-base font-bold text-slate-900">{userData.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Contact number</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-100 hover:border-purple-200 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Calendar className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Member Since</h4>
                      <p className="text-sm md:text-base font-bold text-slate-900">{userData.createdAt}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Account creation date</div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-100 hover:border-amber-200 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Clock className="text-amber-600" size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Account Type</h4>
                      <p className="text-sm md:text-base font-bold text-slate-900">Professional</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Full access account</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-8 right-8 z-[2000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'} ${toast.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700' : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700'}`}>
        {toast.type === 'success' ? 
          <CheckCircle size={24} className="text-green-600" /> : 
          <AlertCircle size={24} className="text-red-600" />
        }
        <span className="font-bold text-sm">{toast.message}</span>
      </div>
    </div>
  );
};

export default Profile;