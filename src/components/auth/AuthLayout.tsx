import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-['Poppins',sans-serif]">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      
      {/* Right Side - Animated Gradient Panel */}
      <div className="flex-1 min-h-[50vh] lg:min-h-screen relative overflow-hidden">
        {/* Animated gradient background */}
        <div 
          className="absolute inset-0 bg-gradient-conic"
          style={{
            background: `conic-gradient(from 0deg, #009688, #FF4081, #7C4DFF, #FF9800, #009688)`,
            animation: 'gradientRotate 8s ease-in-out infinite',
          }}
        />
        
        {/* Floating center card */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 max-w-sm w-full transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-white text-xl font-semibold mb-4">
              Ask Lovable to build inte
            </h3>
            <div className="flex justify-end">
              <button 
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Proceed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes gradientRotate {
            0% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(90deg) scale(1.1); }
            50% { transform: rotate(180deg) scale(1); }
            75% { transform: rotate(270deg) scale(1.1); }
            100% { transform: rotate(360deg) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
};