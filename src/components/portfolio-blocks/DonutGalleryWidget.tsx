import React, { useState } from 'react';
import { Terminal, Code, Cpu, Database, GitBranch, Layers, Sparkles, Box } from 'lucide-react';
import { OrbitNode } from '../../types/portfolio.ts';

interface DonutGalleryWidgetProps {
  accentColor?: string;
  borderClass?: string;
  nodes?: OrbitNode[];
}

export const DonutGalleryWidget: React.FC<DonutGalleryWidgetProps> = ({
  accentColor = '#f97316',
  borderClass = 'glass-panel',
  nodes,
}) => {
  const defaultNodes: OrbitNode[] = [
    { name: 'Python', desc: 'Machine learning pipelines & PyTorch models' },
    { name: 'C# / .NET', desc: 'Object-oriented architecture & Unity systems' },
    { name: 'JavaScript', desc: 'Full-stack reactive web applications' },
    { name: 'C++', desc: 'High-performance algorithms & data structures' },
    { name: 'Unity', desc: 'Interactive 3D simulations & shaders' },
    { name: 'MySQL', desc: 'Relational data modeling & query optimizations' },
    { name: 'Git & GitHub', desc: 'Collaborative version control & CI/CD' },
    { name: 'Blender 3D', desc: 'Geometric meshes & procedural modeling' },
  ];

  const activeNodes = nodes && nodes.length > 0 ? nodes : defaultNodes;
  const [activeTech, setActiveTech] = useState<string | null>(activeNodes[0]?.name || 'Core Stack');

  const icons = [Code, Cpu, Terminal, Code, Box, Database, GitBranch, Layers, Sparkles];

  return (
    <div className={`p-6 sm:p-8 rounded-3xl ${borderClass} space-y-6 relative overflow-hidden`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase mb-1 block" style={{ color: accentColor }}>
            Interactive Orbit Gallery
          </span>
          <h4 className="text-white font-bold text-xl flex items-center gap-2">
            <span>Radial Technology Wheel</span>
          </h4>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          Hover or tap nodes to inspect
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-4">
        {/* Orbit Grid Representation */}
        <div className="md:col-span-7 flex justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-zinc-800 flex items-center justify-center p-4">
            {/* Ambient center ring */}
            <div 
              className="w-28 h-28 rounded-full flex flex-col items-center justify-center text-center p-2 z-10 shadow-2xl glass-panel border"
              style={{ borderColor: `${accentColor}40` }}
            >
              <Sparkles className="w-5 h-5 mb-1" style={{ color: accentColor }} />
              <span className="text-white font-bold text-xs">{activeTech || 'Core Stack'}</span>
              <span className="text-[10px] text-zinc-400 font-mono">Expertise</span>
            </div>

            {/* Orbiting nodes */}
            {activeNodes.map((tech, idx) => {
              const count = activeNodes.length;
              const angle = (idx * 360) / count;
              const radius = 105; // radius in px
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;
              const IconComp = icons[idx % icons.length];
              const isSelected = activeTech === tech.name;

              return (
                <button
                  key={`${tech.name}-${idx}`}
                  type="button"
                  onMouseEnter={() => setActiveTech(tech.name)}
                  onClick={() => setActiveTech(tech.name)}
                  className={`absolute w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'scale-125 z-20 shadow-lg text-white'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:scale-110'
                  }`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    background: isSelected ? `linear-gradient(135deg, ${accentColor}, #ea580c)` : undefined,
                    boxShadow: isSelected ? `0 0 16px ${accentColor}80` : undefined,
                  }}
                  title={tech.name}
                >
                  <IconComp className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Node detail display */}
        <div className="md:col-span-5 space-y-3">
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">{activeTech}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-emerald-400 font-mono">
                verified
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {activeNodes.find((t) => t.name === activeTech)?.desc ||
                'High-performance technical implementation and deep algorithmic fluency.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {activeNodes.map((tech) => (
              <button
                key={tech.name}
                type="button"
                onClick={() => setActiveTech(tech.name)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  activeTech === tech.name
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'bg-zinc-900/60 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
