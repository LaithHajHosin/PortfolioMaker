import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw, Play } from 'lucide-react';

interface InteractiveCanvasWidgetProps {
  accentColor?: string;
  borderClass?: string;
  defaultText?: string;
}

export const InteractiveCanvasWidget: React.FC<InteractiveCanvasWidgetProps> = ({
  accentColor = '#f97316',
  borderClass = 'glass-panel',
  defaultText = 'LEO',
}) => {
  const [word, setWord] = useState(defaultText);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const drawCanvas = (textToDraw: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const w = canvas.width;
    const h = canvas.height;

    // Reset background
    ctx.fillStyle = '#0d0d10';
    ctx.fillRect(0, 0, w, h);

    // Radial flare glow
    const grad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h) / 1.5);
    grad.addColorStop(0, `${accentColor}25`);
    grad.addColorStop(1, '#0d0d10');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Particle nodes array
    const particles = Array.from({ length: 30 }).map((_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 2.5 + 1,
    }));

    let progress = 0;
    const render = () => {
      ctx.fillStyle = 'rgba(13, 13, 16, 0.2)';
      ctx.fillRect(0, 0, w, h);

      // Draw particles
      ctx.fillStyle = accentColor;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw glowing text
      ctx.font = 'bold 54px "Fira Code", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 18;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.strokeText(textToDraw.toUpperCase(), w / 2, h / 2);

      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.fillText(textToDraw.toUpperCase(), w / 2, h / 2);

      progress++;
      if (progress < 180) {
        animationRef.current = requestAnimationFrame(render);
      }
    };

    render();
  };

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = canvasRef.current.parentElement?.clientWidth || 700;
      canvasRef.current.height = 220;
      drawCanvas(word);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [word, accentColor]);

  return (
    <div className={`p-6 rounded-2xl ${borderClass} space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-white font-bold text-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
            <span>Interactive Generative Canvas</span>
          </h4>
          <p className="text-zinc-400 text-xs">Custom path drawing & particle vector field simulation</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            maxLength={10}
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Type word..."
            className="w-32 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
          />
          <button
            type="button"
            onClick={() => drawCanvas(word || 'LEO')}
            className="px-3 py-1.5 rounded-xl text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #ea580c)` }}
          >
            <Play className="w-3 h-3" />
            <span>Draw</span>
          </button>
        </div>
      </div>

      <div className="w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
        <canvas ref={canvasRef} className="w-full block" />
      </div>
    </div>
  );
};
