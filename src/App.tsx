import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { ToastContainer, ToastMessage } from './components/Toast.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { AuthPage } from './pages/AuthPage.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { PortfolioView } from './pages/PortfolioView.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';

function AppContent() {
  const { user, portfolio, isLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronize history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl flare-gradient animate-spin flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="w-2 h-2 rounded-full bg-white"></span>
          </div>
          <p className="text-xs font-mono text-zinc-400">Initializing FlarePort Studio...</p>
        </div>
      </div>
    );
  }

  // Active theme accent
  const currentAccent = portfolio?.themeSettings?.accentColor || '#f97316';

  // Determine current view
  let pageContent: React.ReactNode;

  if (currentPath === '/' || currentPath === '') {
    pageContent = <LandingPage onNavigate={navigate} />;
  } else if (currentPath === '/login') {
    pageContent = (
      <AuthPage
        initialMode="login"
        onSuccess={() => {
          addToast('Signed in successfully!', 'success');
          navigate('/dashboard');
        }}
        onNavigate={navigate}
      />
    );
  } else if (currentPath === '/register') {
    pageContent = (
      <AuthPage
        initialMode="register"
        onSuccess={() => {
          addToast('Account created! Welcome to your Dashboard.', 'success');
          navigate('/dashboard');
        }}
        onNavigate={navigate}
      />
    );
  } else if (currentPath === '/dashboard') {
    if (!user) {
      // Redirect to login if not authenticated
      pageContent = (
        <AuthPage
          initialMode="login"
          onSuccess={() => navigate('/dashboard')}
          onNavigate={navigate}
        />
      );
    } else {
      pageContent = <Dashboard onShowToast={addToast} onNavigate={navigate} />;
    }
  } else if (currentPath === '/profile') {
    if (!user) {
      pageContent = (
        <AuthPage
          initialMode="login"
          onSuccess={() => navigate('/profile')}
          onNavigate={navigate}
        />
      );
    } else {
      pageContent = <ProfilePage onShowToast={addToast} onNavigate={navigate} />;
    }
  } else {
    // Treat any other path like /:username as public portfolio view
    const usernameParam = currentPath.replace(/^\//, '').split('/')[0];
    pageContent = (
      <PortfolioView
        username={usernameParam}
        onNavigate={navigate}
        onShowToast={addToast}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100">
      <Navbar
        currentRoute={currentPath}
        onNavigate={navigate}
        accentColor={currentAccent}
      />
      
      <main className="flex-1">
        {pageContent}
      </main>

      <Footer accentColor={currentAccent} />
      
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
