
import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

interface AuthPageProps {
  onAuthenticated: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {isLogin ? (
          <LoginForm
            onSuccess={onAuthenticated}
            onSwitchToSignup={() => setIsLogin(false)}
          />
        ) : (
          <SignupForm
            onSuccess={onAuthenticated}
            onSwitchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
