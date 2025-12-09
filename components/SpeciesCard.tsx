import React from 'react';
import { SpeciesData } from '../types';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

interface SpeciesCardProps {
  data: SpeciesData;
  imageUrl?: string;
  onClose?: () => void;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const SpeciesCard: React.FC<SpeciesCardProps> = ({ data, imageUrl, onClose }) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-jungle-green animate-fade-in max-w-4xl mx-auto">
      {/* Header Image */}
      <div className="relative h-64 md:h-80 bg-gray-200">
        <img 
          src={imageUrl || `https://picsum.photos/800/400?random=${data.commonName}`} 
          alt={data.commonName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-1 drop-shadow-md">
            {data.commonName}
          </h2>
          <p className="text-white/90 italic text-lg">{data.scientificName}</p>
          
          <div className="absolute top-4 right-4">
            <span className={`
              px-4 py-2 rounded-full font-bold text-white shadow-lg uppercase tracking-wider text-sm
              ${data.conservationStatus === 'Critically Endangered' ? 'bg-red-600 animate-pulse' :
                data.conservationStatus === 'Endangered' ? 'bg-orange-600' :
                data.conservationStatus === 'Vulnerable' ? 'bg-yellow-500' :
                'bg-green-500'}
            `}>
              {data.conservationStatus}
            </span>
          </div>
        </div>
        
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full p-2 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Info */}
        <div className="space-y-6">
          <div className="bg-soft-cream p-5 rounded-2xl border-2 border-green-100">
            <h3 className="font-display font-bold text-xl text-jungle-green mb-3 flex items-center gap-2">
              <span>🏠</span> Habitat & Range
            </h3>
            <p className="text-gray-700 mb-2"><strong>Habitat:</strong> {data.habitat}</p>
            <p className="text-gray-700"><strong>Range:</strong> {data.geographicRange}</p>
          </div>

          <div className="bg-soft-cream p-5 rounded-2xl border-2 border-green-100">
            <h3 className="font-display font-bold text-xl text-jungle-green mb-3 flex items-center gap-2">
              <span>📊</span> Population
            </h3>
            <p className="text-gray-700 font-medium text-lg">{data.populationEstimate}</p>
            {data.groundingUrls && data.groundingUrls.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                <p>Sources verified via Google Search:</p>
                <ul className="list-disc pl-4 mt-1">
                  {data.groundingUrls.slice(0, 2).map((url, i) => (
                    <li key={i} className="truncate"><a href={url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{new URL(url).hostname}</a></li>
                  ))}
                </ul>
              </div>
            )}
          </div>

           <div className="bg-yellow-50 p-5 rounded-2xl border-2 border-yellow-200">
            <h3 className="font-display font-bold text-xl text-yellow-600 mb-3 flex items-center gap-2">
              <span>💡</span> Fun Facts
            </h3>
            <ul className="space-y-2">
              {data.funFacts.map((fact, index) => (
                <li key={index} className="flex gap-2 text-gray-700 text-sm">
                  <span className="text-yellow-500 font-bold">•</span>
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Visualization & Description */}
        <div className="space-y-6">
          <div>
            <h3 className="font-display font-bold text-xl text-jungle-green mb-2">About</h3>
            <p className="text-gray-700 leading-relaxed text-lg">{data.description}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100">
            <h3 className="font-display font-bold text-xl text-jungle-green mb-4 text-center">Dietary Habits</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.diet}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {data.diet.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || `hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeciesCard;