import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, CheckCircle, Loader2 } from "lucide-react";

export default function IconResult({ style, iconIndex, iconId, onStartOver }) {
  const [finalIcon, setFinalIcon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate high-quality icon when component mounts
  useEffect(() => {
    if (iconId && iconIndex !== undefined) {
      generateHighQualityIcon();
    }
  }, [iconId, iconIndex]);

  const generateHighQualityIcon = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/icons/generate-high-quality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          iconId,
          selectedVariationIndex: iconIndex
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setFinalIcon(data.finalIcon);
      } else {
        throw new Error(data.message || 'Failed to generate high-quality icon');
      }
    } catch (error) {
      console.error('Error generating high-quality icon:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!iconId) return;

    try {
      const response = await fetch(`http://localhost:3001/api/icons/download/${iconId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `iconspot_${iconId}_${style}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading icon:', error);
      alert('Failed to download icon: ' + error.message);
    }
  };
  return (
    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Icon Display */}
        <div className="flex-1 w-full">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-black p-12 flex items-center justify-center aspect-square shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-16 h-16 animate-spin text-black" />
                <span className="text-xl font-black text-black">GENERATING HIGH-QUALITY ICON...</span>
              </div>
            ) : finalIcon ? (
              <img
                src={finalIcon.url}
                alt="High-quality icon"
                className="w-64 h-64 object-contain rotate-3"
              />
            ) : (
              <div className="w-64 h-64 bg-black border-4 border-black flex items-center justify-center rotate-3">
                <span className="text-6xl font-black text-yellow-400">
                  {iconIndex + 1}
                </span>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-400 border-4 border-black p-4 mt-4 rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-lg font-bold text-black">⚠️ {error}</p>
            </div>
          )}
        </div>

        {/* Info & Actions */}
        <div className="flex-1 w-full space-y-6">
          <div className="bg-green-400 border-4 border-black p-6 rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-black" />
              <h3 className="text-2xl font-black text-black">
                ICON READY!
              </h3>
            </div>
            <p className="text-lg font-bold text-black">
              High-quality, background removed
            </p>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h4 className="text-xl font-black text-black mb-3">
              ICON DETAILS
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-black">Style:</span>
                <span className="bg-black text-white px-3 py-1 font-black uppercase">
                  {style}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-black">Format:</span>
                <span className="bg-black text-white px-3 py-1 font-black">
                  SVG / PNG
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-black">Quality:</span>
                <span className="bg-black text-white px-3 py-1 font-black">
                  HIGH-RES
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              onClick={handleDownload}
              disabled={!finalIcon || loading}
              className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-black text-xl px-8 py-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <Download className="w-6 h-6 mr-2" />
              {loading ? 'PROCESSING...' : 'DOWNLOAD ICON'}
            </Button>

            <Button
              onClick={onStartOver}
              variant="outline"
              className="w-full bg-white hover:bg-gray-100 text-black font-black text-lg px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              CREATE ANOTHER
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}