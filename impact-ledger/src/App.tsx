import { useState, useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard, Marketplace, Evaluation } from './pages';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'marketplace' | 'evaluation'>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    } else {
      // Force logout to clear any stale state
      localStorage.removeItem('user');
    }
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as 'dashboard' | 'marketplace' | 'evaluation');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowSignup(false);
  };

  const handleSignupSuccess = () => {
    setIsAuthenticated(true);
    setShowSignup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setShowSignup(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'marketplace':
        return <Marketplace />;
      case 'evaluation':
        return <Evaluation />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    if (showSignup) {
      return (
        <Signup 
          onSignupSuccess={handleSignupSuccess}
          onBackToLogin={() => setShowSignup(false)}
        />
      );
    }
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess}
        onSignupClick={() => setShowSignup(true)}
      />
    );
  }

  return (
    <MainLayout onNavigate={handleNavigate} onLogout={handleLogout}>
      {renderPage()}
    </MainLayout>
  );
}

export default App;
