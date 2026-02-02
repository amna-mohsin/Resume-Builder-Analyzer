import React from 'react';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
  const navigate = useNavigate(); // This handles the navigation logic

  return (
    <div className="relative min-h-screen flex flex-col items-center font-sans overflow-x-hidden overflow-y-auto bg-white">
      
      {/* 1. MODERN GRADIENT BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(to right, #7AA1D2, #DBD4B4, #CC95C0)'
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_85%)]" />
      </div>

      {/* 2. NAVBAR: Responsive centering for iPhone SE & smaller */}
      <nav className="relative z-[1000] w-full bg-white/60 backdrop-blur-xl border-b border-slate-200/40 flex flex-col items-center justify-center gap-2 sm:gap-3 py-2 sm:py-3 md:py-4 min-[480px]:flex-row min-[480px]:justify-between min-[480px]:h-16 md:min-[480px]:h-20 min-[480px]:px-4 sm:min-[480px]:px-8 md:min-[480px]:px-12 min-[480px]:py-0 flex-shrink-0 transition-all">
        
        {/* Logo acting as Home Link */}
        <div 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div 
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-black/5 group-hover:scale-105 transition-transform flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #7AA1D2, #DBD4B4, #CC95C0)'
            }}
          >
             <svg className="w-4 h-4 sm:w-5 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
          </div>
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-[1000] tracking-tighter text-slate-900 truncate">ResumeAI</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="text-slate-600 font-bold text-xs sm:text-sm px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border-2 border-transparent hover:border-slate-100 hover:bg-white hover:shadow-md hover:text-slate-900 transition-all active:scale-95 min-h-[32px]"
            >
              Login
            </button>
          
          {/* Get Started Button Linked to Signup */}
          <button 
            onClick={() => navigate('/signup')}
            className="bg-slate-900 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm shadow-xl shadow-black/10 hover:bg-slate-800 active:scale-95 transition-all min-h-[32px]"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* 3. MAIN CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 w-full max-w-5xl py-12 min-[480px]:py-0">
        
        <div 
          className="mb-16 mt-8 px-4 py-1.5 rounded-full bg-white/50 border border-slate-200/50 flex items-center gap-2 shadow-sm"
          style={{
            animation: 'fadeInDown 0.8s ease-out, glow 2s ease-in-out infinite'
          }}
        >
          <svg 
            className="w-4 h-4 text-slate-400" 
            fill="currentColor" 
            viewBox="0 0 24 24"
            style={{ animation: 'spin 3s linear infinite' }}
          >
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
          </svg>
          <span className="text-slate-500 text-[11px] font-[900] uppercase tracking-[0.15em]">AI-Powered Intelligence</span>
        </div>

        <h1 className="text-[clamp(2.4rem,9vw,5.5rem)] font-[1000] leading-[1.02] tracking-[-0.05em] text-[#0F172A] mb-8">
          Build Resumes That <br />
          <span className="bg-gradient-to-r from-[#5A89C7] via-[#9B8E6A] to-[#A36695] bg-clip-text text-transparent pb-2 inline-block">
            Beat the ATS
          </span>
        </h1>

        <p className="max-w-xl text-[clamp(16px,4vw,20px)] text-slate-500 font-medium leading-relaxed mb-10">
          Create professional, ATS-optimized resumes in minutes. Land more interviews with our AI scoring system.
        </p>

        {/* 4. SYMMETRICAL BUTTONS */}
        <div className="flex flex-col min-[480px]:flex-row items-center justify-center gap-4 w-full">
         <button 
  onClick={() => navigate('/signup')}
  className="w-full min-[480px]:w-56 h-16 bg-slate-900 text-white rounded-2xl font-[900] text-lg shadow-2xl shadow-black/20 hover:bg-slate-800 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center"
>
  Build Resume →
</button>
        <button 
  onClick={() => navigate('/login')}
  className="w-full min-[480px]:w-56 h-16 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold text-lg hover:border-slate-200 hover:bg-slate-50 hover:shadow-lg hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center"
>
  View Demo
</button>
        </div>

        {/* 5. FOOTER FEATURES */}
        <div className="mt-16 mb-8 flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-60">
           {['No Credit Card', 'ATS Optimized', 'PDF Export'].map(text => (
             <div key={text} className="flex items-center gap-2.5">
               <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                 <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                   <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
               </div>
               <span className="text-[12px] font-black text-slate-600 uppercase tracking-tight">{text}</span>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
};

export default GetStarted;