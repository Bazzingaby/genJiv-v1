import React, { useState, useRef } from 'react';
import { editWildlifeImage, generateWildlifeImage } from '../services/gemini';

const PhotoStudio: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'edit' | 'create'>('create');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setMode('edit');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAction = async () => {
    if (!prompt) return;
    setIsProcessing(true);
    try {
      let resultUrl;
      if (mode === 'edit' && image) {
        resultUrl = await editWildlifeImage(image, prompt);
      } else {
        resultUrl = await generateWildlifeImage(prompt);
      }
      setImage(resultUrl);
    } catch (error) {
      alert("Something went wrong with the creative magic! Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-display font-bold mb-2">Nano Banana Studio 🍌</h2>
        <p className="opacity-90 text-lg">Use AI magic to create wild habitats or add animals to your photos!</p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Controls */}
        <div className="p-6 md:w-1/3 border-r border-gray-100 flex flex-col gap-6 bg-gray-50">
          <div>
            <h3 className="font-bold text-gray-700 mb-3">1. Choose Mode</h3>
            <div className="flex bg-white p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => { setMode('create'); setImage(null); }}
                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'create' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'}`}
              >
                Create New
              </button>
              <button
                onClick={() => setMode('edit')}
                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'edit' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'}`}
              >
                Edit Photo
              </button>
            </div>
          </div>

          {mode === 'edit' && (
            <div>
              <h3 className="font-bold text-gray-700 mb-3">2. Upload Photo</h3>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition-colors font-semibold"
              >
                {image ? "Change Photo" : "Select from Device"}
              </button>
            </div>
          )}

          <div className="flex-grow">
            <h3 className="font-bold text-gray-700 mb-3">{mode === 'create' ? '2. Describe It' : '3. Magic Command'}</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === 'create' ? "A futuristic neon tiger running in a cyber city..." : "Add a party hat to the lion..."}
              className="w-full h-32 p-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none resize-none text-gray-700"
            />
          </div>

          <button
            onClick={handleAction}
            disabled={isProcessing || (!image && mode === 'edit') || !prompt}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transform transition-all active:scale-95
              ${isProcessing || (!image && mode === 'edit') || !prompt 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl'}`}
          >
            {isProcessing ? '✨ Making Magic...' : '✨ Run Magic'}
          </button>
        </div>

        {/* Canvas / Preview */}
        <div className="md:w-2/3 bg-gray-900 min-h-[400px] flex items-center justify-center relative">
          {image ? (
            <img src={image} alt="Workspace" className="max-w-full max-h-[600px] object-contain" />
          ) : (
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🎨</div>
              <p className="text-gray-400 font-medium">Your masterpiece will appear here</p>
            </div>
          )}
          
          {/* Badge Overlay */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-mono">
            Gemini 3 Pro
          </div>
        </div>
      </div>
      
      {image && (
          <div className="flex justify-end">
              <a href={image} download="genjiv-creation.png" className="text-indigo-600 font-bold hover:underline flex items-center gap-2">
                  <span>📥</span> Download Image
              </a>
          </div>
      )}
    </div>
  );
};

export default PhotoStudio;