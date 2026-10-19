import React from 'react';
import { Target, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface PreviewLocateButtonProps {
  field: string;
  label: string;
  instanceIndex?: number;
  totalInstances?: number;
  currentHighlight?: { field: string; instanceIndex: number; totalInstances: number } | null;
  onLocate: (field: string, instanceOrDirection?: number | 'next' | 'prev', label?: string) => void;
  compact?: boolean;
}

export const PreviewLocateButton: React.FC<PreviewLocateButtonProps> = ({
  field,
  label,
  instanceIndex,
  totalInstances = 1,
  currentHighlight,
  onLocate,
  compact = false,
}) => {
  const isCurrentlyActive = currentHighlight?.field === field && 
    (typeof instanceIndex === 'undefined' || currentHighlight.instanceIndex === instanceIndex);
  
  const displayTotal = currentHighlight?.field === field && currentHighlight.totalInstances > 1 
    ? currentHighlight.totalInstances 
    : totalInstances;

  const currentIdx = currentHighlight?.field === field ? currentHighlight.instanceIndex : (instanceIndex ?? 0);

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onLocate(field, instanceIndex ?? 'next', label);
        }}
        title={`Highlight and scroll to "${label}" in the Live Preview`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border shadow-sm ${
          isCurrentlyActive
            ? 'bg-orange-500 text-white border-orange-400 ring-2 ring-orange-500/40 animate-pulse'
            : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-700/80 hover:border-orange-500/60'
        }`}
      >
        <Target className={`w-3 h-3 ${isCurrentlyActive ? 'text-white' : 'text-orange-400'}`} />
        <span>{compact ? 'Preview' : 'See in Preview'}</span>
        {isCurrentlyActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping ml-0.5" />
        )}
      </button>

      {/* Multi-instance navigation buttons */}
      {displayTotal > 1 && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="inline-flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5 text-[10px] font-mono text-zinc-400"
        >
          <button
            type="button"
            onClick={() => onLocate(field, 'prev', label)}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
            title="Navigate to previous instance in live preview"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <span className="px-1 font-semibold text-orange-400 min-w-[28px] text-center">
            {currentIdx + 1}/{displayTotal}
          </span>
          <button
            type="button"
            onClick={() => onLocate(field, 'next', label)}
            className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
            title="Navigate to next instance in live preview"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
