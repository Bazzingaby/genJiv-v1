import React, { useState } from 'react';
import { generateSpeciesData } from '../services/gemini';
import SpeciesCard from './SpeciesCard';
import { SpeciesData } from '../types';

interface Region {
  id: string;
  name: string;
  x: number;
  y: number;
  animals: string[];
}

const regions: Region[] = [
  { id: 'africa', name: 'African Savanna', x: 53, y: 55, animals: ['Lion', 'Elephant', 'Rhino', 'Giraffe'] },
  { id: 'amazon', name: 'Amazon Rainforest', x: 28, y: 60, animals: ['Jaguar', 'Sloth', 'Macaw', 'Capybara'] },
  { id: 'arctic', name: 'Arctic Tundra', x: 45, y: 10, animals: ['Polar Bear', 'Arctic Fox', 'Walrus'] },
  { id: 'asia', name: 'Asian Jungle', x: 75, y: 45, animals: ['Tiger', 'Panda', 'Orangutan', 'Cobra'] },
  { id: 'australia', name: 'Outback', x: 85, y: 75, animals: ['Kangaroo', 'Koala', 'Platypus'] },
  { id: 'ocean', name: 'Great Barrier Reef', x: 90, y: 70, animals: ['Sea Turtle', 'Clownfish', 'Great White Shark'] },
];

const MapExplorer: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<SpeciesData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnimalClick = async (animal: string) => {
    setLoading(true);
    try {
      const data = await generateSpeciesData(animal);
      setSelectedAnimal(data);
    } catch (e) {
      alert("Oops! The ranger couldn't find that animal right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-ocean-blue">
        <h2 className="text-3xl font-display font-bold text-ocean-blue mb-2 text-center">Global Wildlife Tracker</h2>
        <p className="text-center text-gray-600 mb-6">Click on a region marker to discover local species!</p>
        
        {/* Abstract World Map */}
        <div className="relative w-full aspect-[16/9] bg-blue-100 rounded-2xl overflow-hidden shadow-inner border border-blue-200">
          {/* Simple SVG World Map Outline Background */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-30 text-green-200 fill-current pointer-events-none">
             <path d="M20,30 Q30,20 40,30 T60,30 T80,40 T90,60 T70,80 T40,70 T20,60 Z" />
          </svg>
          
          {/* Continents (Simulated with simple shapes for aesthetics) */}
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-[20%] left-[10%] w-[25%] h-[30%] bg-green-200 rounded-full opacity-50 blur-xl"></div> {/* NA */}
             <div className="absolute top-[50%] left-[20%] w-[15%] h-[30%] bg-green-300 rounded-full opacity-50 blur-xl"></div> {/* SA */}
             <div className="absolute top-[20%] left-[40%] w-[20%] h-[40%] bg-yellow-200 rounded-full opacity-50 blur-xl"></div> {/* Africa/Eu */}
             <div className="absolute top-[20%] left-[60%] w-[30%] h-[30%] bg-green-200 rounded-full opacity-50 blur-xl"></div> {/* Asia */}
             <div className="absolute top-[60%] left-[80%] w-[15%] h-[15%] bg-yellow-300 rounded-full opacity-50 blur-xl"></div> {/* Aus */}
          </div>

          {/* Region Markers */}
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => {
                setSelectedRegion(region);
                setSelectedAnimal(null);
              }}
              style={{ left: `${region.x}%`, top: `${region.y}%` }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300
                ${selectedRegion?.id === region.id ? 'scale-125 z-10' : 'hover:scale-110 z-0'}
              `}
            >
              <div className="relative">
                <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white
                  ${selectedRegion?.id === region.id ? 'bg-alert-red animate-bounce' : 'bg-jungle-green'}
                `}>
                  📍
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded-md shadow-md text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {region.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Region Drawer */}
      {selectedRegion && !selectedAnimal && (
        <div className="bg-white rounded-3xl p-6 shadow-xl animate-slide-up border-t-4 border-sunset-orange">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-display font-bold text-gray-800">
              Wildlife in <span className="text-sunset-orange">{selectedRegion.name}</span>
            </h3>
            <button onClick={() => setSelectedRegion(null)} className="text-gray-400 hover:text-gray-600 font-bold">Close</button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedRegion.animals.map((animal) => (
              <button
                key={animal}
                onClick={() => handleAnimalClick(animal)}
                disabled={loading}
                className="group relative bg-soft-cream rounded-xl p-4 hover:shadow-md transition-all border border-transparent hover:border-jungle-green text-left"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">🐾</div>
                <h4 className="font-bold text-gray-700">{animal}</h4>
                <p className="text-xs text-gray-500">Tap to learn more</p>
              </button>
            ))}
          </div>
          {loading && (
            <div className="mt-8 text-center text-gray-500">
              <span className="inline-block animate-spin mr-2">⏳</span> Calling the ranger...
            </div>
          )}
        </div>
      )}

      {/* Animal Detail View */}
      {selectedAnimal && (
        <div className="animate-fade-in">
           <button 
             onClick={() => setSelectedAnimal(null)}
             className="mb-4 text-sm font-bold text-gray-500 hover:text-jungle-green flex items-center gap-1"
           >
             ← Back to Region
           </button>
           <SpeciesCard data={selectedAnimal} />
        </div>
      )}
    </div>
  );
};

export default MapExplorer;