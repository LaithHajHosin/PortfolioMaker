import React from 'react';
import { Github, Globe, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  accentColor?: string;
}

export const Footer: React.FC<FooterProps> = ({ accentColor = '#f97316' }) => {
  return (
    <footer className="py-12 border-t border-zinc-900 bg-[#09090b] text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <span 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md"
            style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #ea580c 100%)` }}
          >
            FP
          </span>
          <span className="text-white font-semibold">FlarePort</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-500 text-xs">Production Full-Stack Portfolio Architecture</span>
        </div>

        <div className="flex items-center gap-6 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            Built with React, Express, MongoDB & Tailwind
          </span>
          <span>·</span>
          <span className="text-zinc-400">© 2026 FlarePort Studio</span>
        </div>

      </div>
    </footer>
  );
};
