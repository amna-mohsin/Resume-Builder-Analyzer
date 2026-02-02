import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, ShieldCheck, 
  User, LogOut, Plus, ArrowRight, CheckCircle, ChevronDown, Edit3, Eye, Trash2, MoreVertical, Mail, Phone, Calendar, Menu, X, Search
} from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [userData, setUserData] = useState({ name: 'User', email: '' });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      // Check for user session in localStorage first (from Login)
      const userSession = localStorage.getItem('userSession');
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      
      if (userSession && isAuthenticated === 'true') {
        const userData = JSON.parse(userSession);
        setUserData({
          name: userData.name || 'User',
          email: userData.email
        });
        
        const hasShownWelcome = sessionStorage.getItem('welcomeShown');
        if (!hasShownWelcome) {
          setShowWelcome(true);
          sessionStorage.setItem('welcomeShown', 'true');
          const timer = setTimeout(() => setShowWelcome(false), 4000);
          
          fetchResumes();
          
          return () => clearTimeout(timer);
        } else {
          fetchResumes();
        }
      } else {
        // Fallback: Check Supabase Auth (for backward compatibility)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserData({
            name: user.user_metadata?.full_name || 'User',
            email: user.email
          });
          
          const hasShownWelcome = sessionStorage.getItem('welcomeShown');
          if (!hasShownWelcome) {
            setShowWelcome(true);
            sessionStorage.setItem('welcomeShown', 'true');
            const timer = setTimeout(() => setShowWelcome(false), 4000);
            
            fetchResumes();
            
            return () => clearTimeout(timer);
          } else {
            fetchResumes();
          }
        } else {
          // No session found, redirect to login
          navigate('/login');
        }
      }
    };
    getProfile();
  }, [navigate, location.pathname]);

  // Filter resumes based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResumes(resumes);
    } else {
      const filtered = resumes.filter(resume =>
        resume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        new Date(resume.created_at).toLocaleDateString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResumes(filtered);
    }
  }, [searchQuery, resumes]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchResumes();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuId && !e.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  const fetchResumes = () => {
    try {
      setLoading(true);
      const savedResumes = JSON.parse(localStorage.getItem('savedResumes') || '[]');
      const sortedResumes = savedResumes.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setResumes(sortedResumes);
      setFilteredResumes(sortedResumes);
    } catch (err) {
      console.error('Error fetching resumes:', err);
      setResumes([]);
      setFilteredResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (resumeId) => {
    try {
      const savedResumes = JSON.parse(localStorage.getItem('savedResumes') || '[]');
      const updatedResumes = savedResumes.filter(r => r.id !== resumeId);
      localStorage.setItem('savedResumes', JSON.stringify(updatedResumes));
      setResumes(updatedResumes);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting resume:', err);
    }
  };

  const handleEdit = (resume) => {
    try {
      const resumeData = JSON.parse(resume.data);
      sessionStorage.setItem('resumeData', JSON.stringify(resumeData));
      sessionStorage.setItem('resumeId', resume.id);
      navigate('/resume-builder');
    } catch (err) {
      console.error('Error loading resume:', err);
    }
  };

  const handleView = (resume) => {
    try {
      const resumeData = JSON.parse(resume.data);
      sessionStorage.setItem('resumeData', JSON.stringify(resumeData));
      sessionStorage.setItem('viewMode', 'true');
      navigate('/resume-builder');
    } catch (err) {
      console.error('Error loading resume:', err);
    }
  };

  const handleLogout = async () => {
    // Clear all session data
    localStorage.removeItem('userSession');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('supabase.auth.token');
    
    sessionStorage.removeItem('userSession');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('welcomeShown');
    
    // Clear Supabase auth if exists
    await supabase.auth.signOut();
    
    // Redirect to login
    navigate('/login');
  };

  const goToEditor = () => navigate('/resume-builder');
  const goToATSAnalyzer = () => navigate('/ats-checker');

  const sidebarGradient = 'linear-gradient(180deg, #0F172A 0%, #1E1B4B 100%)'; 
  const accentGradient = 'linear-gradient(135deg, #7AA1D2, #CC95C0, #DBD4B4)';

  const stats = [
    { label: 'Total Resumes', value: resumes.length.toString(), icon: <FileText className="text-blue-500" /> },
    { label: 'Avg. ATS Score', value: '—', icon: <ShieldCheck className="text-green-500" /> },
    { label: 'Avg. Completion', value: '0%', icon: <LayoutDashboard className="text-purple-500" /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`w-64 fixed inset-y-0 left-0 text-white flex flex-col shadow-2xl z-40 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`} style={{ background: sidebarGradient }}>
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ background: accentGradient }}>
            <FileText size={18} className="text-white" />
          </div>
          <span className="font-black tracking-tighter text-xl uppercase italic">ResumeAI+</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
          <NavItem 
            icon={<FileText size={20}/>} 
            label="Resume Builder" 
            onClick={goToEditor}
          />
          <NavItem 
            icon={<ShieldCheck size={20}/>} 
            label="ATS Analyzer" 
            onClick={goToATSAnalyzer}
          />
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2 mb-4">
          <NavItem icon={<User size={20}/>} label="Profile" onClick={() => navigate('/profile')} />
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 p-4 md:p-8">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4 md:hidden gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm flex-shrink-0"
          >
            <Menu size={18} className="text-slate-700" />
          </button>
          <h1 className="text-lg font-[1000] text-slate-900 truncate flex-1 text-center">Dashboard</h1>
          <div className="w-8 flex-shrink-0" />
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-10 gap-3 md:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-[1000] text-slate-900 tracking-tight leading-none break-words">Dashboard</h1>
            <p className="text-slate-500 font-bold mt-1 md:mt-2 text-xs sm:text-sm md:text-base">Welcome back, <span className="text-indigo-600">@{userData.name.split(' ')[0].toLowerCase()}</span></p>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={goToEditor}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 bg-slate-900 text-white rounded-lg md:rounded-xl font-black shadow-xl hover:-translate-y-1 transition-all active:scale-95 text-xs sm:text-sm md:text-base flex-shrink-0"
            >
              <Plus size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" /> <span className="hidden xs:inline sm:hidden">New</span><span className="hidden sm:inline">New Resume</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 md:gap-3 bg-white p-1.5 pr-2 md:pr-4 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all active:scale-95"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black shadow-inner text-sm md:text-base">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-black text-slate-900 leading-tight">{userData.name}</p>
                  <p className="text-[10px] font-bold text-slate-400">{userData.email}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform hidden md:block ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in duration-200">
                   <button 
                     onClick={() => {
                       setIsProfileOpen(false);
                       navigate('/profile');
                     }}
                     className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                   >
                      <User size={16} /> My Profile
                   </button>
                   <hr className="my-2 border-slate-100" />
                   <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <LogOut size={16} /> Sign Out
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-slate-50 flex items-center justify-center text-lg sm:text-xl md:text-2xl lg:text-3xl shadow-sm flex-shrink-0">{stat.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-black text-slate-900 leading-none break-words">{stat.value}</p>
                <p className="text-[9px] sm:text-xs md:text-sm font-black text-slate-400 uppercase tracking-widest mt-1 sm:mt-2 break-words">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-12">
          <ActionCard 
            icon={<FileText />} 
            title="Build Resume" 
            sub="Create from scratch" 
            onClick={goToEditor} 
          />
          <ActionCard 
            icon={<ShieldCheck />} 
            title="ATS Analyzer" 
            sub="Check compatibility" 
            onClick={goToATSAnalyzer}
          />
        </div>

        {/* Resumes List Section with Search */}
        <div className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Your Resumes</h2>
            
            {/* Search Bar */}
            <div className="relative w-full sm:w-auto">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 px-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          
          {loading ? (
            <p className="text-slate-500 text-center py-8">Loading resumes...</p>
          ) : filteredResumes.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600 font-bold mb-2">
                {searchQuery ? 'No resumes found' : 'No resumes yet'}
              </p>
              {searchQuery && (
                <p className="text-slate-500 text-sm mb-4">Try a different search term</p>
              )}
              <button 
                onClick={goToEditor}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Create Your First Resume
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredResumes.map(resume => (
                <div key={resume.id} className="flex items-center justify-between p-3 md:p-5 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors hover:bg-white hover:shadow-md">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl flex items-center justify-center shadow-sm text-indigo-600 border border-slate-100 flex-shrink-0">
                      <FileText size={18} className="md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-slate-800 text-sm md:text-base truncate">{resume.name}</p>
                      <p className="text-[10px] md:text-xs font-bold text-slate-400">{new Date(resume.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="relative menu-container">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === resume.id ? null : resume.id);
                      }}
                      className="p-2 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openMenuId === resume.id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-2xl border border-slate-100 z-50" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => {
                            handleEdit(resume);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-bold"
                        >
                          <Edit3 size={16} /> Edit
                        </button>
                        <button 
                          onClick={() => {
                            handleView(resume);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm font-bold"
                        >
                          <Eye size={16} /> View
                        </button>
                        <button 
                          onClick={() => {
                            setDeleteConfirm(resume.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-bold"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]" onClick={() => setDeleteConfirm(null)}>
              <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-black text-slate-900 mb-3">Delete Resume?</h3>
                <p className="text-slate-600 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUCCESS TOAST */}
      <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border bg-white border-green-100 text-green-600 transition-all duration-500 transform ${showWelcome ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <CheckCircle size={24} />
        <span className="font-black text-sm uppercase tracking-tight">
          Welcome {userData.name.split(' ')[0]}! You're logged in.
        </span>
      </div>
    </div>
  );
};

// Sub-components remain exactly the same
const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-white/10 text-white shadow-inner' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const ActionCard = ({ icon, title, sub, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex items-center justify-between"
  >
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#7AA1D2] group-hover:bg-[#7AA1D2] group-hover:text-white transition-all">
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <div>
        <p className="font-black text-slate-900 text-lg leading-tight">{title}</p>
        <p className="text-sm font-bold text-slate-400 mt-1">{sub}</p>
      </div>
    </div>
    <ArrowRight className="text-slate-200 group-hover:text-slate-900 transition-colors" />
  </div>
);

export default Dashboard;