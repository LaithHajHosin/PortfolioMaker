import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  Sparkles, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  ExternalLink, 
  Menu, 
  X,
  Compass,
  ChevronDown,
  Share2,
  Check,
  Briefcase,
  MapPin,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  currentRoute?: string;
  onNavigate: (route: string) => void;
  accentColor?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, accentColor = '#f97316' }) => {
  const { user, portfolio, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const handleNav = (route: string) => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    onNavigate(route);
  };

  const handleCopyPublicLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const url = `${window.location.origin}/${user.username}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="glass-panel rounded-2xl border border-zinc-800/80 px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between shadow-2xl relative">
          
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <span 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-lg group-hover:scale-105 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${accentColor} 0%, #ea580c 100%)`,
                boxShadow: `0 8px 20px -4px ${accentColor}40`
              }}
            >
              FP
            </span>
            <div className="hidden sm:block">
              <span className="text-white font-extrabold tracking-tight text-lg">
                FlarePort<span style={{ color: accentColor }}>.</span>
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                Portfolio Studio
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-sm font-medium text-zinc-300">
            <button
              onClick={() => handleNav('/')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                currentRoute === '/' ? 'text-white bg-zinc-800/90' : 'hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleNav('/laith_hh')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentRoute === '/laith_hh' ? 'text-white bg-zinc-800/90' : 'hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-orange-400" />
              Live Demo
            </button>
            {user && (
              <>
                <button
                  onClick={() => handleNav('/dashboard')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    currentRoute === '/dashboard' ? 'text-white bg-zinc-800/90' : 'hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-orange-400" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav('/profile')}
                  className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    currentRoute === '/profile' ? 'text-white bg-zinc-800/90' : 'hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-orange-400" />
                  Profile
                </button>
                <button
                  onClick={() => handleNav(`/${user.username}`)}
                  className="px-3.5 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                  My Public Page
                </button>
              </>
            )}
          </nav>

          {/* Right Action / Profile Dropdown Trigger */}
          <div className="hidden lg:flex items-center gap-3 relative">
            {user ? (
              <div className="relative">
                {/* Profile Trigger Button */}
                <button
                  ref={profileButtonRef}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-sm font-medium ${
                    profileDropdownOpen 
                      ? 'bg-zinc-800 border-orange-500/80 text-white ring-2 ring-orange-500/30' 
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                  }`}
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="relative">
                    {portfolio?.profileImage ? (
                      <img 
                        src={portfolio.profileImage} 
                        alt={user.username} 
                        className="w-7 h-7 rounded-lg object-cover border border-zinc-700 shadow-sm"
                      />
                    ) : (
                      <span 
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${accentColor} 0%, #ea580c 100%)`
                        }}
                      >
                        {user.username.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-zinc-900" />
                  </div>

                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold leading-tight text-white">@{user.username}</span>
                    <span className="text-[10px] text-zinc-400 font-mono leading-tight">Profile Options</span>
                  </div>

                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180 text-orange-400' : ''}`} />
                </button>

                {/* Profile Options Popover / Dropdown */}
                {profileDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 top-full mt-2.5 w-84 rounded-2xl glass-panel border border-zinc-700/80 shadow-2xl p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150 z-50 text-left bg-zinc-950/95 backdrop-blur-2xl max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain"
                    style={{ minWidth: '320px' }}
                  >
                    {/* 1. Profile Briefing Information */}
                    <div className="flex items-start gap-3 pb-3.5 border-b border-zinc-800">
                      <div className="relative shrink-0">
                        {portfolio?.profileImage ? (
                          <img 
                            src={portfolio.profileImage} 
                            alt={user.username} 
                            className="w-12 h-12 rounded-xl object-cover border-2 border-zinc-700 shadow-md"
                          />
                        ) : (
                          <span 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-md"
                            style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #ea580c 100%)` }}
                          >
                            {user.username.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-zinc-950" title="Online & Active" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-white text-sm truncate">@{user.username}</span>
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            CREATOR
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs truncate mt-0.5">{user.email}</p>
                        <p className="text-[11px] truncate mt-1 font-medium" style={{ color: accentColor }}>
                          {portfolio?.headline || 'Software Engineer & Creator'}
                        </p>
                      </div>
                    </div>

                    {/* Briefing Quick Stats */}
                    <div className="grid grid-cols-2 gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-zinc-500 block">Status</span>
                        <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {portfolio?.statusText || 'Ready for hire'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono text-zinc-500 block">Location</span>
                        <span className="text-zinc-300 font-medium text-xs truncate block mt-0.5">
                          {portfolio?.location ? (portfolio.location.length > 16 ? portfolio.location.slice(0, 16) + '...' : portfolio.location) : 'Remote Worldwide'}
                        </span>
                      </div>
                    </div>

                    {/* 2. Profile Options & Actions */}
                    <div className="space-y-1">
                      {/* Button to go to Profile Details Page */}
                      <button
                        onClick={() => handleNav('/profile')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                          currentRoute === '/profile' 
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                            : 'text-zinc-200 hover:text-white hover:bg-zinc-900 border border-transparent'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="block font-bold">Profile & Contact Info</span>
                          <span className="text-[10px] text-zinc-400 font-normal">Edit phone number, email, avatar & bio</span>
                        </div>
                        <span className="text-[10px] font-mono text-orange-400">Edit ✎</span>
                      </button>

                      {/* Button to go to Dashboard */}
                      <button
                        onClick={() => handleNav('/dashboard')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                          currentRoute === '/dashboard' 
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                            : 'text-zinc-200 hover:text-white hover:bg-zinc-900 border border-transparent'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <LayoutDashboard className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="block font-bold">Dashboard Visual Builder</span>
                          <span className="text-[10px] text-zinc-400 font-normal">Edit sections, styling & live preview</span>
                        </div>
                      </button>

                      {/* Button to view Public Page */}
                      <button
                        onClick={() => handleNav(`/${user.username}`)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-200 hover:text-white hover:bg-zinc-900 text-xs font-semibold transition-all group border border-transparent"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="block font-bold">View My Public Portfolio</span>
                          <span className="text-[10px] text-zinc-400 font-normal">Live public profile at /{user.username}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400">Live ↗</span>
                      </button>

                      {/* Button to copy Public Page URL */}
                      <button
                        type="button"
                        onClick={handleCopyPublicLink}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 text-xs font-medium transition-all group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                        </div>
                        <span className="flex-1 text-left font-semibold">
                          {copiedLink ? 'Link Copied to Clipboard!' : 'Copy Public Portfolio URL'}
                        </span>
                      </button>
                    </div>

                    {/* 3. Logout Option */}
                    <div className="pt-2 border-t border-zinc-800">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs font-bold transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out of Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor} 0%, #ea580c 100%)`
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile / Tablet Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile & Tablet Dropdown Menu with Scrollable Viewport and Full Profile Briefing */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-4 rounded-2xl glass-panel border border-zinc-800 space-y-3 shadow-2xl animate-in slide-in-from-top-2 bg-zinc-950/95 max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain touch-pan-y">
            {user && (
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-3">
                  {portfolio?.profileImage ? (
                    <img 
                      src={portfolio.profileImage} 
                      alt={user.username} 
                      className="w-10 h-10 rounded-xl object-cover border border-zinc-700 shadow-sm"
                    />
                  ) : (
                    <span 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm"
                      style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #ea580c 100%)` }}
                    >
                      {user.username.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-white text-sm block truncate">@{user.username}</span>
                    <span className="text-[11px] text-zinc-400 block truncate">{user.email}</span>
                  </div>
                  <button
                    onClick={() => handleNav('/profile')}
                    className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold shrink-0 hover:bg-orange-500/30"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="text-[11px] font-mono text-emerald-400 flex items-center justify-between pt-1 border-t border-zinc-800">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{portfolio?.statusText || 'Ready for hire'}</span>
                  </span>
                  <span className="text-zinc-400 truncate max-w-[140px]">{portfolio?.location || 'Remote'}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => handleNav('/')}
              className={`w-full text-left py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                currentRoute === '/' ? 'text-white bg-zinc-800 font-bold' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleNav('/laith_hh')}
              className={`w-full text-left py-2 px-3 rounded-lg font-medium text-sm flex items-center justify-between transition-colors ${
                currentRoute === '/laith_hh' ? 'text-white bg-zinc-800 font-bold' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <span>Explore Demo Profile</span>
              <Compass className="w-4 h-4 text-orange-400" />
            </button>

            {user ? (
              <div className="pt-2 border-t border-zinc-800 space-y-1">
                {/* Profile Edit Button */}
                <button
                  onClick={() => handleNav('/profile')}
                  className={`w-full text-left py-2.5 px-3 rounded-xl font-bold text-xs flex items-center gap-2.5 border transition-all ${
                    currentRoute === '/profile'
                      ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                      : 'bg-zinc-900/80 text-zinc-200 hover:text-white hover:bg-zinc-800 border-zinc-800'
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-orange-400" />
                  <div className="flex-1">
                    <span className="block font-bold">My Profile & Contact Details</span>
                    <span className="text-[10px] text-zinc-400 font-normal">Edit phone number, email, avatar & bio</span>
                  </div>
                  <span className="text-[10px] font-mono text-orange-400">Edit ✎</span>
                </button>

                <button
                  onClick={() => handleNav('/dashboard')}
                  className={`w-full text-left py-2.5 px-3 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
                    currentRoute === '/dashboard'
                      ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800 border-transparent'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-orange-400" />
                  <span>Dashboard Builder</span>
                </button>
                <button
                  onClick={() => handleNav(`/${user.username}`)}
                  className="w-full text-left py-2.5 px-3 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 font-medium text-xs flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  <span>View Public Page (@{user.username})</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyPublicLink}
                  className="w-full text-left py-2.5 px-3 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 font-medium text-xs flex items-center gap-2"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-sky-400" />}
                  <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Public Page Link'}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2.5 px-3 rounded-xl text-red-400 hover:bg-red-500/10 font-bold text-xs flex items-center gap-2 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-center font-semibold text-sm text-zinc-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="w-full py-2.5 px-3 rounded-xl text-center font-semibold text-sm text-white flare-gradient shadow-lg shadow-orange-500/20"
                >
                  Create Free Portfolio
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
