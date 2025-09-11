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
      
      {/* Right Side - Platform Diagram */}
      <div className="flex-1 min-h-[50vh] lg:min-h-screen bg-black flex items-center justify-center px-5">
        <img 
          src="/lovable-uploads/18aa9a10-08d6-4991-b18b-dc887d6b5c86.png"
          alt="Salescode Platform - One platform connecting insight, action, and impact with AI-powered sales and RTM solutions"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};