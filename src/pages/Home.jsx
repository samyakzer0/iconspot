import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Download, ChevronRight, Zap } from "lucide-react";
import StyleSelector from "../components/iconspot/StyleSelector";
import IconGrid from "../components/iconspot/IconGrid";
import IconResult from "../components/iconspot/IconResult";

// Make test function available globally for debugging
if (typeof window !== 'undefined') {
  window.testIconSpotConnectivity = async () => {
    const { testConnectivity } = await import('../lib/api.js');
    try {
      const result = await testConnectivity();
      console.log('✅ Connectivity test successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Connectivity test failed:', error);
      throw error;
    }
  };
}

export default function Home() {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [context, setContext] = useState("");
  const [step, setStep] = useState("input"); // input, variations, final
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [currentIconId, setCurrentIconId] = useState(null);

  const handleGenerate = async () => {
    if (selectedStyle && context) {
      setStep("variations");
    }
  };

  const handleIconSelect = (iconIndex) => {
    setSelectedIcon(iconIndex);
    setStep("final");
  };

  const handleStartOver = () => {
    setStep("input");
    setSelectedIcon(null);
    setContext("");
    setSelectedStyle(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Hero Section */}
      <div className="border-b-4 border-black bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-black border-4 border-black flex items-center justify-center rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-6xl font-black text-black mb-2 -rotate-1">
                ICONSPOT
              </h1>
              <p className="text-xl font-bold text-black">
                Generate Custom Icons in Seconds
              </p>
            </div>
          </div>
          <div className="bg-white border-4 border-black p-4 inline-block rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-lg font-bold text-black">
              Pick Style → Describe → Generate → Download
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {step === "input" && (
          <div className="space-y-8">
            {/* Style Selection */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-black text-white px-4 py-2 text-2xl font-black border-4 border-black rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  STEP 1
                </div>
                <h2 className="text-3xl font-black text-black">
                  Choose Your Style
                </h2>
              </div>
              <StyleSelector
                selectedStyle={selectedStyle}
                onStyleSelect={setSelectedStyle}
              />
            </div>

            {/* Context Input */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-black text-white px-4 py-2 text-2xl font-black border-4 border-black -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  STEP 2
                </div>
                <h2 className="text-3xl font-black text-black">
                  Describe Your Icons
                </h2>
              </div>
              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="E.g., A shopping cart icon for an e-commerce app, simple and recognizable..."
                  className="min-h-[200px] text-lg border-4 border-black font-bold resize-none focus:ring-0 focus:border-black"
                />
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleGenerate}
                    disabled={!selectedStyle || !context}
                    className="bg-cyan-400 hover:bg-cyan-500 text-black font-black text-xl px-8 py-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    GENERATE ICONS
                    <Zap className="w-6 h-6 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "variations" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-black text-white px-4 py-2 text-2xl font-black border-4 border-black rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                STEP 3
              </div>
              <h2 className="text-3xl font-black text-black">
                Pick Your Favorite
              </h2>
            </div>
            <IconGrid
              style={selectedStyle}
              context={context}
              onIconSelect={handleIconSelect}
              onStartOver={handleStartOver}
              onIconIdGenerated={setCurrentIconId}
            />
          </div>
        )}

        {step === "final" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-black text-white px-4 py-2 text-2xl font-black border-4 border-black -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                DONE!
              </div>
              <h2 className="text-3xl font-black text-black">
                Your High-Quality Icon
              </h2>
            </div>
            <IconResult
              style={selectedStyle}
              iconIndex={selectedIcon}
              iconId={currentIconId}
              onStartOver={handleStartOver}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t-4 border-black bg-pink-400 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="bg-black text-white px-6 py-4 inline-block border-4 border-black rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-xl font-black">
              Made with ICONSPOT © 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}