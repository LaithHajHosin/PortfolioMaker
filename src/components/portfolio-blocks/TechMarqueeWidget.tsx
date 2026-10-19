import React from 'react';
import { Cpu, Terminal, Flame, Database, GitBranch, Layers, Box, Globe, Shield, Sparkles } from 'lucide-react';
import { MarqueeItem } from '../../types/portfolio.ts';

interface TechMarqueeWidgetProps {
  accentColor?: string;
  items?: MarqueeItem[];
}

export const TechMarqueeWidget: React.FC<TechMarqueeWidgetProps> = ({
  accentColor = '#f97316',
  items,
}) => {
  const defaultItems: MarqueeItem[] = [
    { label: 'PyTorch / ML' },
    { label: 'Codeforces Algorithms' },
    { label: 'TypeScript / React 19' },
    { label: 'MongoDB / Mongoose' },
    { label: 'Unity & C#' },
    { label: 'Linux & Docker' },
    { label: 'Tailwind CSS' },
    { label: 'Git & Version Control' },
    { label: 'RESTful Architecture' },
  ];

  const activeItems = items && items.length > 0 ? items : defaultItems;

  const iconCatalog = [Cpu, Flame, Terminal, Database, Box, Shield, Layers, GitBranch, Globe, Sparkles];

  return (
    <div className="w-full py-5 overflow-hidden relative border-y border-zinc-800/80 bg-zinc-950/40">
      {/* Side blur gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />

      <div className="flex gap-6 w-max animate-pulse">
        {[...activeItems, ...activeItems, ...activeItems].map((item, index) => {
          const Icon = iconCatalog[index % iconCatalog.length];
          return (
            <div
              key={index}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-300 text-xs font-mono shrink-0 hover:border-zinc-700 transition-colors"
            >
              <Icon className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
