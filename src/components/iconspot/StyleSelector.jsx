import React from "react";
import { Sparkles, Zap, Cpu, Minimize2 } from "lucide-react";

const styles = [
  {
    id: "glass",
    name: "GLASS",
    icon: Sparkles,
    color: "bg-blue-400",
    description: "Transparent & Glossy"
  },
  {
    id: "neon",
    name: "NEON",
    icon: Zap,
    color: "bg-pink-400",
    description: "Bright & Glowing"
  },
  {
    id: "cyberpunk",
    name: "CYBERPUNK",
    icon: Cpu,
    color: "bg-purple-400",
    description: "Futuristic & Tech"
  },
  {
    id: "minimal",
    name: "MINIMAL",
    icon: Minimize2,
    color: "bg-green-400",
    description: "Simple & Clean"
  }
];

export default function StyleSelector({ selectedStyle, onStyleSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {styles.map((style) => {
        const Icon = style.icon;
        const isSelected = selectedStyle === style.id;
        
        return (
          <button
            key={style.id}
            onClick={() => onStyleSelect(style.id)}
            className={`group relative ${style.color} border-4 border-black p-6 transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] ${
              isSelected 
                ? "shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] translate-x-[-4px] translate-y-[-4px]" 
                : "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            {isSelected && (
              <div className="absolute -top-3 -right-3 bg-black text-yellow-400 px-3 py-1 border-4 border-black rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-sm font-black">SELECTED!</span>
              </div>
            )}
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-black border-4 border-black flex items-center justify-center mb-4 rotate-6 group-hover:rotate-12 transition-transform">
                <Icon className={`w-8 h-8 ${isSelected ? 'text-yellow-400' : 'text-white'}`} />
              </div>
              <h3 className="text-2xl font-black text-black mb-2">
                {style.name}
              </h3>
              <p className="text-lg font-bold text-black">
                {style.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}