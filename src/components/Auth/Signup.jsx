import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient'; 

const Signup = () => {
  const navigate = useNavigate();

  // State Management
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStrength = (pass) => {
    if (!pass) return { label: '', color: 'bg-slate-200', width: '0%' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[!@#$%^&*]/.test(pass)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (score === 2) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  };

  const strength = getStrength(formData.password);

  const showNotice = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = formData;

    // 1. Validations
    if (!fullName || !email || !password) return showNotice("Please fill all fields", "error");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return showNotice("Invalid email format", "error");
    if (strength.label !== 'Strong') return showNotice("Password is too weak", "error");
    if (password !== confirmPassword) return showNotice("Passwords do not match", "error");

    setLoading(true);
    try {
      // Check if user already exists in profiles table
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email.trim())
        .single();

      if (existingUser) {
        showNotice("This email is already registered. Try logging in!", "error");
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Generate unique ID for the user
      const userId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 2. Store user directly in profiles table (without email verification)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: userId,
            email: email.trim(), 
            full_name: fullName,
            password: password, // Store password directly (consider hashing in production)
            created_at: new Date().toISOString(),
          }
        ]);

      if (profileError) {
        // Check for duplicate key error
        if (profileError.code === '23505') {
          showNotice("This email is already registered. Try logging in!", "error");
          setTimeout(() => navigate('/login'), 3000);
          return;
        }
        throw profileError;
      }

      // 3. Show success message and redirect
      showNotice("Account created successfully! Redirecting to login...", "success");
      setIsAccountCreated(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error("Signup error:", error);
      showNotice(error.message || "An error occurred during signup", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-x-hidden overflow-y-auto bg-white font-sans">
      
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center px-16 text-white overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, #7AA1D2, #CC95C0, #DBD4B4)' }} />
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="relative z-10">
          <h1 className="text-6xl font-[1000] tracking-tight mb-6 leading-tight">Start Your <br /> Journey</h1>
          <p className="text-xl text-white/80 font-medium max-w-md mb-10 leading-relaxed">Join thousands of professionals building careers with AI.</p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="w-full max-w-md">
          
          {isAccountCreated ? (
            /* SUCCESS VIEW - Simplified without email verification */
            <div className="text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100">
                <CheckCircle size={40} strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl font-[1000] text-slate-900 mb-4 tracking-tighter leading-none">Account Created!</h2>
              <p className="text-slate-500 font-bold leading-relaxed mb-8">
                Your account has been successfully created. <br />
                Redirecting to login page...
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
              >
                Go to Login Now
              </button>
            </div>
          ) : (
            /* SIGNUP FORM VIEW */
            <>
              <div className="text-center lg:text-left mb-10">
                <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900 mb-2 leading-none">Create Account</h2>
                <p className="text-slate-500 font-bold">Sign up to start building your professional resume</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <input name="fullName" type="text" value={formData.fullName} onChange={handleChange} placeholder="John Doe" className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#7AA1D2] focus:bg-white transition-all font-bold text-lg text-slate-700 outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#DBD4B4] focus:bg-white transition-all font-bold text-lg text-slate-700 outline-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                    <div className="relative">
                        <input name="password" type={showPass ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#CC95C0] focus:bg-white transition-all font-bold text-lg text-slate-700 outline-none" />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors">
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {formData.password && (
                        <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${strength.color}`} style={{ width: strength.width }} />
                        </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Confirm</label>
                    <div className="relative">
                        <input name="confirmPassword" type={showConfirm ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#7AA1D2] focus:bg-white transition-all font-bold text-lg text-slate-700 outline-none" />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors">
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 bg-slate-900 text-white rounded-2xl font-[900] text-lg mt-4 shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                  {!loading && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>}
                </button>
              </form>

              <p className="mt-8 text-center text-slate-500 font-medium text-sm">
                Already have an account? 
                <button onClick={() => navigate('/login')} className="ml-2 text-slate-400 font-bold hover:text-pink-600 transition-all hover:underline">
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-8 right-8 z-[2000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'} ${toast.type === 'success' ? 'bg-white border-green-100 text-green-600' : 'bg-white border-red-100 text-red-600'}`}>
        {toast.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
        <span className="font-black text-sm uppercase tracking-tight">{toast.message}</span>
      </div>

    </div>
  );
};

export default Signup;