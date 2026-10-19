import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Database, 
  ShieldCheck, 
  Palette, 
  Compass, 
  Code2, 
  ExternalLink,
  FolderGit2,
  Trophy,
  CheckCircle2,
  Terminal
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [previewAccent, setPreviewAccent] = useState('#f97316');

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden bg-grid-pattern">
      
      {/* Background radial flares */}
      <div 
        className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] blur-[180px] rounded-full pointer-events-none opacity-20"
        style={{ backgroundColor: previewAccent }}
      />

      {/* Hero Section */}
      <section className="text-center pt-10 pb-16 space-y-6 max-w-4xl mx-auto relative z-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: previewAccent }} />
          <span style={{ color: previewAccent }}>Full-Stack Developer Portfolio Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
          Engineered for <span style={{ color: previewAccent }}>developers</span> who demand real craftsmanship.
        </h1>

        <p className="text-zinc-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          Build, customize, and publish your production developer portfolio. Powered by Node.js, Express, MongoDB with Mongoose, JWT authentication, and dynamic theme rendering.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('/register')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-white font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${previewAccent} 0%, #ea580c 100%)`,
              boxShadow: `0 10px 25px -5px ${previewAccent}50`
            }}
          >
            <span>Create Your Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('/laith_hh')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-orange-400" />
            <span>Explore Demo (@laith_hh)</span>
          </button>
        </div>

        {/* Technical stack pills */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-zinc-500">
          <span className="px-3 py-1 rounded-md bg-zinc-900/80 border border-zinc-800">Node.js Express REST</span>
          <span className="px-3 py-1 rounded-md bg-zinc-900/80 border border-zinc-800">MongoDB / Mongoose ODM</span>
          <span className="px-3 py-1 rounded-md bg-zinc-900/80 border border-zinc-800">JWT & bcryptjs</span>
          <span className="px-3 py-1 rounded-md bg-zinc-900/80 border border-zinc-800">Zod Validation</span>
          <span className="px-3 py-1 rounded-md bg-zinc-900/80 border border-zinc-800">Multer 2MB Disk Uploads</span>
        </div>

      </section>

      {/* Interactive Live Preview Showcase Window */}
      <section className="my-16 max-w-5xl mx-auto">
        <div className="glass-panel rounded-3xl border border-zinc-800 p-2 shadow-2xl overflow-hidden">
          
          {/* Mock Window Titlebar */}
          <div className="px-4 py-3 bg-zinc-900/90 rounded-t-2xl flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-xs text-zinc-400">flareport.studio/laith_hh</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-400 hidden sm:inline">Live Theme Accent:</span>
              {['#f97316', '#3B82F6', '#10B981', '#F43F5E', '#8B5CF6'].map((hex) => (
                <button
                  key={hex}
                  onClick={() => setPreviewAccent(hex)}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    previewAccent === hex ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          </div>

          {/* Interactive Window Body */}
          <div className="p-6 sm:p-10 bg-[#09090b]/95 space-y-8 rounded-b-2xl">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-800/80">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-mono" style={{ color: previewAccent }}>
                  status: online · verified profile
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Laith Haj Hosin <span className="text-zinc-500 text-sm font-normal">(@laith_hh)</span>
                </h3>
                <p className="text-zinc-400 text-sm max-w-lg">
                  IT Engineering student specializing in Machine Learning, building intelligent models, competitive algorithms, and user-focused digital solutions.
                </p>
              </div>

              <button
                onClick={() => onNavigate('/laith_hh')}
                className="px-6 py-3 rounded-xl text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${previewAccent} 0%, #ea580c 100%)`
                }}
              >
                <span>Launch Full Public Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Feature Metric Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-xl border border-zinc-800">
                <span className="text-xs text-zinc-500 font-mono block mb-1">PROGRAMMING & ML</span>
                <span className="text-lg font-bold text-white block">Python · C# · C++</span>
                <span className="text-xs" style={{ color: previewAccent }}>92% proficiency benchmark</span>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-zinc-800">
                <span className="text-xs text-zinc-500 font-mono block mb-1">COMPETITIVE CODING</span>
                <span className="text-lg font-bold text-white block">Codeforces & LeetCode</span>
                <span className="text-xs text-amber-400">Distortionator profile linked</span>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-zinc-800">
                <span className="text-xs text-zinc-500 font-mono block mb-1">FLAGSHIP APPLICATION</span>
                <span className="text-lg font-bold text-white block">Stickorator AI Studio</span>
                <span className="text-xs text-emerald-400">Live production demo</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Architecture Cards */}
      <section className="py-16 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase mb-2 block" style={{ color: previewAccent }}>
            Full Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Built for True Production Standards</h2>
          <p className="text-zinc-400 text-sm mt-3">
            Every layer from database schemas and authentication to image processing and front-end styling was designed to strict software engineering standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-lg">Mongoose & Strict Schemas</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Mongoose User and Portfolio schemas enforce uniqueness, lowercase trimming, embedded skills, projects, and work experience.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-lg">JWT & bcrypt Hashing</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Stateless JWT authentication paired with salt rounds on bcryptjs. Protected endpoints require valid Bearer token headers.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-lg">Dynamic Glass & Flares</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Users dynamically adjust accent color flares, dark/light contrast modes, and layout morphology directly from the Dashboard.
            </p>
          </div>

        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="py-16 text-center max-w-4xl mx-auto glass-panel p-10 rounded-3xl border border-zinc-800 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Ready to launch your developer portfolio?
        </h2>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto">
          Sign up in seconds, customize your projects and skills, and get your personalized public URL.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('/register')}
            className="px-8 py-3.5 rounded-xl text-white font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
            style={{
              background: `linear-gradient(135deg, ${previewAccent} 0%, #ea580c 100%)`
            }}
          >
            Claim Your Portfolio Now
          </button>
          <button
            onClick={() => onNavigate('/login')}
            className="px-8 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-semibold text-sm transition-all"
          >
            Sign In to Existing Account
          </button>
        </div>
      </section>

    </div>
  );
};
