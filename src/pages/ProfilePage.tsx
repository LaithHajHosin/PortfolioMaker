import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Camera,
  Upload,
  Link as LinkIcon,
  ExternalLink,
  LayoutDashboard,
  Save,
  CheckCircle2,
  Sparkles,
  Github,
  Linkedin,
  Twitter,
  Globe,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface ProfilePageProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  onNavigate: (route: string) => void;
}

const AVATAR_PRESETS = [
  { name: 'Minimal Tech', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80' },
  { name: 'Modern Dev', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80' },
  { name: 'Creative Coder', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80' },
  { name: 'Cyber Minimal', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&q=80' },
  { name: 'Architect', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80' },
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ onShowToast, onNavigate }) => {
  const { user, portfolio, updateLocalPortfolio, updateLocalUser, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [statusText, setStatusText] = useState('ready for hire');
  const [bio, setBio] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  // Socials
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  // Processing states
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [showImagePresets, setShowImagePresets] = useState(false);

  // Accent color from portfolio theme
  const accentColor = portfolio?.themeSettings?.accentColor || '#f97316';

  // Synchronize form states whenever user or portfolio updates
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
    }
    if (portfolio) {
      setPhoneNumber(portfolio.phoneNumber || '');
      setProfileImage(portfolio.profileImage || '');
      setHeadline(portfolio.headline || 'Software Engineer');
      setLocation(portfolio.location || 'Available for remote roles & contracts');
      setStatusText(portfolio.statusText || 'ready for hire');
      setBio(portfolio.bio || '');
      setResumeUrl(portfolio.resumeUrl || '');

      const s = portfolio.socialLinks || {};
      setGithubUrl(s.github || '');
      setLinkedinUrl(s.linkedin || '');
      setTwitterUrl(s.twitter || '');
      setWebsiteUrl(s.website || '');
    }
  }, [user, portfolio]);

  // Handle Ctrl+S / Cmd+S shortcut to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSaveProfile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [email, phoneNumber, profileImage, headline, location, statusText, bio, resumeUrl, githubUrl, linkedinUrl, twitterUrl, websiteUrl]);

  // Handle image file upload to server
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onShowToast('Please select a valid image file (PNG, JPG, WebP, etc.).', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      onShowToast('Image size exceeds 8MB limit.', 'warning');
      return;
    }

    setIsUploading(true);
    try {
      const res = await api.upload.single(file);
      if (res.success && res.data?.url) {
        setProfileImage(res.data.url);
        onShowToast('Profile photo uploaded! Click "Save Profile" to apply.', 'success');
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Failed to upload photo.', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Save profile changes to server and sync AuthContext & Dashboard
  const handleSaveProfile = async () => {
    if (!user) {
      onShowToast('You must be logged in to update your profile.', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      onShowToast('Please provide a valid email address.', 'warning');
      return;
    }

    setIsSaving(true);
    try {
      // 1. Update user account email if changed
      if (email.trim() && email.trim().toLowerCase() !== user.email.toLowerCase()) {
        const userUpdateRes = await api.auth.updateProfile({
          email: email.trim().toLowerCase(),
        });
        if (userUpdateRes.success && userUpdateRes.data?.user) {
          updateLocalUser(userUpdateRes.data.user);
        }
      }

      // 2. Prepare portfolio payload
      const currentSocials = portfolio?.socialLinks || {};
      const updatedSocialLinks = {
        ...currentSocials,
        github: githubUrl.trim(),
        linkedin: linkedinUrl.trim(),
        twitter: twitterUrl.trim(),
        website: websiteUrl.trim(),
      };

      const portfolioPayload = {
        headline: headline.trim(),
        phoneNumber: phoneNumber.trim(),
        profileImage: profileImage.trim(),
        location: location.trim(),
        statusText: statusText.trim(),
        bio: bio.trim(),
        resumeUrl: resumeUrl.trim(),
        socialLinks: updatedSocialLinks,
      };

      // 3. Send update to backend
      const res = await api.portfolio.update(portfolioPayload);
      if (res.success && res.data) {
        // Automatically updates state in AuthContext so Dashboard and PortfolioDemo are updated!
        updateLocalPortfolio(res.data);
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTime(timeStr);
        onShowToast('Profile saved & synchronized with Dashboard and Live Demo!', 'success');
      } else {
        throw new Error(res.message || 'Failed to save profile changes.');
      }
    } catch (err: any) {
      console.error('Error saving profile:', err);
      onShowToast(err.message || 'Failed to save profile details. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Top Banner / Sync Info */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div 
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: accentColor }}
        />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              CANONICAL USER PROFILE
            </span>
            <span className="text-zinc-500 text-xs hidden sm:inline">·</span>
            <span className="text-xs text-zinc-400 font-mono hidden sm:inline">@{user?.username}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Profile & Essential Information
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
            Manage your core identity, contact numbers, email, and avatar. Changes saved here 
            <strong className="text-zinc-200"> automatically synchronize with your Dashboard builder</strong> and power your final portfolio demo with consistent styling.
          </p>
        </div>

        {/* Quick Nav & Save Buttons */}
        <div className="flex items-center flex-wrap gap-2.5 z-10">
          <button
            onClick={() => onNavigate('/dashboard')}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-orange-400" />
            <span>Dashboard</span>
          </button>

          {user && (
            <button
              onClick={() => onNavigate(`/${user.username}`)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Page</span>
            </button>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
            style={{
              background: `linear-gradient(135deg, ${accentColor} 0%, #ea580c 100%)`,
              boxShadow: `0 8px 24px -6px ${accentColor}60`,
            }}
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {lastSavedTime && (
        <div className="mb-6 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>All details synchronized with Dashboard & portfolio preview (Last saved at {lastSavedTime})</span>
          </div>
          <button
            onClick={() => onNavigate('/dashboard')}
            className="underline font-semibold hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View in Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Grid: Form Inputs (Col 1 & 2) + Live Portfolio Demo Replica (Col 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Editing Sections */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. Avatar & Visual Identity */}
          <div className="p-6 rounded-3xl glass-panel border border-zinc-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Profile Photo & Identity</h2>
                  <p className="text-[11px] text-zinc-400">Used in Hero, Navigation, Badges, and About section</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">Important Field</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Photo Preview Container */}
              <div className="relative group shrink-0">
                <div 
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-zinc-950 border-2 shadow-xl flex items-center justify-center transition-all"
                  style={{ borderColor: `${accentColor}80` }}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-600 gap-1 p-2 text-center">
                      <UserIcon className="w-10 h-10" />
                      <span className="text-[10px] font-mono text-zinc-500">No Image</span>
                    </div>
                  )}
                </div>

                <span 
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-sm" 
                  title="Online & Ready for Hire"
                />
              </div>

              {/* Upload Controls & URL */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs flex items-center gap-2 border border-zinc-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isUploading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 text-orange-400" />
                    )}
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowImagePresets(!showImagePresets)}
                    className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors"
                  >
                    Preset Avatars
                  </button>

                  {profileImage && (
                    <button
                      type="button"
                      onClick={() => setProfileImage('')}
                      className="px-3 py-2 rounded-xl text-zinc-400 hover:text-red-400 text-xs font-medium transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Preset Avatars Selector */}
                {showImagePresets && (
                  <div className="p-3 rounded-2xl bg-zinc-950/90 border border-zinc-800 space-y-2">
                    <span className="text-[11px] font-mono text-zinc-400 block">Select a curated developer avatar:</span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setProfileImage(preset.url);
                            setShowImagePresets(false);
                            onShowToast(`Selected ${preset.name} avatar!`, 'info');
                          }}
                          className="shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-zinc-700 hover:border-orange-500 transition-all hover:scale-105"
                          title={preset.name}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">
                    Or Image Direct URL (HTTPS)
                  </label>
                  <input
                    type="url"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Important Contact Information (Phone, Email, Location) */}
          <div className="p-6 rounded-3xl glass-panel border border-zinc-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Important Contact Information</h2>
                  <p className="text-[11px] text-zinc-400">Canonical phone number, email, and location shown in portfolio</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Live Synced
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Phone Number</span>
                  <span className="text-[10px] text-orange-400 font-mono ml-auto">Important</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                />
                <p className="text-[10px] text-zinc-500">
                  Appears in Contact Cards & Footer across your final portfolio demo.
                </p>
              </div>

              {/* Primary Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>Primary Email Address</span>
                  <span className="text-[10px] text-orange-400 font-mono ml-auto">Important</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <p className="text-[10px] text-zinc-500">
                  Account communication & direct portfolio mailto link.
                </p>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>Location / Base</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA (or Remote)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Availability Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Work Availability Status</span>
                </label>
                <input
                  type="text"
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  placeholder="Ready for hire / Open to contracts"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 3. Professional Headline & Bio Narrative */}
          <div className="p-6 rounded-3xl glass-panel border border-zinc-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Professional Headline & Bio</h2>
                  <p className="text-[11px] text-zinc-400">Appears in Hero badges, meta descriptions, and About overview</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">
                  Professional Headline / Title
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Senior Full-Stack Engineer & System Architect"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <p className="text-[10px] text-zinc-500">
                  Displayed prominently under your name on the hero badge and public headers.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200">
                  Bio Narrative
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a clear, impactful narrative summarizing your engineering expertise, favorite tech stack, and what drives you..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Resume / CV Document URL</span>
                </label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or https://yourdomain.com/resume.pdf"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {/* 4. Social & Professional Profiles */}
          <div className="p-6 rounded-3xl glass-panel border border-zinc-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Social & External Profiles</h2>
                  <p className="text-[11px] text-zinc-400">Canonical links shown in hero and contact footer</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-zinc-300" />
                  <span>GitHub Profile</span>
                </label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                  <span>LinkedIn Profile</span>
                </label>
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Twitter className="w-3.5 h-3.5 text-sky-400" />
                  <span>Twitter / X</span>
                </label>
                <input
                  type="text"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://x.com/username"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Personal Website / Domain</span>
                </label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourdomain.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {/* Bottom Save Button */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-[10px]">Ctrl+S</kbd> to save anytime</span>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
              style={{
                background: `linear-gradient(135deg, ${accentColor} 0%, #ea580c 100%)`,
                boxShadow: `0 8px 24px -6px ${accentColor}60`,
              }}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column (5 cols): Final Portfolio Demo Replica */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          
          <div className="p-6 rounded-3xl glass-panel border border-zinc-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Final Portfolio Demo Look
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                100% Identical Styling
              </span>
            </div>

            <p className="text-xs text-zinc-400">
              This preview shows exactly how your essential profile data is rendered in the final portfolio demo and dashboard cards:
            </p>

            {/* 1. Final Portfolio Hero Identity Card Preview */}
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-xl space-y-4 relative overflow-hidden">
              <div 
                className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-2xl opacity-15 pointer-events-none"
                style={{ backgroundColor: accentColor }}
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pb-2 border-b border-zinc-800">
                <span>HERO IDENTITY CARD</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {statusText || 'online'}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-950 border-2 shadow-lg shrink-0"
                  style={{ borderColor: `${accentColor}80` }}
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Demo Hero" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
                      <UserIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-white font-extrabold text-base tracking-tight truncate">
                    @{user?.username || 'developer'}
                  </h4>
                  <p className="text-xs font-semibold tracking-wide uppercase truncate mt-0.5" style={{ color: accentColor }}>
                    {headline || 'Software Engineer'}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                    <span>{location || 'Remote'}</span>
                  </p>
                </div>
              </div>

              {bio && (
                <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 line-clamp-3 leading-relaxed">
                  "{bio}"
                </div>
              )}
            </div>

            {/* 2. Final Portfolio Direct Contact Cards Preview */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider block">
                Direct Contact Section Cards (Demo Replica):
              </span>

              {/* Email Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3.5 transition-all">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-white font-semibold text-xs">Direct Email</h5>
                  <p className="text-zinc-400 text-xs truncate mt-0.5">
                    {email || user?.email || 'developer@example.com'}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 shrink-0">mailto:</span>
              </div>

              {/* Phone Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3.5 transition-all">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                >
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-white font-semibold text-xs">Direct Phone</h5>
                  <p className="text-zinc-400 text-xs font-mono truncate mt-0.5">
                    {phoneNumber || <span className="text-zinc-600 italic">No phone set yet</span>}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 shrink-0">tel:</span>
              </div>

              {/* Location Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3.5 transition-all">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-white font-semibold text-xs">Location & Availability</h5>
                  <p className="text-zinc-400 text-xs truncate mt-0.5">
                    {location || 'Available worldwide'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links inside Card */}
            <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="flex-1 py-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 text-xs font-bold transition-all text-center"
              >
                Open in Dashboard
              </button>
              {user && (
                <button
                  onClick={() => onNavigate(`/${user.username}`)}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all text-center"
                >
                  View Public Demo ↗
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
