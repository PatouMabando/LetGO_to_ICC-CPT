import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { BookingPage } from './components/BookingPage';
import { TrackingPage } from './components/TrackingPage';
import { AdminPanel } from './components/AdminPanel';
import { AppProvider, useApp } from './context/AppContext';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const { isAdmin } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return <LoginPage onViewChange={setCurrentView} />;
      case 'booking':
        return <BookingPage onViewChange={setCurrentView} />;
      case 'track':
        return <TrackingPage onViewChange={setCurrentView} />;
      case 'admin':
        return isAdmin ? <AdminPanel /> : <LoginPage onViewChange={setCurrentView} />;
      default:
        return <HomePage onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;