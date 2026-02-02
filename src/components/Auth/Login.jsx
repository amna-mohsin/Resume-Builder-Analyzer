import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const brandGradient = 'linear-gradient(135deg, #7AA1D2, #CC95C0, #DBD4B4)';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showNotice = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      return showNotice("Please enter both email and password", "error");
    }

    setLoading(true);
    try {
      // 1. Check if user exists in profiles table
      const { data: userData, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email.trim())
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error("No account found with this email");
        }
        throw fetchError;
      }

      // 2. Check if user exists
      if (!userData) {
        throw new Error("No account found with this email");
      }

      // 3. Verify password
      if (userData.password !== password) {
        throw new Error("Invalid password. Please try again.");
      }

      // 4. Create user session data
      const userSession = {
        id: userData.id,
        email: userData.email,
        name: userData.full_name || userData.email.split('@')[0],
        created_at: userData.created_at,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      };

      // 5. Store session in multiple places for reliability
      localStorage.setItem('userSession', JSON.stringify(userSession));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', userData.email);
      
      sessionStorage.setItem('userSession', JSON.stringify(userSession));
      sessionStorage.setItem('isAuthenticated', 'true');
      
      // 6. Store auth token (for consistency with Dashboard expectations)
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        currentSession: {
          user: {
            id: userData.id,
            email: userData.email,
            user_metadata: { full_name: userData.full_name }
          }
        }
      }));

      // 7. Show success and redirect
      showNotice("Login successful! Redirecting...", "success");
      
      // Force navigation to ensure it happens
      setTimeout(() => {
        // Clear any potential navigation blockers
        window.location.href = '/dashboard';
      }, 1500);

    } catch (error) {
      console.error("Login error:", error);
      showNotice(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden bg-white font-sans">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 relative z-10 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg" style={{ background: brandGradient }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <span className="text-2xl font-[1000] tracking-tighter text-slate-900 uppercase text-transparent bg-clip-text" style={{ backgroundImage: brandGradient }}>ResumeAI</span>
            </div>
            <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500 font-bold">Sign in to build your professional resume</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
              <input 
                name="email" 
                type="email" 
                autoComplete="email"
                value={formData.email}
                onChange={handleChange} 
                placeholder="john@example.com" 
                className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#7AA1D2] focus:bg-white transition-all font-bold text-lg text-slate-700 outline-none" 
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                <button 
                  type="button" 
                  onClick={() => showNotice("Please contact support to reset your password", "error")}
                  className="text-xs font-black uppercase text-[#7AA1D2] hover:text-[#CC95C0]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPass ? "text" : "password"} 
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange} 
                  placeholder="••••••••" 
                  className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#CC95C0] focus:bg-white transition-all font-bold text-lg text-slate-700 outline-none" 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-16 bg-slate-900 text-white rounded-2xl font-[900] text-lg mt-4 shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && (
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium text-sm">
              Don't have an account? 
              <button 
                onClick={() => navigate('/signup')} 
                className="ml-2 text-slate-400 font-bold transition-all duration-300 hover:text-pink-500 hover:underline underline-offset-4 decoration-2 active:scale-95"
              >
                Sign up for free
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center px-16 text-white overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ background: brandGradient }} />
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="relative z-10 text-center">
            <h1 className="text-5xl font-[1000] tracking-tight mb-6">Build Your <br /> Dream Career</h1>
            <p className="text-xl text-white/80 font-medium max-w-sm mx-auto">
                Log in to access your ATS-optimized resumes.
            </p>
        </div>
      </div>

      {/* TOAST ALERT */}
      <div className={`fixed bottom-8 right-8 z-[2000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'} ${toast.type === 'success' ? 'bg-white border-green-100 text-green-600' : 'bg-white border-red-100 text-red-600'}`}>
        {toast.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
        <span className="font-black text-sm uppercase tracking-tight">{toast.message}</span>
      </div>
    </div>
  );
};

export default Login;