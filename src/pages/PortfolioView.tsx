import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { PublicPortfolioData, Portfolio, User as UserType } from '../types/portfolio.ts';
import { 
  Github, 
  Linkedin, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  Share2, 
  Check, 
  Send, 
  Code2, 
  Layers, 
  Trophy, 
  User, 
  ArrowUpRight,
  ChevronRight,
  Twitter,
  MessageSquare,
  Video,
  FileText,
  Flame
} from 'lucide-react';

import { GithubStatsCard } from '../components/portfolio-blocks/GithubStatsCard.tsx';
import { CertificationsGrid } from '../components/portfolio-blocks/CertificationsGrid.tsx';
import { TestimonialsCarousel } from '../components/portfolio-blocks/TestimonialsCarousel.tsx';
import { InteractiveCanvasWidget } from '../components/portfolio-blocks/InteractiveCanvasWidget.tsx';
import { DonutGalleryWidget } from '../components/portfolio-blocks/DonutGalleryWidget.tsx';
import { TechMarqueeWidget } from '../components/portfolio-blocks/TechMarqueeWidget.tsx';

interface PortfolioViewProps {
  username?: string;
  previewData?: Portfolio;
  previewUser?: UserType;
  isEmbedded?: boolean;
  onNavigate?: (route: string) => void;
  onShowToast?: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  activeHighlightField?: string;
  activeHighlightIndex?: number;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ 
  username, 
  previewData, 
  previewUser, 
  isEmbedded = false,
  onNavigate, 
  onShowToast,
  activeHighlightField,
  activeHighlightIndex
}) => {
  const [data, setData] = useState<PublicPortfolioData | null>(null);
  const [loading, setLoading] = useState<boolean>(!previewData);
  const [error, setError] = useState<string | null>(null);

  // Active filter for projects
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Contact form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Typewriter
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Use preview data if provided
  useEffect(() => {
    if (previewData && previewUser) {
      setData({ user: previewUser, portfolio: previewData });
      setLoading(false);
      setError(null);
      return;
    }

    if (!username) return;
    const safeUsername = username;

    let isMounted = true;
    async function fetchPortfolio() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.portfolio.getPublic(safeUsername);
        if (isMounted) {
          if (res.success && res.data) {
            setData(res.data);
          } else {
            setError(res.message || 'Portfolio not found.');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || `Portfolio for "${username}" does not exist.`);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchPortfolio();
    return () => {
      isMounted = false;
    };
  }, [username, previewData, previewUser]);

  // Typewriter effect using custom phrases or headline
  useEffect(() => {
    if (!data) return;
    const customPhrases = data.portfolio.typewriterPhrases;
    const specialties = (customPhrases && customPhrases.length > 0)
      ? customPhrases
      : [
          data.portfolio.headline || 'Software Engineering',
          ...data.portfolio.skills.slice(0, 3).map(s => `${s.name} architecture`),
          'user-focused high-impact solutions.',
        ];

    let timer: NodeJS.Timeout;
    const currentSpecialty = specialties[typewriterIndex % specialties.length];

    if (!isDeleting) {
      if (typewriterText.length < currentSpecialty.length) {
        timer = setTimeout(() => {
          setTypewriterText(currentSpecialty.slice(0, typewriterText.length + 1));
        }, 60);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (typewriterText.length > 0) {
        timer = setTimeout(() => {
          setTypewriterText(currentSpecialty.slice(0, typewriterText.length - 1));
        }, 30);
      } else {
        setIsDeleting(false);
        setTypewriterIndex(prev => prev + 1);
      }
    }

    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, typewriterIndex, data]);

  const handleShareClick = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    if (onShowToast) onShowToast('Portfolio link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      if (onShowToast) onShowToast('Please fill out all required contact fields.', 'warning');
      return;
    }
    setContactSubmitting(true);
    setTimeout(() => {
      setContactSubmitting(false);
      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
      if (onShowToast) onShowToast('Thank you! Your message has been sent successfully.', 'success');
      setTimeout(() => setContactSuccess(false), 6000);
    }, 800);
  };

  if (loading) {
    return (
      <div className={`min-h-[500px] flex items-center justify-center bg-[#09090b] text-white ${isEmbedded ? 'rounded-2xl' : 'min-h-screen'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-2xl flare-gradient flex items-center justify-center animate-spin shadow-xl shadow-orange-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <p className="font-mono text-xs text-orange-400 uppercase tracking-widest animate-pulse">
            Rendering Portfolio...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`pt-24 pb-20 flex items-center justify-center px-4 bg-[#09090b] text-white ${isEmbedded ? 'rounded-2xl' : 'min-h-screen'}`}>
        <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-zinc-800 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 mx-auto flex items-center justify-center text-xl font-bold">
            404
          </div>
          <h2 className="text-xl font-extrabold text-white">Portfolio Not Found</h2>
          <p className="text-zinc-400 text-xs">
            {error || `The user @${username} does not have a public portfolio registered yet.`}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate && onNavigate('/')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold"
            >
              Back to Overview
            </button>
            <button
              onClick={() => onNavigate && onNavigate('/register')}
              className="flex-1 py-2.5 px-4 rounded-xl flare-gradient text-white text-xs font-bold shadow-lg shadow-orange-500/20"
            >
              Claim this Username
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { user: profileUser, portfolio } = data;
  const theme = portfolio.themeSettings || {
    accentColor: '#f97316',
    mode: 'dark',
    layout: 'glass',
    backgroundStyle: 'grid',
    borderStyle: 'subtle',
    textAnimation: 'typewriter',
    fontFamily: 'inter',
  };

  const accentColor = theme.accentColor || '#f97316';
  const isLight = theme.mode === 'light';

  // Compute CSS classes from themeSettings
  const bgClass = 
    theme.backgroundStyle === 'solid' ? 'bg-style-solid' :
    theme.backgroundStyle === 'gradient' ? 'bg-style-gradient' :
    theme.backgroundStyle === 'mesh' ? 'bg-style-mesh' :
    theme.backgroundStyle === 'particles' ? 'bg-style-particles' : 'bg-style-grid';

  const borderClass = 
    theme.borderStyle === 'glow' ? 'border-glow' :
    theme.borderStyle === 'neon' ? 'border-neon' :
    theme.borderStyle === 'glass' ? 'border-glass' :
    theme.borderStyle === 'sharp' ? 'border-sharp' : 'border-subtle';

  const fontClass = 
    theme.fontFamily === 'fira' ? 'font-fira' :
    theme.fontFamily === 'jakarta' ? 'font-jakarta' :
    theme.fontFamily === 'space' ? 'font-space' : 'font-inter';

  const textAnimClass = 
    theme.textAnimation === 'fade-slide' ? 'anim-fade-slide' :
    theme.textAnimation === 'glitch' ? 'anim-glitch' : '';

  const getHighlightStyles = (field: string, instanceIdx = 0) => {
    if (!activeHighlightField || activeHighlightField !== field) return '';
    if (typeof activeHighlightIndex === 'number' && activeHighlightIndex !== instanceIdx) return '';
    return 'ring-4 ring-orange-500 shadow-[0_0_35px_rgba(249,115,22,0.9)] scale-[1.01] transition-all duration-300 relative z-30 rounded-2xl';
  };

  const renderHighlightBadge = (field: string, label: string, instanceIdx = 0) => {
    if (!activeHighlightField || activeHighlightField !== field) return null;
    if (typeof activeHighlightIndex === 'number' && activeHighlightIndex !== instanceIdx) return null;
    return (
      <div className="absolute -top-3.5 left-3 z-50 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-mono text-[10px] font-bold shadow-2xl border border-white/20 flex items-center gap-1.5 animate-bounce pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        <span>🎯 Focus: {label}</span>
      </div>
    );
  };

  // Render hero title with customizable highlight word
  const renderHeroTitle = () => {
    const rawTitle = portfolio.heroTitle || 'Engineering digital flare into products.';
    const highlight = portfolio.heroHighlightWord || 'digital flare';
    const isHighlightWordActive = activeHighlightField === 'hero-highlight';

    if (highlight && rawTitle.toLowerCase().includes(highlight.toLowerCase())) {
      const idx = rawTitle.toLowerCase().indexOf(highlight.toLowerCase());
      const before = rawTitle.substring(0, idx);
      const matched = rawTitle.substring(idx, idx + highlight.length);
      const after = rawTitle.substring(idx + highlight.length);
      return (
        <>
          {before}
          <span 
            data-preview-field="hero-highlight"
            data-preview-instance="0"
            style={{ color: accentColor }}
            className={`transition-all relative inline-block ${
              isHighlightWordActive 
                ? 'ring-4 ring-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-xl shadow-[0_0_30px_rgba(249,115,22,0.9)] scale-105' 
                : ''
            }`}
          >
            {renderHighlightBadge('hero-highlight', 'Highlight Word', 0)}
            {matched}
          </span>
          {after}
        </>
      );
    }
    return rawTitle;
  };

  // Enabled components list with default fallback
  const enabled = portfolio.enabledComponents && portfolio.enabledComponents.length > 0
    ? portfolio.enabledComponents
    : ['hero', 'tech-marquee', 'about', 'skills', 'donut-orbit', 'experience', 'projects', 'github-stats', 'certifications', 'testimonials', 'interactive-canvas', 'contact'];

  // Group skills by category
  const skillsByCategory = portfolio.skills.reduce((acc, skill) => {
    const cat = skill.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof portfolio.skills>);

  // Projects filter
  const allProjects = portfolio.projects || [];
  const filteredProjects = activeCategory === 'all'
    ? allProjects
    : allProjects.filter(p => p.techStack.some(t => t.toLowerCase().includes(activeCategory.toLowerCase())));

  const availableTags = Array.from(
    new Set(allProjects.flatMap(p => p.techStack || []))
  ).slice(0, 5);

  // Resolve all social links dynamically (standard + dynamic + custom)
  const resolvedSocials = (() => {
    const s = portfolio.socialLinks || {};
    if (s.dynamicLinks && s.dynamicLinks.length > 0) {
      return s.dynamicLinks.filter(item => item.url && item.url.trim());
    }
    const list: Array<{ id: string; platform: string; url: string }> = [];
    if (s.github) list.push({ id: 'github', platform: 'GitHub', url: s.github });
    if (s.linkedin) list.push({ id: 'linkedin', platform: 'LinkedIn', url: s.linkedin });
    if (s.codeforces) list.push({ id: 'codeforces', platform: 'Codeforces', url: s.codeforces });
    if (s.leetcode) list.push({ id: 'leetcode', platform: 'LeetCode', url: s.leetcode });
    if (s.twitter) list.push({ id: 'twitter', platform: 'Twitter / X', url: s.twitter });
    if (s.website) list.push({ id: 'website', platform: 'Website', url: s.website });
    if (s.facebook) list.push({ id: 'facebook', platform: 'Facebook', url: s.facebook });
    if (s.instagram) list.push({ id: 'instagram', platform: 'Instagram', url: s.instagram });
    if (s.customSocials) {
      s.customSocials.forEach((cs, i) => {
        if (cs.url && cs.url.trim()) {
          list.push({ id: `cs-${i}`, platform: cs.platform, url: cs.url });
        }
      });
    }
    return list;
  })();

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return <Github className="w-4 h-4" />;
    if (p.includes('linkedin')) return <Linkedin className="w-4 h-4 text-sky-400" />;
    if (p.includes('codeforces')) return <Trophy className="w-4 h-4 text-amber-400" />;
    if (p.includes('leetcode')) return <Code2 className="w-4 h-4 text-amber-500" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-4 h-4 text-sky-400" />;
    if (p.includes('discord')) return <MessageSquare className="w-4 h-4 text-indigo-400" />;
    if (p.includes('youtube') || p.includes('video')) return <Video className="w-4 h-4 text-rose-500" />;
    if (p.includes('telegram')) return <Send className="w-4 h-4 text-sky-500" />;
    if (p.includes('website') || p.includes('web') || p.includes('blog')) return <Globe className="w-4 h-4 text-emerald-400" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <div 
      className={`relative min-h-screen ${isLight ? 'bg-zinc-50 text-zinc-900' : 'bg-[#09090b] text-zinc-100'} selection:bg-orange-500 selection:text-white overflow-x-hidden ${fontClass} ${bgClass}`}
      style={{
        '--accent-color': accentColor,
        '--accent-glow': `${accentColor}40`,
      } as React.CSSProperties}
    >
      {/* Dynamic ambient radial flares */}
      {theme.backgroundStyle !== 'solid' && (
        <>
          <div 
            className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] blur-[180px] rounded-full pointer-events-none opacity-20"
            style={{ backgroundColor: accentColor }}
          />
          <div 
            className="fixed bottom-10 right-10 w-[420px] h-[420px] blur-[160px] rounded-full pointer-events-none opacity-15"
            style={{ backgroundColor: accentColor }}
          />
        </>
      )}

      {/* Render modular components according to ordered enabledComponents */}
      <div className="space-y-0">
        {enabled.map((componentKey) => {
          
          /* 1. HERO SECTION */
          if (componentKey === 'hero') {
            return (
              <section key="hero" id="hero" className={`relative min-h-[90vh] flex items-center justify-center ${isEmbedded ? 'pt-12 pb-16' : 'pt-32 pb-20'} overflow-hidden`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Content */}
                    <div className="lg:col-span-7 order-2 lg:order-1 space-y-6 text-center lg:text-left">
                      <div 
                        data-preview-field="headline"
                        data-preview-instance="0"
                        className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs sm:text-sm font-medium shadow-xl backdrop-blur-md relative transition-all ${getHighlightStyles('headline', 0)}`}
                      >
                        {renderHighlightBadge('headline', 'Headline Badge', 0)}
                        <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
                        <span style={{ color: accentColor }}>{portfolio.headline || 'Software Engineer & Specialist'}</span>
                      </div>

                      <div 
                        data-preview-field="hero-title"
                        data-preview-instance="0"
                        className={`relative transition-all p-1 -m-1 rounded-2xl ${getHighlightStyles('hero-title', 0)}`}
                      >
                        {renderHighlightBadge('hero-title', 'Hero Title', 0)}
                        <h1 className={`text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] ${textAnimClass}`}>
                          {renderHeroTitle()}
                        </h1>
                      </div>

                      <div
                        data-preview-field="username"
                        data-preview-instance="0"
                        className={`relative transition-all p-1 -m-1 rounded-xl ${getHighlightStyles('username', 0)} ${getHighlightStyles('hero-subtitle', 0)}`}
                      >
                        {renderHighlightBadge('username', 'Name in Greeting', 0)}
                        {renderHighlightBadge('hero-subtitle', 'Hero Subtitle', 0)}
                        <p 
                          data-preview-field="hero-subtitle"
                          data-preview-instance="0"
                          className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
                        >
                          {portfolio.heroSubtitle || `Hi, I'm @${profileUser.username}. Crafting:`}
                        </p>
                      </div>

                      {/* Animated text specialty */}
                      <div 
                        data-preview-field="typewriter"
                        data-preview-instance="0"
                        className={`flex items-center justify-center lg:justify-start h-10 relative transition-all p-1 rounded-xl ${getHighlightStyles('typewriter', 0)}`}
                      >
                        {renderHighlightBadge('typewriter', 'Typewriter Phrases', 0)}
                        {theme.textAnimation === 'typewriter' ? (
                          <span 
                            className="font-mono text-xl sm:text-2xl font-semibold border-r-2 pr-2 animate-pulse"
                            style={{ color: accentColor, borderColor: accentColor }}
                          >
                            {typewriterText}
                          </span>
                        ) : (
                          <span 
                            className={`text-xl sm:text-2xl font-semibold ${textAnimClass}`}
                            style={{ color: accentColor }}
                          >
                            {portfolio.headline || 'Software Engineering & Intelligent Systems'}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                        <a
                          href="#projects"
                          className="cool-button-content inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-semibold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
                          style={{
                            background: `linear-gradient(135deg, ${accentColor} 0%, #ea580c 100%)`,
                            boxShadow: `0 10px 25px -5px ${accentColor}40`
                          }}
                        >
                          <span>Explore Projects</span>
                          <ChevronRight className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          onClick={handleShareClick}
                          className="ghost-btn inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm transition-all"
                          style={{
                            borderColor: `${accentColor}60`,
                            color: accentColor,
                          }}
                        >
                          {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                          <span>{copiedLink ? 'Link Copied!' : 'Share Profile'}</span>
                        </button>

                        <a
                          href="#contact"
                          className="px-6 py-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-semibold text-sm transition-all flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Let's Talk</span>
                        </a>

                        {portfolio.resumeUrl && (
                          <a
                            data-preview-field="resume-url"
                            data-preview-instance="0"
                            href={portfolio.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-6 py-3.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-semibold text-sm transition-all flex items-center gap-2 relative ${getHighlightStyles('resume-url', 0)}`}
                          >
                            {renderHighlightBadge('resume-url', 'Resume Link', 0)}
                            <FileText className="w-4 h-4 text-orange-400" />
                            <span>Resume / CV</span>
                          </a>
                        )}
                      </div>

                      {/* Social Links Row (Dynamic Unlimited) */}
                      {resolvedSocials.length > 0 && (
                        <div 
                          data-preview-field="social-links"
                          data-preview-instance="0"
                          className={`pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-zinc-400 text-xs sm:text-sm relative transition-all rounded-xl p-1.5 ${getHighlightStyles('social-links', 0)}`}
                        >
                          {renderHighlightBadge('social-links', 'Social Links Row', 0)}
                          <span className="text-zinc-500 uppercase tracking-wider text-xs font-semibold mr-1">Connect:</span>
                          {resolvedSocials.map((sItem) => (
                            <a
                              key={sItem.id}
                              href={sItem.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 text-zinc-300 shadow-sm"
                            >
                              {getPlatformIcon(sItem.platform)}
                              <span>{sItem.platform}</span>
                            </a>
                          ))}
                        </div>
                      )}

                    </div>

                    {/* Right Profile Card */}
                    <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center">
                      <div className="relative w-[19rem] h-[21rem] sm:w-[24rem] sm:h-[26rem] tilt-card group">
                        <div 
                          className="absolute inset-0 rounded-3xl blur-2xl opacity-40 animate-pulse transition-opacity"
                          style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #ea580c 100%)` }}
                        />
                        
                        <div className={`relative w-full h-full rounded-3xl ${borderClass} p-6 flex flex-col items-center justify-center shadow-2xl overflow-hidden`}>
                          
                          <div 
                            data-preview-field="profile-image"
                            data-preview-instance="0"
                            className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl border-2 mb-4 bg-zinc-950 transition-all ${getHighlightStyles('profile-image', 0)}`} 
                            style={{ borderColor: `${accentColor}50` }}
                          >
                            {renderHighlightBadge('profile-image', 'Profile Photo', 0)}
                            {portfolio.profileImage ? (
                              <img
                                src={portfolio.profileImage}
                                alt={profileUser.username}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
                                <User className="w-16 h-16" />
                              </div>
                            )}
                          </div>

                          <div className="text-center z-10 space-y-1">
                            <div 
                              data-preview-field="username"
                              data-preview-instance="1"
                              className={`relative transition-all px-2 py-0.5 rounded-xl ${getHighlightStyles('username', 1)}`}
                            >
                              {renderHighlightBadge('username', 'Username in Card', 1)}
                              <h3 className="text-white font-bold text-xl sm:text-2xl tracking-tight">@{profileUser.username}</h3>
                            </div>

                            <div
                              data-preview-field="headline"
                              data-preview-instance="1"
                              className={`relative transition-all px-2 py-0.5 rounded-xl ${getHighlightStyles('headline', 1)}`}
                            >
                              {renderHighlightBadge('headline', 'Headline in Card', 1)}
                              <p className="text-xs sm:text-sm tracking-wider uppercase font-semibold" style={{ color: accentColor }}>
                                {portfolio.headline || 'Software Engineer'}
                              </p>
                            </div>
                          </div>

                          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-zinc-500 font-mono">
                            <span>status: online</span>
                            <div 
                              data-preview-field="status-text"
                              data-preview-instance="0"
                              className={`relative transition-all px-2 py-0.5 rounded-lg ${getHighlightStyles('status-text', 0)}`}
                            >
                              {renderHighlightBadge('status-text', 'Status Badge', 0)}
                              <span className="text-emerald-400 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                {portfolio.statusText || 'ready'}
                              </span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </section>
            );
          }

          /* 2. TECH MARQUEE WIDGET */
          if (componentKey === 'tech-marquee') {
            return (
              <div
                key="tech-marquee"
                data-preview-field="tech-marquee"
                data-preview-instance="0"
                className={`relative transition-all ${getHighlightStyles('tech-marquee', 0)}`}
              >
                {renderHighlightBadge('tech-marquee', 'Tech Marquee Ticker', 0)}
                <TechMarqueeWidget 
                  accentColor={accentColor} 
                  items={portfolio.marqueeItems}
                />
              </div>
            );
          }

          /* 3. ABOUT SECTION */
          if (componentKey === 'about') {
            return (
              <section key="about" id="about" className="py-20 relative bg-zinc-900/30 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-14">
                    <div 
                      data-preview-field="about-subtitle"
                      data-preview-instance="0"
                      className={`relative inline-block transition-all px-2 py-0.5 rounded-lg ${getHighlightStyles('about-subtitle', 0)}`}
                    >
                      {renderHighlightBadge('about-subtitle', 'About Subtitle', 0)}
                      <span className="text-xs font-semibold tracking-widest uppercase mb-2 block" style={{ color: accentColor }}>
                        {portfolio.aboutSubtitle || 'System Overview'}
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">About Me</h2>
                    <div className="w-16 h-1 mx-auto mt-3 rounded-full" style={{ background: `linear-gradient(90deg, ${accentColor}, #ea580c)` }} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-6 space-y-5">
                      <div
                        data-preview-field="about-title"
                        data-preview-instance="0"
                        className={`relative transition-all p-1 -m-1 rounded-xl ${getHighlightStyles('about-title', 0)}`}
                      >
                        {renderHighlightBadge('about-title', 'About Main Title', 0)}
                        <h3 className="text-2xl font-bold text-white leading-snug">
                          {portfolio.aboutTitle || 'Bridging technical rigor with human-centric interfaces.'}
                        </h3>
                      </div>
                      
                      <div
                        data-preview-field="bio"
                        data-preview-instance="0"
                        className={`relative transition-all p-2 -m-2 rounded-xl ${getHighlightStyles('bio', 0)}`}
                      >
                        {renderHighlightBadge('bio', 'Biography Narrative', 0)}
                        <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                          {portfolio.bio || 'Passionate software engineer building resilient web platforms and intelligent computational systems.'}
                        </p>
                      </div>

                      {/* Customizable dynamic metrics */}
                      <div 
                        data-preview-field="about-metrics"
                        data-preview-instance="0"
                        className={`grid grid-cols-3 gap-3 pt-2 relative rounded-2xl p-1 transition-all ${getHighlightStyles('about-metrics', 0)}`}
                      >
                        {renderHighlightBadge('about-metrics', 'About Metrics', 0)}
                        {portfolio.aboutMetrics && portfolio.aboutMetrics.length > 0 ? (
                          portfolio.aboutMetrics.map((metric, mIdx) => (
                            <div 
                              key={mIdx} 
                              data-preview-field="about-metric"
                              data-preview-instance={mIdx}
                              className={`p-4 rounded-xl ${borderClass} text-center relative transition-all ${getHighlightStyles('about-metric', mIdx)}`}
                            >
                              {renderHighlightBadge('about-metric', `Metric: ${metric.label}`, mIdx)}
                              <span 
                                className="text-2xl font-extrabold block" 
                                style={{ color: mIdx === 0 ? accentColor : mIdx === 1 ? '#fbbf24' : '#34d399' }}
                              >
                                {metric.value}
                              </span>
                              <span className="text-zinc-400 text-[11px] font-medium uppercase">{metric.label}</span>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className={`p-4 rounded-xl ${borderClass} text-center`}>
                              <span className="text-2xl font-extrabold block" style={{ color: accentColor }}>
                                {portfolio.workExperience?.length || 2}+
                              </span>
                              <span className="text-zinc-400 text-[11px] font-medium uppercase">Positions</span>
                            </div>
                            <div className={`p-4 rounded-xl ${borderClass} text-center`}>
                              <span className="text-2xl font-extrabold text-amber-400 block">
                                {portfolio.projects?.length || 3}+
                              </span>
                              <span className="text-zinc-400 text-[11px] font-medium uppercase">Projects</span>
                            </div>
                            <div className={`p-4 rounded-xl ${borderClass} text-center`}>
                              <span className="text-2xl font-extrabold text-emerald-400 block">
                                {portfolio.skills?.length || 6}
                              </span>
                              <span className="text-zinc-400 text-[11px] font-medium uppercase">Tech Tools</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className={`p-5 rounded-2xl ${borderClass} space-y-2`}>
                        <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                          <Code2 className="w-4 h-4" />
                        </div>
                        <h4 className="text-white font-semibold text-sm">Architecture & Design</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          Modular components, scalable backend patterns, and resilient state handlers.
                        </p>
                      </div>

                      <div className={`p-5 rounded-2xl ${borderClass} space-y-2`}>
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <h4 className="text-white font-semibold text-sm">Competitive Problem Solving</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          Algorithmic optimization, data structures, and competition heuristics.
                        </p>
                      </div>

                      <div className={`p-5 rounded-2xl ${borderClass} space-y-2`}>
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                          <Layers className="w-4 h-4" />
                        </div>
                        <h4 className="text-white font-semibold text-sm">Full-Stack Execution</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          End-to-end delivery from REST/MongoDB services to reactive React interfaces.
                        </p>
                      </div>

                      <div className={`p-5 rounded-2xl ${borderClass} space-y-2`}>
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <h4 className="text-white font-semibold text-sm">Creative Interfaces</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                          Custom animations, canvas rendering, and dark-mode aesthetics.
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </section>
            );
          }

          /* 4. SKILLS SECTION */
          if (componentKey === 'skills') {
            return (
              <section key="skills" id="skills" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-14">
                    <span className="text-xs font-semibold tracking-widest uppercase mb-2 block" style={{ color: accentColor }}>
                      Technical Arsenal
                    </span>
                    <div 
                      data-preview-field="skills-title"
                      data-preview-instance="0"
                      className={`relative inline-block transition-all p-1 rounded-xl ${getHighlightStyles('skills-title', 0)}`}
                    >
                      {renderHighlightBadge('skills-title', 'Skills Title', 0)}
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{portfolio.skillsTitle || 'Skills & Proficiencies'}</h2>
                    </div>
                    <div className="w-16 h-1 mx-auto mt-3 rounded-full" style={{ background: `linear-gradient(90deg, ${accentColor}, #ea580c)` }} />
                    {portfolio.skillsSubtitle && (
                      <div 
                        data-preview-field="skills-subtitle"
                        data-preview-instance="0"
                        className={`relative inline-block transition-all p-1 rounded-lg ${getHighlightStyles('skills-subtitle', 0)}`}
                      >
                        {renderHighlightBadge('skills-subtitle', 'Skills Subtitle', 0)}
                        <p className="text-zinc-400 mt-3 text-xs sm:text-sm">{portfolio.skillsSubtitle}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                      <div key={category} className={`p-6 rounded-2xl ${borderClass} flex flex-col justify-between`}>
                        <div>
                          <div className="flex items-center gap-3 mb-5">
                            <div 
                              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold"
                              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                            >
                              <Code2 className="w-4 h-4" />
                            </div>
                            <h3 className="text-white font-bold text-lg">{category}</h3>
                          </div>

                          <div className="space-y-3.5">
                            {catSkills.map((sk, idx) => (
                              <div 
                                key={idx}
                                data-preview-field="skill"
                                data-preview-instance={idx}
                                className={`relative transition-all p-1.5 rounded-lg ${getHighlightStyles('skill', idx)}`}
                              >
                                {renderHighlightBadge('skill', `Skill: ${sk.name}`, idx)}
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-zinc-300 font-medium">{sk.name}</span>
                                  <span className="font-mono font-bold" style={{ color: accentColor }}>{sk.proficiency}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                                  <div 
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{ 
                                      width: `${sk.proficiency}%`,
                                      background: `linear-gradient(90deg, ${accentColor}, #ea580c)`
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 pt-3 border-t border-zinc-800 text-zinc-500 text-[11px]">
                          {catSkills.length} proficiency points
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          /* 5. DONUT ORBIT / RADIAL WHEEL WIDGET */
          if (componentKey === 'donut-orbit') {
            return (
              <section 
                key="donut-orbit" 
                data-preview-field="donut-orbit"
                data-preview-instance="0"
                className={`py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative transition-all ${getHighlightStyles('donut-orbit', 0)}`}
              >
                {renderHighlightBadge('donut-orbit', 'Radial Technology Wheel', 0)}
                <DonutGalleryWidget 
                  accentColor={accentColor} 
                  borderClass={borderClass} 
                  nodes={portfolio.orbitNodes}
                />
              </section>
            );
          }

          /* 6. WORK EXPERIENCE SECTION */
          if (componentKey === 'experience') {
            return (
              <section key="experience" id="experience" className="py-20 relative bg-zinc-900/30 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-14">
                    <span className="text-xs font-semibold tracking-widest uppercase mb-2 block" style={{ color: accentColor }}>
                      Career & Education
                    </span>
                    <div 
                      data-preview-field="experience-title"
                      data-preview-instance="0"
                      className={`relative inline-block transition-all p-1 rounded-xl ${getHighlightStyles('experience-title', 0)}`}
                    >
                      {renderHighlightBadge('experience-title', 'Experience Title', 0)}
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{portfolio.experienceTitle || 'History & Milestones'}</h2>
                    </div>
                    <div className="w-16 h-1 mx-auto mt-3 rounded-full" style={{ background: `linear-gradient(90deg, ${accentColor}, #ea580c)` }} />
                    {portfolio.experienceSubtitle && (
                      <div 
                        data-preview-field="experience-subtitle"
                        data-preview-instance="0"
                        className={`relative inline-block transition-all p-1 rounded-lg ${getHighlightStyles('experience-subtitle', 0)}`}
                      >
                        {renderHighlightBadge('experience-subtitle', 'Experience Subtitle', 0)}
                        <p className="text-zinc-400 mt-3 text-xs sm:text-sm">{portfolio.experienceSubtitle}</p>
                      </div>
                    )}
                  </div>

                  <div className="max-w-4xl mx-auto relative pl-6 sm:pl-10 space-y-10 before:absolute before:left-0 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-zinc-800">
                    {portfolio.workExperience?.map((exp, index) => (
                      <div 
                        key={index} 
                        data-preview-field="experience-item"
                        data-preview-instance={index}
                        className={`relative pl-6 sm:pl-8 group transition-all rounded-2xl ${getHighlightStyles('experience-item', index)}`}
                      >
                        {renderHighlightBadge('experience-item', `Role: ${exp.role} @ ${exp.company}`, index)}
                        <div 
                          className="absolute -left-[31px] sm:-left-[27px] top-1.5 w-4 h-4 rounded-full border-4 border-[#09090b] group-hover:scale-125 transition-transform shadow-lg"
                          style={{
                            backgroundColor: exp.current ? '#10B981' : accentColor,
                            boxShadow: `0 0 12px ${exp.current ? '#10B981' : accentColor}80`
                          }}
                        />

                        <div className={`p-6 rounded-2xl ${borderClass} hover:border-zinc-700 transition-colors`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div>
                              <h3 className="text-white font-bold text-lg">{exp.company}</h3>
                              <p className="font-medium text-xs sm:text-sm" style={{ color: accentColor }}>{exp.role}</p>
                            </div>

                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold w-fit border ${
                              exp.current
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                            }`}>
                              {exp.current ? 'Current / Ongoing' : (
                                `${typeof exp.startDate === 'string' ? exp.startDate.slice(0, 7) : ''} — ${typeof exp.endDate === 'string' ? exp.endDate.slice(0, 7) : 'Present'}`
                              )}
                            </span>
                          </div>

                          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          /* 7. PROJECTS SHOWCASE SECTION */
          if (componentKey === 'projects') {
            return (
              <section key="projects" id="projects" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-14">
                    <span className="text-xs font-semibold tracking-widest uppercase mb-2 block" style={{ color: accentColor }}>
                      Portfolio Showcase
                    </span>
                    <div 
                      data-preview-field="projects-title"
                      data-preview-instance="0"
                      className={`relative inline-block transition-all p-1 rounded-xl ${getHighlightStyles('projects-title', 0)}`}
                    >
                      {renderHighlightBadge('projects-title', 'Projects Title', 0)}
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{portfolio.projectsTitle || 'Featured Projects'}</h2>
                    </div>
                    <div className="w-16 h-1 mx-auto mt-3 rounded-full" style={{ background: `linear-gradient(90deg, ${accentColor}, #ea580c)` }} />
                    <div 
                      data-preview-field="projects-subtitle"
                      data-preview-instance="0"
                      className={`relative inline-block transition-all p-1 rounded-lg ${getHighlightStyles('projects-subtitle', 0)}`}
                    >
                      {renderHighlightBadge('projects-subtitle', 'Projects Subtitle', 0)}
                      <p className="text-zinc-400 mt-3 text-xs sm:text-sm">
                        {portfolio.projectsSubtitle || 'Each project includes live demo and repository links.'}
                      </p>
                    </div>
                  </div>

                  {availableTags.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                      <button
                        type="button"
                        onClick={() => setActiveCategory('all')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          activeCategory === 'all'
                            ? 'text-white shadow-md'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                        style={activeCategory === 'all' ? { background: `linear-gradient(135deg, ${accentColor}, #ea580c)` } : undefined}
                      >
                        All ({allProjects.length})
                      </button>
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setActiveCategory(tag)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            activeCategory === tag
                              ? 'text-white shadow-md'
                              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                          style={activeCategory === tag ? { background: `linear-gradient(135deg, ${accentColor}, #ea580c)` } : undefined}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                      <div
                        key={index}
                        data-preview-field="project-item"
                        data-preview-instance={index}
                        className={`project-card rounded-2xl ${borderClass} overflow-hidden flex flex-col group hover:border-zinc-700 transition-all relative ${getHighlightStyles('project-item', index)}`}
                      >
                        {renderHighlightBadge('project-item', `Project: ${project.title}`, index)}
                        <div className="relative h-44 overflow-hidden bg-zinc-900 flex items-center justify-center">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-600">
                              <Code2 className="w-10 h-10" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                        </div>

                        <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                          <div>
                            <h3 className="text-white font-bold text-lg mb-1.5 group-hover:text-orange-400 transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
                              {project.description}
                            </p>
                          </div>

                          <div>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {project.techStack?.map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/80">
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 text-center py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <Github className="w-3.5 h-3.5" />
                                  <span>Code</span>
                                </a>
                              )}

                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 text-center py-2 px-3 rounded-xl text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                                  style={{
                                    background: `linear-gradient(135deg, ${accentColor} 0%, #ea580c 100%)`
                                  }}
                                >
                                  <span>Live Demo</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>

                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          /* 8. GITHUB STATS WIDGET */
          if (componentKey === 'github-stats') {
            return (
              <section 
                key="github-stats" 
                data-preview-field="github-stats"
                data-preview-instance="0"
                className={`py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative transition-all ${getHighlightStyles('github-stats', 0)}`}
              >
                {renderHighlightBadge('github-stats', 'GitHub Insights Card', 0)}
                <GithubStatsCard
                  githubUrl={portfolio.socialLinks?.github}
                  accentColor={accentColor}
                  borderClass={borderClass}
                />
              </section>
            );
          }

          /* 9. CERTIFICATIONS GRID */
          if (componentKey === 'certifications' && portfolio.certifications && portfolio.certifications.length > 0) {
            return (
              <section 
                key="certifications" 
                data-preview-field="certifications"
                data-preview-instance="0"
                className={`py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative transition-all ${getHighlightStyles('certifications', 0)}`}
              >
                {renderHighlightBadge('certifications', 'Certifications & Honors', 0)}
                <CertificationsGrid
                  certifications={portfolio.certifications}
                  accentColor={accentColor}
                  borderClass={borderClass}
                />
              </section>
            );
          }

          /* 10. TESTIMONIALS CAROUSEL */
          if (componentKey === 'testimonials' && portfolio.testimonials && portfolio.testimonials.length > 0) {
            return (
              <section 
                key="testimonials" 
                data-preview-field="testimonials"
                data-preview-instance="0"
                className={`py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative transition-all ${getHighlightStyles('testimonials', 0)}`}
              >
                {renderHighlightBadge('testimonials', 'Endorsements Carousel', 0)}
                <TestimonialsCarousel
                  testimonials={portfolio.testimonials}
                  accentColor={accentColor}
                  borderClass={borderClass}
                />
              </section>
            );
          }

          /* 11. INTERACTIVE GENERATIVE CANVAS WIDGET */
          if (componentKey === 'interactive-canvas') {
            return (
              <section 
                key="interactive-canvas" 
                data-preview-field="interactive-canvas"
                data-preview-instance="0"
                className={`py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative transition-all ${getHighlightStyles('interactive-canvas', 0)} ${getHighlightStyles('username', 2)}`}
              >
                {renderHighlightBadge('interactive-canvas', 'Generative Canvas Widget', 0)}
                {renderHighlightBadge('username', 'User Name (Canvas Typography)', 2)}
                <div data-preview-field="username" data-preview-instance="2">
                  <InteractiveCanvasWidget
                    accentColor={accentColor}
                    borderClass={borderClass}
                    defaultText={profileUser.username.toUpperCase()}
                  />
                </div>
              </section>
            );
          }

          /* 12. CONTACT & REACH SECTION */
          if (componentKey === 'contact') {
            return (
              <section key="contact" id="contact" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-3xl mx-auto mb-14">
                    <span className="text-xs font-semibold tracking-widest uppercase mb-2 block" style={{ color: accentColor }}>
                      Get In Touch
                    </span>
                    <div 
                      data-preview-field="contact-title"
                      data-preview-instance="0"
                      className={`relative inline-block transition-all p-1 rounded-xl ${getHighlightStyles('contact-title', 0)}`}
                    >
                      {renderHighlightBadge('contact-title', 'Contact Title', 0)}
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{portfolio.contactTitle || "Let's Work Together"}</h2>
                    </div>
                    <div className="w-16 h-1 mx-auto mt-3 rounded-full" style={{ background: `linear-gradient(90deg, ${accentColor}, #ea580c)` }} />
                    <div 
                      data-preview-field="contact-subtitle"
                      data-preview-instance="0"
                      className={`relative inline-block transition-all p-1 rounded-lg ${getHighlightStyles('contact-subtitle', 0)}`}
                    >
                      {renderHighlightBadge('contact-subtitle', 'Contact Subtitle', 0)}
                      <p className="text-zinc-400 mt-3 text-xs sm:text-sm">
                        {portfolio.contactSubtitle || "Have a project inquiry or software opportunity? Send a message directly."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
                    
                    {/* Direct Contact Cards */}
                    <div className="lg:col-span-5 space-y-4">
                      <div 
                        data-preview-field="contact-email"
                        data-preview-instance="0"
                        className={`p-5 rounded-2xl ${borderClass} flex items-start gap-4 relative transition-all ${getHighlightStyles('contact-email', 0)} ${getHighlightStyles('username', 3)}`}
                      >
                        {renderHighlightBadge('contact-email', 'Direct Email Card', 0)}
                        {renderHighlightBadge('username', 'User Name (Email)', 3)}
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                        >
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm">Direct Email</h4>
                          <a 
                            data-preview-field="username"
                            data-preview-instance="3"
                            href={`mailto:${profileUser.email}`} 
                            className="text-zinc-400 text-xs hover:text-white transition-colors break-all"
                          >
                            {profileUser.email}
                          </a>
                        </div>
                      </div>

                      {portfolio.phoneNumber && (
                        <div 
                          data-preview-field="contact-phone"
                          data-preview-instance="0"
                          className={`p-5 rounded-2xl ${borderClass} flex items-start gap-4 relative transition-all ${getHighlightStyles('contact-phone', 0)}`}
                        >
                          {renderHighlightBadge('contact-phone', 'Phone Number', 0)}
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                          >
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-sm">Phone</h4>
                            <p className="text-zinc-400 text-xs">{portfolio.phoneNumber}</p>
                          </div>
                        </div>
                      )}

                      <div 
                        data-preview-field="contact-location"
                        data-preview-instance="0"
                        className={`p-5 rounded-2xl ${borderClass} flex items-start gap-4 relative transition-all ${getHighlightStyles('contact-location', 0)}`}
                      >
                        {renderHighlightBadge('contact-location', 'Location Info', 0)}
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                        >
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-sm">Location</h4>
                          <p className="text-zinc-400 text-xs">{portfolio.location || "Available for remote roles & contracts"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Form */}
                    <div className="lg:col-span-7">
                      <form 
                        data-preview-field="contact-form"
                        data-preview-instance="0"
                        onSubmit={handleContactSubmit}
                        className={`p-6 sm:p-8 rounded-2xl ${borderClass} space-y-4 relative transition-all ${getHighlightStyles('contact-form', 0)}`}
                      >
                        {renderHighlightBadge('contact-form', 'Contact Dispatch Form', 0)}
                        {contactSuccess && (
                          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Message dispatched successfully! We will get in touch shortly.</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-300">Your Name</label>
                            <input
                              type="text"
                              required
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              placeholder="Jane Doe"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-300">Your Email</label>
                            <input
                              type="email"
                              required
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              placeholder="jane@company.com"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-300">Subject</label>
                          <input
                            type="text"
                            required
                            value={contactSubject}
                            onChange={(e) => setContactSubject(e.target.value)}
                            placeholder="Project Inquiry / Opportunity"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-zinc-300">Message</label>
                          <textarea
                            rows={3}
                            required
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            placeholder="Describe your project, timeline, and goals..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-orange-500 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={contactSubmitting}
                          className="w-full py-3 rounded-xl text-white font-bold text-xs shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          style={{
                            background: `linear-gradient(135deg, ${accentColor} 0%, #ea580c 100%)`,
                            boxShadow: `0 8px 20px -4px ${accentColor}40`
                          }}
                        >
                          {contactSubmitting ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <>
                              <span>Send Message</span>
                              <Send className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                  </div>
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>

    </div>
  );
};
