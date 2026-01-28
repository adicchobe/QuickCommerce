
import React, { useState } from 'react';
import { getRecipeAssistant } from '../geminiService';

interface AIAssistantProps {
  onSearch: (term: string) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const result = await getRecipeAssistant(query);
    setSuggestion(result);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-indigo-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl">✨</div>
        <div>
          <h3 className="font-bold text-lg">Smart Dash Assistant</h3>
          <p className="text-xs text-gray-500">I can help you plan recipes and find ingredients</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What should I cook today?"
          className="w-full bg-gray-100 border-none rounded-2xl py-4 px-6 pr-12 focus:ring-2 focus:ring-indigo-500 outline-none transition"
        />
        <button 
          disabled={loading}
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2 rounded-xl"
        >
          {loading ? '...' : '→'}
        </button>
      </form>

      {suggestion && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
            <h4 className="font-bold text-indigo-900 mb-2">Recipe: {suggestion.recipeName}</h4>
            <div className="flex flex-wrap gap-2">
              {suggestion.suggestedSearchTerms.map((term: string) => (
                <button
                  key={term}
                  onClick={() => onSearch(term)}
                  className="text-xs bg-white border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-600 hover:text-white transition"
                >
                  Find {term}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
             <p className="text-sm font-semibold text-gray-700">Quick Steps:</p>
             <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
               {suggestion.steps.slice(0, 3).map((step: string, i: number) => (
                 <li key={i}>{step}</li>
               ))}
             </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
