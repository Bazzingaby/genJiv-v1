import React from 'react';
import { UserProfile } from '../types';

interface DashboardProps {
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Profile Card */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg text-center border-t-8 border-ocean-blue">
          <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl shadow-inner">
            {user.avatar}
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-800">{user.name}</h2>
          <p className="text-ocean-blue font-bold text-sm uppercase tracking-widest mt-1">Junior Ranger</p>
          
          <div className="mt-6 flex justify-center gap-8">
            <div className="text-center">
              <span className="block text-3xl font-bold text-gray-800">{user.points}</span>
              <span className="text-xs text-gray-400 font-bold uppercase">XP Earned</span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold text-gray-800">{user.discoveredSpecies.length}</span>
              <span className="text-xs text-gray-400 font-bold uppercase">Species Found</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 shadow-lg text-white">
          <h3 className="font-display font-bold text-xl mb-4">🏆 Weekly Challenge</h3>
          <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm mb-4">
            <p className="font-bold text-lg mb-1">Save the Savanna</p>
            <p className="text-sm opacity-90">Identify 3 African animals in the Wildlife Map.</p>
            <div className="mt-3 h-2 bg-white/30 rounded-full overflow-hidden">
               <div className="w-1/3 h-full bg-white rounded-full"></div>
            </div>
            <div className="flex justify-between text-xs font-bold mt-1">
              <span>1/3 Found</span>
              <span>+500 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Badges & Stats */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h3 className="font-display font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
            <span>🎖️</span> Badge Collection
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {user.badges.map((badge, i) => (
               <div key={i} className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-yellow-50 transition-colors border border-gray-100 hover:border-yellow-200">
                 <span className="text-4xl mb-2 drop-shadow-sm">{badge}</span>
                 <span className="text-xs font-bold text-gray-500 text-center">Explorer</span>
               </div>
            ))}
            {/* Locked Badges */}
            {[1,2,3,4].map((_, i) => (
               <div key={`locked-${i}`} className="flex flex-col items-center p-3 rounded-xl bg-gray-50 border border-dashed border-gray-300 opacity-50">
                 <span className="text-4xl mb-2 grayscale">🔒</span>
                 <span className="text-xs font-bold text-gray-400 text-center">Locked</span>
               </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg">
           <h3 className="font-display font-bold text-xl text-gray-800 mb-6 flex items-center gap-2">
            <span>📚</span> Recent Discoveries
          </h3>
          {user.discoveredSpecies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.discoveredSpecies.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold text-sm">
                  {s}
                </span>
              ))}
            </div>
          ) : (
             <p className="text-gray-400 italic">Go to the Wildlife Map to find animals!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;