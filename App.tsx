import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MapExplorer from './components/MapExplorer';
import PhotoStudio from './components/PhotoStudio';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import { UserProfile } from './types';
import { generateSpeciesData } from './services/gemini';
import SpeciesCard from './components/SpeciesCard';

const initialUser: UserProfile = {
  name: "Ranger Alex",
  points: 1250,
  badges: ['🦁', '📸', '🌿', '🎓'],
  discoveredSpecies: ['Lion', 'Elephant'],
  avatar: '🤠'
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [featuredSpecies, setFeaturedSpecies] = useState<any>(null);
  const [dailyFact, setDailyFact] = useState<string>('');

  useEffect(() => {
    // Load a daily fact or featured species on mount
    const loadFeatured = async () => {
      try {
        const data = await generateSpeciesData("Pangolin");
        setFeaturedSpecies(data);
        setDailyFact(data.funFacts[0]);
      } catch (e) {
        console.error(e);
      }
    };
    loadFeatured();
  }, []);

  const handleQuizComplete = (score: number) => {
    setUser(u => ({
      ...u,
      points: u.points + score
    }));
    alert(`Great job! You earned ${score} XP!`);
    setCurrentPage('profile');
  };

  const renderContent = () => {
    switch(currentPage) {
      case 'home':
        return (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="bg-jungle-green rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
               <div className="relative z-10 max-w-2xl">
                 <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Protect the Wild!</h1>
                 <p className="text-lg md:text-xl mb-8 opacity-90">Join the global mission to save endangered species. Learn, create, and explore with the power of AI.</p>
                 <button 
                   onClick={() => setCurrentPage('explorer')}
                   className="bg-white text-jungle-green px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-yellow-100 transition-colors"
                 >
                   Start Exploring 🗺️
                 </button>
               </div>
               <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
                 <svg width="400" height="400" viewBox="0 0 200 200" fill="currentColor">
                    <path d="M48.5,95.5 C48.5,95.5 35,67 59.5,43.5 C84,20 120.5,33.5 120.5,33.5 C120.5,33.5 147.5,-4.5 178.5,15.5 C209.5,35.5 186.5,74 186.5,74 C186.5,74 213,97 200.5,127.5 C188,158 153.5,151 153.5,151 C153.5,151 133,184 96.5,178 C60,172 63.5,135 63.5,135 C63.5,135 24.5,143 11.5,108.5 C-1.5,74 48.5,95.5 48.5,95.5 Z" />
                 </svg>
               </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-6 rounded-3xl shadow-lg border-l-8 border-sunset-orange hover:transform hover:-translate-y-1 transition-all cursor-pointer" onClick={() => setCurrentPage('studio')}>
                  <div className="text-5xl mb-4">📸</div>
                  <h3 className="text-2xl font-display font-bold text-gray-800 mb-2">Nano Studio</h3>
                  <p className="text-gray-600">Edit wildlife photos and create amazing posters with Gemini AI.</p>
               </div>
               <div className="bg-white p-6 rounded-3xl shadow-lg border-l-8 border-ocean-blue hover:transform hover:-translate-y-1 transition-all cursor-pointer" onClick={() => setCurrentPage('explorer')}>
                  <div className="text-5xl mb-4">🌏</div>
                  <h3 className="text-2xl font-display font-bold text-gray-800 mb-2">Interactive Map</h3>
                  <p className="text-gray-600">Track species across the globe and learn about their habitats.</p>
               </div>
            </div>

            {/* Featured Species */}
            {featuredSpecies && (
               <div>
                 <h2 className="text-3xl font-display font-bold text-jungle-green mb-6 text-center">Species of the Day</h2>
                 <SpeciesCard data={featuredSpecies} />
               </div>
            )}
            
            {/* Quick Quiz Teaser */}
            <div className="bg-deep-forest text-white rounded-3xl p-8 text-center">
              <h2 className="text-3xl font-display font-bold mb-4">Think you're an expert?</h2>
              <p className="mb-6 text-lg">Test your knowledge on conservation and earn badges!</p>
              <button 
                onClick={() => setCurrentPage('quiz')}
                className="bg-yellow-400 text-yellow-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition-colors"
              >
                Take a Quiz 📝
              </button>
            </div>
          </div>
        );
      case 'explorer':
        return <MapExplorer />;
      case 'species':
        return (
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-jungle-green mb-6 text-center">Search Speciespedia</h2>
            <div className="flex gap-2 mb-8">
               <input 
                 type="text" 
                 placeholder="e.g. Snow Leopard"
                 className="flex-1 p-4 rounded-xl border border-gray-200 shadow-sm focus:border-jungle-green outline-none"
                 onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                       // Logic to load new species would go here, 
                       // reusing MapExplorer logic or simplified one
                       const val = (e.target as HTMLInputElement).value;
                       if(val) {
                         // Simple alert for demo, ideally loads the card
                         generateSpeciesData(val).then(setFeaturedSpecies);
                         setCurrentPage('home'); // Go to home to see it
                       }
                    }
                 }}
               />
               <button className="bg-jungle-green text-white px-6 rounded-xl font-bold">🔍</button>
            </div>
            <p className="text-center text-gray-500">Try searching for "Red Panda" or "Blue Whale"</p>
          </div>
        );
      case 'studio':
        return <PhotoStudio />;
      case 'profile':
        return <Dashboard user={user} />;
      case 'quiz':
        return <Quiz onComplete={handleQuizComplete} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <Layout user={user} currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderContent()}
    </Layout>
  );
};

export default App;