import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, CheckCircle2, Loader2 } from "lucide-react";

export default function IconGrid({ style, context, onIconSelect, onStartOver, onIconIdGenerated }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate icons when component mounts or when style/context changes
  useEffect(() => {
    if (style && context) {
      generateIcons();
    }
  }, [style, context]);

  const generateIcons = async () => {
    setLoading(true);
    setError(null);

    try {
      const { apiCall, API_ENDPOINTS } = await import('../../lib/api.js');
      const response = await apiCall(API_ENDPOINTS.GENERATE_ICONS, {
        method: 'POST',
        body: JSON.stringify({ style, context }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setIcons(data.variations);
        if (onIconIdGenerated) {
          onIconIdGenerated(data.iconId);
        }
      } else {
        throw new Error(data.message || 'Failed to generate icons');
      }
    } catch (error) {
      console.error('Error generating icons:', error);
      setError(error.message);

      // Fallback to mock data for development
      setIcons([
        { id: 'mock_1', label: "Variation 1", url: null },
        { id: 'mock_2', label: "Variation 2", url: null },
        { id: 'mock_3', label: "Variation 3", url: null },
        { id: 'mock_4', label: "Variation 4", url: null }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (index) => {
    setSelectedIndex(index);
    setTimeout(() => {
      onIconSelect(index);
    }, 300);
  };

  return (
    <div>
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="bg-yellow-400 border-4 border-black p-6 rotate-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <span className="text-xl font-black text-black">GENERATING ICONS...</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-400 border-4 border-black p-6 mb-8 rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-lg font-bold text-black">⚠️ {error}</p>
            <p className="text-sm font-bold text-black mt-2">Using placeholder icons for demo</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 mb-8">
          {icons.map((icon, index) => (
            <button
              key={icon.id}
              onClick={() => handleSelect(index)}
              disabled={loading}
              className={`group relative aspect-square bg-gray-100 border-4 border-black flex flex-col items-center justify-center transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedIndex === index
                  ? "shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] translate-x-[-4px] translate-y-[-4px] bg-yellow-400"
                  : "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              {selectedIndex === index && (
                <div className="absolute -top-4 -right-4 bg-black text-yellow-400 rounded-full p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              )}

              {/* Icon display */}
              <div className="w-32 h-32 bg-black border-4 border-black mb-4 flex items-center justify-center overflow-hidden">
                {icon.url ? (
                  <img
                    src={icon.url}
                    alt={`Icon variation ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-black text-white">
                    {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : (index + 1)}
                  </span>
                )}
              </div>

              <span className="text-xl font-black text-black">
                {icon.label || `Variation ${index + 1}`}
              </span>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 border-t-4 border-black">
          <Button
            onClick={onStartOver}
            className="bg-red-400 hover:bg-red-500 text-black font-black text-lg px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            START OVER
          </Button>
          
          <div className="bg-yellow-400 border-4 border-black px-6 py-3 rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-lg font-black text-black">
              Click any icon to select it!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}