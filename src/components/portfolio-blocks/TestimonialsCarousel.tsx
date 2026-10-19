import React, { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Testimonial } from '../../types/portfolio.ts';

interface TestimonialsCarouselProps {
  testimonials?: Testimonial[];
  accentColor?: string;
  borderClass?: string;
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials = [],
  accentColor = '#f97316',
  borderClass = 'glass-panel',
}) => {
  if (testimonials.length === 0) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const active = testimonials[currentIndex];

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-semibold tracking-widest uppercase mb-1 block" style={{ color: accentColor }}>
          Endorsements
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Recommendations & Praise</h3>
        <div className="w-12 h-1 mx-auto mt-2 rounded-full" style={{ background: `linear-gradient(90deg, ${accentColor}, #ea580c)` }} />
      </div>

      <div className={`p-8 sm:p-12 rounded-3xl ${borderClass} max-w-4xl mx-auto relative overflow-hidden`}>
        {/* Quote watermark icon */}
        <Quote 
          className="absolute top-6 right-6 w-24 h-24 opacity-5 pointer-events-none"
          style={{ color: accentColor }}
        />

        <div className="space-y-6 relative z-10">
          <p className="text-lg sm:text-xl text-zinc-200 font-medium leading-relaxed italic">
            "{active.text}"
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-zinc-800/80">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-900 border-2 border-zinc-700 shrink-0">
                {active.avatar ? (
                  <img src={active.avatar} alt={active.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-white font-bold text-base">{active.name}</h4>
                <p className="text-xs text-zinc-400">
                  {active.role} {active.company ? `· ${active.company}` : ''}
                </p>
              </div>
            </div>

            {testimonials.length > 1 && (
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={prev}
                  className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                  aria-label="Previous recommendation"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-zinc-500 px-2">
                  {currentIndex + 1} / {testimonials.length}
                </span>
                <button
                  type="button"
                  onClick={next}
                  className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                  aria-label="Next recommendation"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
