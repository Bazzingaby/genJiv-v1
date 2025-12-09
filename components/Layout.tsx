import React from 'react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'explorer', label: 'Wildlife Map', icon: '🗺️' },
    { id: 'species', label: 'Speciespedia', icon: '🦁' },
    { id: 'studio', label: 'Nano Studio', icon: '🎨' },
    { id: 'profile', label: 'My Ranger Profile', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-soft-cream font-sans text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-jungle-green shadow-lg text-white">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <span className="text-3xl">🌿</span>
            <h1 className="text-2xl font-display font-bold tracking-wide">GenJiv</h1>
          </div>
          
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-full transition-all font-bold flex items-center gap-2
                  ${currentPage === item.id 
                    ? 'bg-white text-jungle-green shadow-md transform -translate-y-1' 
                    : 'hover:bg-deep-forest text-white'}`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 bg-deep-forest px-3 py-1 rounded-full border border-green-400">
            <span className="text-xl">{user.avatar}</span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold opacity-90">{user.name}</span>
              <span className="text-xs font-bold text-yellow-300">{user.points} XP</span>
            </div>
          </div>
        </div>
        
        {/* Mobile Nav */}
        <div className="md:hidden flex overflow-x-auto p-2 space-x-2 bg-deep-forest no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1
                ${currentPage === item.id 
                  ? 'bg-white text-jungle-green' 
                  : 'text-white'}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-earth-brown text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-display font-bold text-xl mb-2">GenJiv Wildlife Explorer</p>
          <p className="text-sm opacity-80">Powered by Gemini & Google Cloud</p>
          <div className="mt-4 flex justify-center gap-4 text-2xl">
            <span>🌍</span><span>🐘</span><span>🦜</span><span>🌱</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;