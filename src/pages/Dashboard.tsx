import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { 
  Portfolio, 
  Skill, 
  WorkExperience, 
  Project, 
  Certification, 
  Testimonial, 
  ThemeSettings,
  CustomSocial,
  AboutMetric,
  MarqueeItem,
  OrbitNode
} from '../types/portfolio.ts';
import { PortfolioView } from './PortfolioView.tsx';
import { PreviewLocateButton } from '../components/PreviewLocateButton.tsx';
import { 
  User, 
  Target,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles, 
  Briefcase, 
  FolderGit2, 
  Share2, 
  Palette, 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  Eye, 
  Layers, 
  Code2, 
  Award,
  Quote,
  LayoutGrid,
  Columns,
  ChevronUp,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Edit3,
  Sliders,
  Check,
  Globe,
  Settings,
  Terminal,
  Type
} from 'lucide-react';

interface DashboardProps {
  onShowToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  onNavigate: (route: string) => void;
}

type TabType = 
  | 'personal' 
  | 'components'
  | 'skills' 
  | 'experience' 
  | 'projects' 
  | 'social' 
  | 'styling' 
  | 'certifications' 
  | 'testimonials';

type ViewMode = 'edit' | 'split' | 'preview';

const ACCENT_PRESETS = [
  { name: 'Flame Orange', hex: '#f97316' },
  { name: 'Electric Blue', hex: '#3B82F6' },
  { name: 'Neon Emerald', hex: '#10B981' },
  { name: 'Cyber Rose', hex: '#F43F5E' },
  { name: 'Violet Glow', hex: '#8B5CF6' },
  { name: 'Amber Sun', hex: '#F59E0B' },
];

const COMPONENT_CATALOG = [
  { key: 'hero', name: 'Hero Profile Card', desc: 'Avatar, title, highlight word, typewriter & status badge' },
  { key: 'tech-marquee', name: 'Tech Marquee Ticker', desc: 'Infinite horizontal scrolling technology ticker' },
  { key: 'about', name: 'About & Metrics', desc: 'Biography narrative and milestone numerical stats' },
  { key: 'skills', name: 'Skills & Proficiencies', desc: 'Categorized animated progress proficiency bars' },
  { key: 'donut-orbit', name: 'Radial Technology Wheel', desc: 'Interactive circular orbit gallery with tech node tooltips' },
  { key: 'experience', name: 'Experience Timeline', desc: 'Chronological timeline of jobs and degrees' },
  { key: 'projects', name: 'Projects Showcase', desc: 'Grid of cards with tech stack tags and demo links' },
  { key: 'github-stats', name: 'GitHub Insights Card', desc: 'Repositories count, stars, commit streak, and language bar' },
  { key: 'certifications', name: 'Certifications & Honors', desc: 'Verified badges with issuers and credential links' },
  { key: 'testimonials', name: 'Endorsements Carousel', desc: 'Colleague praise and mentor recommendation quotes' },
  { key: 'interactive-canvas', name: 'Generative Canvas Widget', desc: 'Interactive HTML5 typography vector field drawing' },
  { key: 'contact', name: 'Contact & Messaging Form', desc: 'Direct email, phone, location cards, and dispatch form' },
];

const SOCIAL_PLATFORM_PRESETS = [
  'GitHub',
  'LinkedIn',
  'LeetCode',
  'Codeforces',
  'Twitter / X',
  'Personal Website',
  'Discord',
  'YouTube',
  'Telegram',
  'Kaggle',
  'Medium',
  'Dev.to',
  'Hashnode',
  'Twitch',
  'Substack',
  'Dribbble',
  'Behance',
  'Facebook',
  'Instagram',
  'TikTok',
  'Reddit',
  'StackOverflow',
  'Other / Custom',
];

export const Dashboard: React.FC<DashboardProps> = ({ onShowToast, onNavigate }) => {
  const { user, portfolio, updateLocalPortfolio } = useAuth();
  
  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [activeTab, setActiveTab] = useState<TabType>('components');
  const [selectedComponentKey, setSelectedComponentKey] = useState<string>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Live Preview Highlighting & Multi-Instance Navigation State
  interface HighlightState {
    field: string;
    instanceIndex: number;
    totalInstances: number;
    label: string;
  }
  const [activeHighlight, setActiveHighlight] = useState<HighlightState | null>(null);

  const handleLocateInPreview = (
    field: string,
    instanceOrDirection: number | 'next' | 'prev' = 'next',
    label?: string
  ) => {
    // If in edit-only mode, switch to split view (or preview on mobile) so preview is immediately visible
    if (viewMode === 'edit') {
      setViewMode(window.innerWidth < 1024 ? 'preview' : 'split');
    }

    // Query live preview viewport with alias support
    const container = document.getElementById('live-preview-viewport');
    let previewElements: Element[] = [];
    if (container) {
      let elements = Array.from(container.querySelectorAll(`[data-preview-field="${field}"]`));
      if (elements.length === 0) {
        if (field === 'skills' || field === 'skill') {
          elements = Array.from(container.querySelectorAll('[data-preview-field="skill"], [data-preview-field="skills"]'));
        } else if (field === 'projects' || field === 'project-card' || field === 'project-item') {
          elements = Array.from(container.querySelectorAll('[data-preview-field="project-item"], [data-preview-field="project-card"]'));
        } else if (field === 'experience' || field === 'experience-item') {
          elements = Array.from(container.querySelectorAll('[data-preview-field="experience-item"], [data-preview-field="experience"]'));
        } else if (field === 'about-title' || field === 'about-heading') {
          elements = Array.from(container.querySelectorAll('[data-preview-field="about-title"], [data-preview-field="about-heading"]'));
        } else if (field === 'metric-card' || field === 'about-metrics' || field === 'about-metric') {
          elements = Array.from(container.querySelectorAll('[data-preview-field="about-metric"], [data-preview-field="about-metrics"]'));
        } else if (field === 'socials' || field === 'social-links' || field === 'social') {
          elements = Array.from(container.querySelectorAll('[data-preview-field="social-links"], [data-preview-field="social-link"]'));
        }
      }
      previewElements = elements;
    }

    const totalInstances = Math.max(1, previewElements.length);

    let nextIndex = 0;
    if (typeof instanceOrDirection === 'number') {
      nextIndex = Math.max(0, Math.min(totalInstances - 1, instanceOrDirection));
    } else if (activeHighlight && activeHighlight.field === field) {
      if (instanceOrDirection === 'prev') {
        nextIndex = (activeHighlight.instanceIndex - 1 + totalInstances) % totalInstances;
      } else {
        nextIndex = (activeHighlight.instanceIndex + 1) % totalInstances;
      }
    } else {
      nextIndex = 0;
    }

    const highlightInfo: HighlightState = {
      field,
      instanceIndex: nextIndex,
      totalInstances,
      label: label || field,
    };
    setActiveHighlight(highlightInfo);

    // Smooth scroll to target element in live preview
    setTimeout(() => {
      const updatedContainer = document.getElementById('live-preview-viewport');
      if (!updatedContainer) return;
      let targets = updatedContainer.querySelectorAll(`[data-preview-field="${field}"]`);
      if (targets.length === 0) {
        if (field === 'skills' || field === 'skill') {
          targets = updatedContainer.querySelectorAll('[data-preview-field="skill"], [data-preview-field="skills"]');
        } else if (field === 'projects' || field === 'project-card' || field === 'project-item') {
          targets = updatedContainer.querySelectorAll('[data-preview-field="project-item"], [data-preview-field="project-card"]');
        } else if (field === 'experience' || field === 'experience-item') {
          targets = updatedContainer.querySelectorAll('[data-preview-field="experience-item"], [data-preview-field="experience"]');
        } else if (field === 'about-title' || field === 'about-heading') {
          targets = updatedContainer.querySelectorAll('[data-preview-field="about-title"], [data-preview-field="about-heading"]');
        } else if (field === 'metric-card' || field === 'about-metrics' || field === 'about-metric') {
          targets = updatedContainer.querySelectorAll('[data-preview-field="about-metric"], [data-preview-field="about-metrics"]');
        }
      }
      const targetEl = targets[nextIndex] || targets[0];
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
  };

  // Editable Form States
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('Available for remote roles & contracts');
  const [resumeUrl, setResumeUrl] = useState('');
  const [profileImage, setProfileImage] = useState('');

  // Editable Hero Specifics
  const [heroTitle, setHeroTitle] = useState('Engineering digital flare into products.');
  const [heroHighlightWord, setHeroHighlightWord] = useState('digital flare');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [statusText, setStatusText] = useState('ready for hire');
  const [typewriterPhrases, setTypewriterPhrases] = useState<string[]>([
    'machine learning models.',
    'competitive algorithms.',
    'C# & Python apps.',
    'user-focused high-impact solutions.',
  ]);

  // Editable Section Titles & Subtitles
  const [skillsTitle, setSkillsTitle] = useState('Skills & Technical Stack');
  const [skillsSubtitle, setSkillsSubtitle] = useState('Demonstrated competencies across programming languages, backend systems, and modern tools.');
  const [experienceTitle, setExperienceTitle] = useState('Work Experience & History');
  const [experienceSubtitle, setExperienceSubtitle] = useState('Chronological trajectory of technical fellowships, academic rigor, and production contributions.');
  const [projectsTitle, setProjectsTitle] = useState('Featured Engineering Projects');
  const [projectsSubtitle, setProjectsSubtitle] = useState('Interactive simulations, AI architectures, and algorithmic systems built with modern engineering.');
  const [contactTitle, setContactTitle] = useState("Let's Work Together");
  const [contactSubtitle, setContactSubtitle] = useState('Have a project inquiry or software opportunity? Send a message directly.');

  // Editable About Specifics
  const [aboutTitle, setAboutTitle] = useState('Bridging technical rigor with human-centric interfaces.');
  const [aboutSubtitle, setAboutSubtitle] = useState('System Overview');
  const [aboutMetrics, setAboutMetrics] = useState<AboutMetric[]>([
    { label: 'Positions', value: '3+', sublabel: 'Roles / Fellowships' },
    { label: 'Projects', value: '10+', sublabel: 'Featured Projects' },
    { label: 'Tech Tools', value: '8+', sublabel: 'Languages & Frameworks' },
  ]);

  // Editable Widget Nodes
  const [marqueeItems, setMarqueeItems] = useState<MarqueeItem[]>([
    { label: 'PyTorch / ML' },
    { label: 'Codeforces Algorithms' },
    { label: 'TypeScript / React 19' },
    { label: 'MongoDB / Mongoose' },
    { label: 'Unity & C#' },
    { label: 'Linux & Docker' },
    { label: 'Tailwind CSS' },
    { label: 'Git & Version Control' },
    { label: 'RESTful Architecture' },
  ]);

  const [orbitNodes, setOrbitNodes] = useState<OrbitNode[]>([
    { name: 'Python', desc: 'Machine learning pipelines & PyTorch models' },
    { name: 'C# / .NET', desc: 'Object-oriented architecture & Unity systems' },
    { name: 'JavaScript', desc: 'Full-stack reactive web applications' },
    { name: 'C++', desc: 'High-performance algorithms & data structures' },
    { name: 'Unity', desc: 'Interactive 3D simulations & shaders' },
    { name: 'MySQL', desc: 'Relational data modeling & query optimizations' },
    { name: 'Git & GitHub', desc: 'Collaborative version control & CI/CD' },
    { name: 'Blender 3D', desc: 'Geometric meshes & procedural modeling' },
  ]);

  // Skills, Experience, Projects
  const [skills, setSkills] = useState<Skill[]>([]);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  
  // Dynamic Socials State (Unlimited, Removable, Reorderable)
  interface SocialItem {
    id: string;
    platform: string;
    url: string;
  }
  const [socialList, setSocialList] = useState<SocialItem[]>([
    { id: 'github', platform: 'GitHub', url: '' },
    { id: 'linkedin', platform: 'LinkedIn', url: '' },
    { id: 'codeforces', platform: 'Codeforces', url: '' },
    { id: 'leetcode', platform: 'LeetCode', url: '' },
    { id: 'twitter', platform: 'Twitter / X', url: '' },
    { id: 'website', platform: 'Personal Website', url: '' },
  ]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Enabled Components
  const [enabledComponents, setEnabledComponents] = useState<string[]>([
    'hero',
    'tech-marquee',
    'about',
    'skills',
    'donut-orbit',
    'experience',
    'projects',
    'github-stats',
    'certifications',
    'testimonials',
    'interactive-canvas',
    'contact',
  ]);

  // Theme Settings
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    accentColor: '#f97316',
    mode: 'dark',
    layout: 'glass',
    backgroundStyle: 'grid',
    borderStyle: 'subtle',
    textAnimation: 'typewriter',
    fontFamily: 'inter',
  });

  // Populate from portfolio
  useEffect(() => {
    if (portfolio) {
      setHeadline(portfolio.headline || '');
      setBio(portfolio.bio || '');
      setPhoneNumber(portfolio.phoneNumber || '');
      setLocation(portfolio.location || 'Available for remote roles & contracts');
      setResumeUrl(portfolio.resumeUrl || '');
      setProfileImage(portfolio.profileImage || '');
      setHeroTitle(portfolio.heroTitle || 'Engineering digital flare into products.');
      setHeroHighlightWord(portfolio.heroHighlightWord || 'digital flare');
      setHeroSubtitle(portfolio.heroSubtitle || '');
      setStatusText(portfolio.statusText || 'ready for hire');
      
      if (portfolio.typewriterPhrases && portfolio.typewriterPhrases.length > 0) {
        setTypewriterPhrases(portfolio.typewriterPhrases);
      }
      setAboutTitle(portfolio.aboutTitle || 'Bridging technical rigor with human-centric interfaces.');
      setAboutSubtitle(portfolio.aboutSubtitle || 'System Overview');
      
      if (portfolio.aboutMetrics && portfolio.aboutMetrics.length > 0) {
        setAboutMetrics(portfolio.aboutMetrics);
      }
      if (portfolio.marqueeItems && portfolio.marqueeItems.length > 0) {
        setMarqueeItems(portfolio.marqueeItems);
      }
      if (portfolio.orbitNodes && portfolio.orbitNodes.length > 0) {
        setOrbitNodes(portfolio.orbitNodes);
      }

      setSkillsTitle(portfolio.skillsTitle || 'Skills & Technical Stack');
      setSkillsSubtitle(portfolio.skillsSubtitle || 'Demonstrated competencies across programming languages, backend systems, and modern tools.');
      setSkills(portfolio.skills || []);

      setExperienceTitle(portfolio.experienceTitle || 'Work Experience & History');
      setExperienceSubtitle(portfolio.experienceSubtitle || 'Chronological trajectory of technical fellowships, academic rigor, and production contributions.');
      setWorkExperience(portfolio.workExperience || []);

      setProjectsTitle(portfolio.projectsTitle || 'Featured Engineering Projects');
      setProjectsSubtitle(portfolio.projectsSubtitle || 'Interactive simulations, AI architectures, and algorithmic systems built with modern engineering.');
      setProjects(portfolio.projects || []);

      setContactTitle(portfolio.contactTitle || "Let's Work Together");
      setContactSubtitle(portfolio.contactSubtitle || 'Have a project inquiry or software opportunity? Send a message directly.');

      // Populate dynamic social list
      const s = portfolio.socialLinks || {};
      if (s.dynamicLinks && s.dynamicLinks.length > 0) {
        setSocialList(s.dynamicLinks);
      } else {
        const loadedSocials: SocialItem[] = [];
        if (s.github) loadedSocials.push({ id: 'github', platform: 'GitHub', url: s.github });
        if (s.linkedin) loadedSocials.push({ id: 'linkedin', platform: 'LinkedIn', url: s.linkedin });
        if (s.codeforces) loadedSocials.push({ id: 'codeforces', platform: 'Codeforces', url: s.codeforces });
        if (s.leetcode) loadedSocials.push({ id: 'leetcode', platform: 'LeetCode', url: s.leetcode });
        if (s.twitter) loadedSocials.push({ id: 'twitter', platform: 'Twitter / X', url: s.twitter });
        if (s.website) loadedSocials.push({ id: 'website', platform: 'Personal Website', url: s.website });
        if (s.facebook) loadedSocials.push({ id: 'facebook', platform: 'Facebook', url: s.facebook });
        if (s.instagram) loadedSocials.push({ id: 'instagram', platform: 'Instagram', url: s.instagram });
        if (s.customSocials && s.customSocials.length > 0) {
          s.customSocials.forEach((cs, i) => {
            loadedSocials.push({ id: `cs-${i}-${Date.now()}`, platform: cs.platform, url: cs.url });
          });
        }
        if (loadedSocials.length > 0) {
          setSocialList(loadedSocials);
        }
      }

      setCertifications(portfolio.certifications || []);
      setTestimonials(portfolio.testimonials || []);

      if (portfolio.enabledComponents && portfolio.enabledComponents.length > 0) {
        setEnabledComponents(portfolio.enabledComponents);
      }
      setThemeSettings(
        portfolio.themeSettings || {
          accentColor: '#f97316',
          mode: 'dark',
          layout: 'glass',
          backgroundStyle: 'grid',
          borderStyle: 'subtle',
          textAnimation: 'typewriter',
          fontFamily: 'inter',
        }
      );
    }
  }, [portfolio]);

  // Helper to compile socialLinks payload
  const buildSocialLinksPayload = () => {
    const payload: any = {
      github: '',
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
      leetcode: '',
      codeforces: '',
      website: '',
      customSocials: [],
      dynamicLinks: socialList,
    };
    socialList.forEach((item) => {
      const p = item.platform.toLowerCase();
      if (p.includes('github') && !payload.github) payload.github = item.url;
      else if (p.includes('linkedin') && !payload.linkedin) payload.linkedin = item.url;
      else if (p.includes('codeforces') && !payload.codeforces) payload.codeforces = item.url;
      else if (p.includes('leetcode') && !payload.leetcode) payload.leetcode = item.url;
      else if ((p.includes('twitter') || p.includes('x')) && !payload.twitter) payload.twitter = item.url;
      else if ((p.includes('website') || p.includes('site') || p.includes('portfolio')) && !payload.website) payload.website = item.url;
      else if (p.includes('facebook') && !payload.facebook) payload.facebook = item.url;
      else if (p.includes('instagram') && !payload.instagram) payload.instagram = item.url;
      else {
        payload.customSocials.push({ platform: item.platform, url: item.url });
      }
    });
    return payload;
  };

  // Construct real-time live preview object
  const currentPreviewData: Portfolio = useMemo(() => {
    return {
      userId: user?._id || 'preview-user',
      headline,
      bio,
      phoneNumber,
      location,
      resumeUrl,
      profileImage,
      heroTitle,
      heroHighlightWord,
      heroSubtitle,
      statusText,
      typewriterPhrases,
      aboutTitle,
      aboutSubtitle,
      aboutMetrics,
      marqueeItems,
      orbitNodes,
      skillsTitle,
      skillsSubtitle,
      skills,
      experienceTitle,
      experienceSubtitle,
      workExperience,
      socialLinks: buildSocialLinksPayload(),
      projectsTitle,
      projectsSubtitle,
      projects,
      certifications,
      testimonials,
      contactTitle,
      contactSubtitle,
      enabledComponents,
      themeSettings,
    };
  }, [
    user,
    headline,
    bio,
    phoneNumber,
    location,
    resumeUrl,
    profileImage,
    heroTitle,
    heroHighlightWord,
    heroSubtitle,
    statusText,
    typewriterPhrases,
    aboutTitle,
    aboutSubtitle,
    aboutMetrics,
    marqueeItems,
    orbitNodes,
    skillsTitle,
    skillsSubtitle,
    skills,
    experienceTitle,
    experienceSubtitle,
    workExperience,
    socialList,
    projectsTitle,
    projectsSubtitle,
    projects,
    certifications,
    testimonials,
    contactTitle,
    contactSubtitle,
    enabledComponents,
    themeSettings,
  ]);

  // Handle Save Action
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: Partial<Portfolio> = {
        headline,
        bio,
        phoneNumber,
        location,
        resumeUrl,
        profileImage,
        heroTitle,
        heroHighlightWord,
        heroSubtitle,
        statusText,
        typewriterPhrases,
        aboutTitle,
        aboutSubtitle,
        aboutMetrics,
        marqueeItems,
        orbitNodes,
        skillsTitle,
        skillsSubtitle,
        skills,
        experienceTitle,
        experienceSubtitle,
        workExperience,
        socialLinks: buildSocialLinksPayload(),
        projectsTitle,
        projectsSubtitle,
        projects,
        certifications,
        testimonials,
        contactTitle,
        contactSubtitle,
        enabledComponents,
        themeSettings,
      };

      const res = await api.portfolio.update(payload);
      if (res.success && res.data) {
        updateLocalPortfolio(res.data);
        onShowToast('All portfolio modifications saved to database successfully!', 'success');
      } else {
        throw new Error(res.message || 'Failed to update portfolio');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Could not save portfolio changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Social List Helpers (Unlimited Dynamic Add/Remove/Reorder)
  const addSocial = (platform: string = 'GitHub') => {
    const newId = `social-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setSocialList([...socialList, { id: newId, platform, url: '' }]);
  };
  const updateSocial = (idx: number, field: 'platform' | 'url', val: string) => {
    const updated = [...socialList];
    updated[idx] = { ...updated[idx], [field]: val };
    setSocialList(updated);
  };
  const removeSocial = (idx: number) => {
    setSocialList(socialList.filter((_, i) => i !== idx));
  };
  const moveSocial = (idx: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= socialList.length) return;
    const updated = [...socialList];
    const [moved] = updated.splice(idx, 1);
    updated.splice(target, 0, moved);
    setSocialList(updated);
  };

  // Image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      onShowToast('File size exceeds the 2MB limit.', 'error');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      onShowToast('Invalid file format. Only JPEG, PNG, and WebP are supported.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const res = await api.upload.single(file);
      if (res.success && res.data?.url) {
        if (typeof projectIndex === 'number') {
          const updated = [...projects];
          updated[projectIndex].image = res.data.url;
          setProjects(updated);
          onShowToast('Project image uploaded!', 'success');
        } else {
          setProfileImage(res.data.url);
          onShowToast('Profile photo uploaded!', 'success');
        }
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Error uploading file.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Typewriter phrase helpers
  const addPhrase = () => {
    setTypewriterPhrases([...typewriterPhrases, 'New specialty or tech focus']);
  };
  const updatePhrase = (idx: number, val: string) => {
    const updated = [...typewriterPhrases];
    updated[idx] = val;
    setTypewriterPhrases(updated);
  };
  const removePhrase = (idx: number) => {
    setTypewriterPhrases(typewriterPhrases.filter((_, i) => i !== idx));
  };

  // About metric helpers
  const addMetric = () => {
    setAboutMetrics([...aboutMetrics, { label: 'Metric', value: '100%', sublabel: 'Verified' }]);
  };
  const updateMetric = (idx: number, field: keyof AboutMetric, val: string) => {
    const updated = [...aboutMetrics];
    updated[idx] = { ...updated[idx], [field]: val };
    setAboutMetrics(updated);
  };
  const removeMetric = (idx: number) => {
    setAboutMetrics(aboutMetrics.filter((_, i) => i !== idx));
  };


  // Marquee item helpers
  const addMarqueeItem = () => {
    setMarqueeItems([...marqueeItems, { label: 'New Technology' }]);
  };
  const updateMarqueeItem = (idx: number, val: string) => {
    const updated = [...marqueeItems];
    updated[idx] = { label: val };
    setMarqueeItems(updated);
  };
  const removeMarqueeItem = (idx: number) => {
    setMarqueeItems(marqueeItems.filter((_, i) => i !== idx));
  };

  // Orbit node helpers
  const addOrbitNode = () => {
    setOrbitNodes([...orbitNodes, { name: 'Technology', desc: 'Core competency overview' }]);
  };
  const updateOrbitNode = (idx: number, field: keyof OrbitNode, val: string) => {
    const updated = [...orbitNodes];
    updated[idx] = { ...updated[idx], [field]: val };
    setOrbitNodes(updated);
  };
  const removeOrbitNode = (idx: number) => {
    setOrbitNodes(orbitNodes.filter((_, i) => i !== idx));
  };

  // Skills helpers
  const addSkill = () => {
    setSkills([...skills, { name: 'New Skill', category: 'Programming', proficiency: 80 }]);
  };
  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
  };
  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Experience helpers
  const addExperience = () => {
    setWorkExperience([
      ...workExperience,
      {
        company: 'Company or Institution',
        role: 'Role Title',
        startDate: '2023-01-01',
        endDate: null,
        current: true,
        description: 'Detail responsibilities, achievements, and technology stack used.',
      },
    ]);
  };
  const updateExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updated = [...workExperience];
    updated[index] = { ...updated[index], [field]: value };
    setWorkExperience(updated);
  };
  const removeExperience = (index: number) => {
    setWorkExperience(workExperience.filter((_, i) => i !== index));
  };

  // Projects helpers
  const addProject = () => {
    setProjects([
      ...projects,
      {
        title: 'New Featured Project',
        description: 'Provide an overview of the architecture, stack, and impact.',
        image: '',
        liveUrl: '',
        githubUrl: '',
        techStack: ['React', 'Node.js', 'TypeScript'],
      },
    ]);
  };
  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };
  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };
  const updateTechStack = (projectIndex: number, tagString: string) => {
    const tags = tagString.split(',').map((t) => t.trim()).filter(Boolean);
    updateProject(projectIndex, 'techStack', tags);
  };

  // Certifications helpers
  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        title: 'New Credential',
        issuer: 'Issuing Organization',
        date: '2024',
        link: '',
      },
    ]);
  };
  const updateCertification = (index: number, field: keyof Certification, value: any) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };
  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  // Testimonials helpers
  const addTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        name: 'Peer or Mentor Name',
        role: 'Senior Software Engineer',
        company: 'Tech Corp',
        text: 'A collaborative, highly skilled engineer who excels at problem-solving.',
        avatar: '',
      },
    ]);
  };
  const updateTestimonial = (index: number, field: keyof Testimonial, value: any) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setTestimonials(updated);
  };
  const removeTestimonial = (index: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  // Component toggling & position reordering
  const toggleComponent = (key: string) => {
    if (enabledComponents.includes(key)) {
      setEnabledComponents(enabledComponents.filter((k) => k !== key));
    } else {
      setEnabledComponents([...enabledComponents, key]);
    }
  };

  const moveComponent = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= enabledComponents.length) return;
    const updated = [...enabledComponents];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);
    setEnabledComponents(updated);
  };

  const setComponentPosition = (key: string, new1IndexedPos: number) => {
    const currentIdx = enabledComponents.indexOf(key);
    if (currentIdx === -1) return;
    const targetIdx = Math.max(0, Math.min(enabledComponents.length - 1, new1IndexedPos - 1));
    if (targetIdx === currentIdx) return;
    const updated = [...enabledComponents];
    const [moved] = updated.splice(currentIdx, 1);
    updated.splice(targetIdx, 0, moved);
    setEnabledComponents(updated);
  };

  const selectedCatalogItem = COMPONENT_CATALOG.find((c) => c.key === selectedComponentKey);

  // Render inline editor for each component catalog item with PreviewLocateButton integration
  const renderComponentConfigurator = (componentKey: string) => {
    switch (componentKey) {
      case 'hero':
        return (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-200 flex items-center justify-between gap-3">
              <div>
                <span className="font-semibold block text-orange-300 mb-0.5">Primary Hero Headline & Identity</span>
                <span>Edit your main headline, highlight keyword, and status badge. Updates reflect instantly in live preview!</span>
              </div>
              <PreviewLocateButton
                field="hero-title"
                label="Hero Section"
                onLocate={handleLocateInPreview}
                currentHighlight={activeHighlight}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-zinc-300 font-semibold">Hero Main Title (Fully Editable)</label>
                <PreviewLocateButton
                  field="hero-title"
                  label="Hero Headline"
                  onLocate={handleLocateInPreview}
                  currentHighlight={activeHighlight}
                  compact
                />
              </div>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="e.g. Engineering digital flare into products."
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-medium focus:outline-none focus:border-orange-500"
              />
              <p className="text-[11px] text-zinc-500">
                Tip: You can customize this entire headline. The highlight word below will be automatically colored in your accent theme!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Highlight Word / Phrase</label>
                  <PreviewLocateButton
                    field="hero-highlight"
                    label="Highlight Word"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={heroHighlightWord}
                  onChange={(e) => setHeroHighlightWord(e.target.value)}
                  placeholder="e.g. digital flare"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Professional Headline / Role Badge</label>
                  <PreviewLocateButton
                    field="headline"
                    label="Professional Headline"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. IT Engineer & ML Specialist"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Hero Subtitle Prefix</label>
                  <PreviewLocateButton
                    field="hero-subtitle"
                    label="Hero Subtitle"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder={`Hi, I'm @${user?.username || 'developer'}. Crafting:`}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Status Badge Text</label>
                  <PreviewLocateButton
                    field="status-badge"
                    label="Status Badge"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  placeholder="e.g. ready for hire"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Location</label>
                  <PreviewLocateButton
                    field="contact-location"
                    label="Location"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote / Berlin / Damascus"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Phone Number</label>
                  <PreviewLocateButton
                    field="contact-phone"
                    label="Phone"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. (+963) 935972100"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium block">Resume / CV Link</label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Profile Avatar in Hero */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700 shrink-0 flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-zinc-600" />
                )}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white inline-flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3 h-3" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Avatar'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e)}
                    />
                  </label>
                  <PreviewLocateButton
                    field="avatar"
                    label="Profile Avatar"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="url"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="Or paste image URL directly..."
                  className="w-full px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-[11px] focus:outline-none"
                />
              </div>
            </div>

            {/* Dynamic Typewriter Phrases List */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-300 font-medium">Cycling Typewriter Phrases ({typewriterPhrases.length})</span>
                <div className="flex items-center gap-2">
                  <PreviewLocateButton
                    field="typewriter-phrases"
                    label="Typewriter Phrases"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                  <button
                    type="button"
                    onClick={addPhrase}
                    className="text-orange-400 hover:text-orange-300 text-xs flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Phrase</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {typewriterPhrases.map((phrase, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={phrase}
                      onChange={(e) => updatePhrase(pIdx, e.target.value)}
                      placeholder="e.g. machine learning models."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => removePhrase(pIdx)}
                      className="p-1.5 text-zinc-500 hover:text-red-400"
                      title="Delete phrase"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Section Heading</label>
                  <PreviewLocateButton
                    field="about-heading"
                    label="About Heading"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
                  placeholder="Bridging technical rigor with human-centric interfaces."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Section Kicker / Subtitle</label>
                  <PreviewLocateButton
                    field="about-subtitle"
                    label="About Subtitle"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={aboutSubtitle}
                  onChange={(e) => setAboutSubtitle(e.target.value)}
                  placeholder="System Overview"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-zinc-300 font-medium">Biography Paragraph</label>
                <PreviewLocateButton
                  field="bio"
                  label="Biography Narrative"
                  onLocate={handleLocateInPreview}
                  currentHighlight={activeHighlight}
                  compact
                />
              </div>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell your story, algorithmic background..."
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none resize-none"
              />
            </div>

            {/* Dynamic About Metrics */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-300 font-medium">Stat Metric Boxes ({aboutMetrics.length})</span>
                <div className="flex items-center gap-2">
                  <PreviewLocateButton
                    field="metric-card"
                    label="Stat Metric Boxes"
                    totalInstances={aboutMetrics.length}
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                  <button
                    type="button"
                    onClick={addMetric}
                    className="text-orange-400 hover:text-orange-300 text-xs flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Metric</span>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {aboutMetrics.map((metric, mIdx) => (
                  <div key={mIdx} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-2">
                    <input
                      type="text"
                      value={metric.value}
                      onChange={(e) => updateMetric(mIdx, 'value', e.target.value)}
                      placeholder="Value (e.g. 3+)"
                      className="w-20 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-white font-bold text-xs"
                    />
                    <input
                      type="text"
                      value={metric.label}
                      onChange={(e) => updateMetric(mIdx, 'label', e.target.value)}
                      placeholder="Label (e.g. Positions)"
                      className="flex-1 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                    <PreviewLocateButton
                      field="about-metric"
                      label={`Metric: ${metric.label}`}
                      instanceIndex={mIdx}
                      totalInstances={aboutMetrics.length}
                      onLocate={handleLocateInPreview}
                      currentHighlight={activeHighlight}
                      compact
                    />
                    <button
                      type="button"
                      onClick={() => removeMetric(mIdx)}
                      className="p-1.5 text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'tech-marquee':
        return (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 font-medium">Marquee Ticker Technologies ({marqueeItems.length})</span>
              <div className="flex items-center gap-2">
                <PreviewLocateButton
                  field="tech-marquee"
                  label="Tech Marquee Bar"
                  onLocate={handleLocateInPreview}
                  currentHighlight={activeHighlight}
                  compact
                />
                <button
                  type="button"
                  onClick={addMarqueeItem}
                  className="text-orange-400 hover:text-orange-300 text-xs flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Technology</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {marqueeItems.map((item, mIdx) => (
                <div key={mIdx} className="flex items-center gap-2 p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateMarqueeItem(mIdx, e.target.value)}
                    placeholder="e.g. PyTorch / ML"
                    className="flex-1 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeMarqueeItem(mIdx)}
                    className="p-1 text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'donut-orbit':
        return (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 font-medium">Radial Orbit Wheel Technologies ({orbitNodes.length})</span>
              <div className="flex items-center gap-2">
                <PreviewLocateButton
                  field="donut-orbit"
                  label="Radial Orbit Wheel"
                  onLocate={handleLocateInPreview}
                  currentHighlight={activeHighlight}
                  compact
                />
                <button
                  type="button"
                  onClick={addOrbitNode}
                  className="text-orange-400 hover:text-orange-300 text-xs flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Orbit Node</span>
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {orbitNodes.map((node, oIdx) => (
                <div key={oIdx} className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={node.name}
                      onChange={(e) => updateOrbitNode(oIdx, 'name', e.target.value)}
                      placeholder="Technology Name"
                      className="w-36 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-white font-bold text-xs"
                    />
                    <input
                      type="text"
                      value={node.desc}
                      onChange={(e) => updateOrbitNode(oIdx, 'desc', e.target.value)}
                      placeholder="Competency description..."
                      className="flex-1 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeOrbitNode(oIdx)}
                      className="p-1 text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Section Heading</label>
                  <PreviewLocateButton
                    field="skills-title"
                    label="Skills Heading"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={skillsTitle}
                  onChange={(e) => setSkillsTitle(e.target.value)}
                  placeholder="Skills & Technical Stack"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Section Subtitle</label>
                  <PreviewLocateButton
                    field="skills-subtitle"
                    label="Skills Subtitle"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={skillsSubtitle}
                  onChange={(e) => setSkillsSubtitle(e.target.value)}
                  placeholder="Demonstrated competencies across programming languages..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-zinc-300 font-semibold">Skills List ({skills.length})</span>
              <div className="flex items-center gap-2">
                <PreviewLocateButton
                  field="skills"
                  label="All Skill Bars"
                  totalInstances={skills.length}
                  onLocate={handleLocateInPreview}
                  currentHighlight={activeHighlight}
                  compact
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-orange-400 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {skills.map((skill, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(idx, 'name', e.target.value)}
                      placeholder="Skill Name"
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-medium"
                    />
                    <select
                      value={skill.category}
                      onChange={(e) => updateSkill(idx, 'category', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white"
                    >
                      <option value="Programming">Programming</option>
                      <option value="Web & Databases">Web & Databases</option>
                      <option value="Tools & Design">Tools & Design</option>
                      <option value="Machine Learning">Machine Learning</option>
                    </select>
                    <PreviewLocateButton
                      field="skill"
                      label={`Skill: ${skill.name}`}
                      instanceIndex={idx}
                      totalInstances={skills.length}
                      onLocate={handleLocateInPreview}
                      currentHighlight={activeHighlight}
                      compact
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(idx)}
                      className="p-1.5 text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={skill.proficiency}
                      onChange={(e) => updateSkill(idx, 'proficiency', Number(e.target.value))}
                      className="flex-1 accent-orange-500"
                    />
                    <span className="text-xs font-mono text-orange-400 font-bold w-10 text-right">
                      {skill.proficiency}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Section Heading</label>
                  <PreviewLocateButton
                    field="experience-title"
                    label="Experience Heading"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={experienceTitle}
                  onChange={(e) => setExperienceTitle(e.target.value)}
                  placeholder="Work Experience & History"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Section Subtitle</label>
                  <PreviewLocateButton
                    field="experience-subtitle"
                    label="Experience Subtitle"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={experienceSubtitle}
                  onChange={(e) => setExperienceSubtitle(e.target.value)}
                  placeholder="Chronological trajectory of technical fellowships..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-zinc-300 font-semibold">Milestones List ({workExperience.length})</span>
              <div className="flex items-center gap-2">
                <PreviewLocateButton
                  field="experience"
                  label="All Milestones"
                  totalInstances={workExperience.length}
                  onLocate={handleLocateInPreview}
                  currentHighlight={activeHighlight}
                  compact
                />
                <button
                  type="button"
                  onClick={addExperience}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-orange-400 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {workExperience.map((exp, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-orange-400 font-semibold text-xs">Milestone #{idx + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <PreviewLocateButton
                        field="experience-item"
                        label={`Role: ${exp.role}`}
                        instanceIndex={idx}
                        totalInstances={workExperience.length}
                        onLocate={handleLocateInPreview}
                        currentHighlight={activeHighlight}
                        compact
                      />
                      <button
                        type="button"
                        onClick={() => removeExperience(idx)}
                        className="text-zinc-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                      placeholder="Company / Institution"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                      placeholder="Role Title"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={typeof exp.startDate === 'string' ? exp.startDate.split('T')[0] : ''}
                      onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                      placeholder="Start Date (YYYY-MM)"
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(idx, 'current', e.target.checked)}
                        className="rounded accent-orange-500"
                      />
                      <span>Current</span>
                    </label>
                  </div>
                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                    placeholder="Key responsibilities and achievements..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Section Heading</label>
                  <PreviewLocateButton
                    field="projects-title"
                    label="Projects Heading"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={projectsTitle}
                  onChange={(e) => setProjectsTitle(e.target.value)}
                  placeholder="Featured Engineering Projects"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Section Subtitle</label>
                  <PreviewLocateButton
                    field="projects-subtitle"
                    label="Projects Subtitle"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={projectsSubtitle}
                  onChange={(e) => setProjectsSubtitle(e.target.value)}
                  placeholder="Interactive simulations, AI architectures..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-zinc-300 font-semibold">Projects List ({projects.length})</span>
              <div className="flex items-center gap-2">
                <PreviewLocateButton
                  field="projects"
                  label="All Project Cards"
                  totalInstances={projects.length}
                  onLocate={handleLocateInPreview}
                  currentHighlight={activeHighlight}
                  compact
                />
                <button
                  type="button"
                  onClick={addProject}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-orange-400 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-orange-400 font-semibold text-xs">Project #{idx + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <PreviewLocateButton
                        field="project-item"
                        label={`Project: ${proj.title || 'Item'}`}
                        instanceIndex={idx}
                        totalInstances={projects.length}
                        onLocate={handleLocateInPreview}
                        currentHighlight={activeHighlight}
                        compact
                      />
                      <button
                        type="button"
                        onClick={() => removeProject(idx)}
                        className="text-zinc-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => updateProject(idx, 'title', e.target.value)}
                    placeholder="Project Title"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                    placeholder="Architecture, algorithms, and impact..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs resize-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="url"
                      value={proj.liveUrl || ''}
                      onChange={(e) => updateProject(idx, 'liveUrl', e.target.value)}
                      placeholder="Live Demo URL"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                    <input
                      type="url"
                      value={proj.githubUrl || ''}
                      onChange={(e) => updateProject(idx, 'githubUrl', e.target.value)}
                      placeholder="GitHub URL"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    value={proj.techStack?.join(', ') || ''}
                    onChange={(e) => updateTechStack(idx, e.target.value)}
                    placeholder="Tech stack (comma-separated, e.g. React, PyTorch, C#)"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'github-stats':
        return (
          <div className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-zinc-300 font-medium">GitHub Profile Link</label>
                <PreviewLocateButton
                  field="github-stats"
                  label="GitHub Activity Card"
                  onLocate={handleLocateInPreview}
                  currentHighlight={activeHighlight}
                  compact
                />
              </div>
              <input
                type="url"
                value={socialList.find(s => s.platform.toLowerCase().includes('github'))?.url || ''}
                onChange={(e) => {
                  const idx = socialList.findIndex(s => s.platform.toLowerCase().includes('github'));
                  if (idx !== -1) {
                    updateSocial(idx, 'url', e.target.value);
                  } else {
                    addSocial('GitHub');
                  }
                }}
                placeholder="https://github.com/username"
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none"
              />
              <p className="text-[11px] text-zinc-500">
                Stats, commit streaks, and repositories automatically calculate from this profile handle.
              </p>
            </div>
          </div>
        );

      case 'certifications':
        return (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 font-semibold">Credentials & Badges ({certifications.length})</span>
              <div className="flex items-center gap-2">
                <PreviewLocateButton
                  field="certifications"
                  label="All Certification Cards"
                  totalInstances={certifications.length}
                  onLocate={handleLocateInPreview}
                  currentHighlight={activeHighlight}
                  compact
                />
                <button
                  type="button"
                  onClick={addCertification}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-orange-400 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Credential</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {certifications.map((cert, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-orange-400 font-semibold text-xs">Credential #{idx + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <PreviewLocateButton
                        field="certifications"
                        label={`Cert: ${cert.title}`}
                        instanceIndex={idx}
                        totalInstances={certifications.length}
                        onLocate={handleLocateInPreview}
                        currentHighlight={activeHighlight}
                        compact
                      />
                      <button
                        type="button"
                        onClick={() => removeCertification(idx)}
                        className="text-zinc-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cert.title}
                      onChange={(e) => updateCertification(idx, 'title', e.target.value)}
                      placeholder="Certification Title"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(idx, 'issuer', e.target.value)}
                      placeholder="Issuer (e.g. DeepLearning.AI, AWS)"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) => updateCertification(idx, 'date', e.target.value)}
                      placeholder="Date (e.g. 2024)"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                    <input
                      type="url"
                      value={cert.link || ''}
                      onChange={(e) => updateCertification(idx, 'link', e.target.value)}
                      placeholder="Verification Link"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 font-semibold">Recommendations & Praise ({testimonials.length})</span>
              <div className="flex items-center gap-2">
                <PreviewLocateButton
                  field="testimonials"
                  label="All Recommendations"
                  totalInstances={testimonials.length}
                  onLocate={handleLocateInPreview}
                  currentHighlight={activeHighlight}
                  compact
                />
                <button
                  type="button"
                  onClick={addTestimonial}
                  className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-orange-400 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Recommendation</span>
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {testimonials.map((test, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-orange-400 font-semibold text-xs">Quote #{idx + 1}</span>
                    <div className="flex items-center gap-1.5">
                      <PreviewLocateButton
                        field="testimonials"
                        label={`Quote: ${test.name}`}
                        instanceIndex={idx}
                        totalInstances={testimonials.length}
                        onLocate={handleLocateInPreview}
                        currentHighlight={activeHighlight}
                        compact
                      />
                      <button
                        type="button"
                        onClick={() => removeTestimonial(idx)}
                        className="text-zinc-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={test.name}
                      onChange={(e) => updateTestimonial(idx, 'name', e.target.value)}
                      placeholder="Name"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={test.role}
                      onChange={(e) => updateTestimonial(idx, 'role', e.target.value)}
                      placeholder="Role"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                    <input
                      type="text"
                      value={test.company}
                      onChange={(e) => updateTestimonial(idx, 'company', e.target.value)}
                      placeholder="Company"
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={test.text}
                    onChange={(e) => updateTestimonial(idx, 'text', e.target.value)}
                    placeholder="Quote recommendation text..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'interactive-canvas':
        return (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold block">Generative Vector Canvas</span>
                <PreviewLocateButton
                  field="interactive-canvas"
                  label="Physics Canvas"
                  onLocate={handleLocateInPreview}
                  currentHighlight={activeHighlight}
                  compact
                />
              </div>
              <p className="text-zinc-400 text-xs">
                Draws interactive physics particles and kinetic vector flow fields representing @{user?.username || 'developer'}. Visitors can interact by moving their cursor or clicking to disperse particle fields.
              </p>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Contact Heading</label>
                  <PreviewLocateButton
                    field="contact-title"
                    label="Contact Heading"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={contactTitle}
                  onChange={(e) => setContactTitle(e.target.value)}
                  placeholder="Let's Work Together"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Contact Subtitle</label>
                  <PreviewLocateButton
                    field="contact-subtitle"
                    label="Contact Subtitle"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={contactSubtitle}
                  onChange={(e) => setContactSubtitle(e.target.value)}
                  placeholder="Have a project inquiry or software opportunity? Send a message directly."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Location Statement</label>
                  <PreviewLocateButton
                    field="contact-location"
                    label="Location Card"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Available for remote roles & contracts"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-medium">Phone Number</label>
                  <PreviewLocateButton
                    field="contact-phone"
                    label="Phone Card"
                    onLocate={handleLocateInPreview}
                    currentHighlight={activeHighlight}
                    compact
                  />
                </div>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(+963) 935972100"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-zinc-200 font-semibold block text-xs">Direct Email Dispatch Form</span>
                <span className="text-zinc-500 text-[11px]">Visitor inquiry dispatch form to your registered email</span>
              </div>
              <PreviewLocateButton
                field="contact-form"
                label="Direct Dispatch Form"
                onLocate={handleLocateInPreview}
                currentHighlight={activeHighlight}
                compact
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto bg-grid-pattern">
      
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-orange-400 mb-1">
            <span>Portfolio Studio · @{user?.username}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Live Visual Builder
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'edit' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Edit Only</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'split' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'preview' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full Preview</span>
            </button>
          </div>

          {user && (
            <button
              onClick={() => onNavigate(`/${user.username}`)}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Public Page</span>
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-white text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${themeSettings.accentColor} 0%, #ea580c 100%)`,
              boxShadow: `0 6px 18px -4px ${themeSettings.accentColor}50`,
            }}
          >
            {isSaving ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Editor & Right Live Preview */}
      <div className={`grid gap-8 items-start ${
        viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
      }`}>
        
        {/* ============================================================== */}
        {/* LEFT / EDITOR PANEL */}
        {/* ============================================================== */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-6 xl:col-span-5' : 'max-w-4xl mx-auto w-full'} space-y-6`}>
            
            {/* Horizontal Tabs Bar */}
            <div className="glass-panel p-2 rounded-2xl border border-zinc-800 flex flex-wrap gap-1">
              <button
                onClick={() => setActiveTab('components')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'components' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-orange-400" />
                <span>Components ({enabledComponents.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('personal')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'personal' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Personal</span>
              </button>

              <button
                onClick={() => setActiveTab('skills')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'skills' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Skills ({skills.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('experience')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'experience' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>History</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'projects' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Projects ({projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('styling')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'styling' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-orange-400" />
                <span>Styling Engine</span>
              </button>

              <button
                onClick={() => setActiveTab('certifications')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'certifications' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Honors</span>
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'testimonials' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Quote className="w-3.5 h-3.5" />
                <span>Praise</span>
              </button>

              <button
                onClick={() => setActiveTab('social')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'social' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Socials ({socialList.length})</span>
              </button>
            </div>

            {/* Editor Content Box */}
            <div className="glass-panel p-6 rounded-2xl border border-zinc-800 space-y-6 max-h-[82vh] overflow-y-auto">
              
              {/* TAB: MODULAR COMPONENTS & INLINE CONFIGURATOR */}
              {activeTab === 'components' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-orange-400" />
                      <span>Modular Components & Section Ordering</span>
                    </h3>
                    <p className="text-zinc-400 text-xs mt-1">
                      Click any component below to edit its content & position in the panel underneath. Use arrows to reorder.
                    </p>
                  </div>

                  {/* Components List with Accordion-style Inline Editor Under Each Section */}
                  <div className="space-y-3">
                    {COMPONENT_CATALOG.map((item) => {
                      const isEnabled = enabledComponents.includes(item.key);
                      const orderIdx = enabledComponents.indexOf(item.key);
                      const isSelected = selectedComponentKey === item.key;

                      return (
                        <div
                          key={item.key}
                          className={`rounded-2xl border transition-all overflow-hidden ${
                            isSelected
                              ? 'border-orange-500 bg-zinc-900/95 shadow-xl ring-1 ring-orange-500/50'
                              : isEnabled
                              ? 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                              : 'bg-zinc-950/40 border-zinc-900 opacity-60 hover:opacity-80'
                          }`}
                        >
                          {/* Section Row Header - Click to toggle editing under this section */}
                          <div
                            onClick={() => setSelectedComponentKey(isSelected ? '' : item.key)}
                            className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-zinc-800/40 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleComponent(item.key);
                                }}
                                className="text-orange-400 hover:text-orange-300"
                                title={isEnabled ? "Disable section on portfolio" : "Enable section on portfolio"}
                              >
                                {isEnabled ? (
                                  <ToggleRight className="w-6 h-6 text-orange-500" />
                                ) : (
                                  <ToggleLeft className="w-6 h-6 text-zinc-600" />
                                )}
                              </button>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`font-bold text-xs ${isSelected ? 'text-orange-400' : 'text-white'}`}>
                                    {item.name}
                                  </span>
                                  {isEnabled && (
                                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                                      Position #{orderIdx + 1}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-zinc-400 line-clamp-1">{item.desc}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              {isEnabled && (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={orderIdx === 0}
                                    onClick={() => moveComponent(orderIdx, 'up')}
                                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30"
                                    title="Move Up"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={orderIdx === enabledComponents.length - 1}
                                    onClick={() => moveComponent(orderIdx, 'down')}
                                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30"
                                    title="Move Down"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() => setSelectedComponentKey(isSelected ? '' : item.key)}
                                className={`text-[10px] px-2.5 py-1 rounded-lg font-mono flex items-center gap-1.5 transition-all ${
                                  isSelected
                                    ? 'bg-orange-500 text-white font-bold shadow-sm'
                                    : 'bg-zinc-800/80 text-zinc-300 hover:text-white hover:bg-zinc-700'
                                }`}
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>{isSelected ? 'Close' : 'Edit Section'}</span>
                                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isSelected ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          </div>

                          {/* EXPANDED INLINE EDITING ACCORDION DIRECTLY UNDER THIS SECTION */}
                          {isSelected && (
                            <div className="p-4 sm:p-5 border-t border-zinc-800/80 bg-zinc-950/80 space-y-5 animate-in fade-in duration-150">
                              {/* Section Top Controls Bar */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                  <span className="text-xs font-bold text-white">
                                    Editing <span className="text-orange-400">{item.name}</span>
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  {/* Button to see this whole section in live preview */}
                                  <PreviewLocateButton
                                    field={
                                      item.key === 'hero' ? 'hero-title' :
                                      item.key === 'about' ? 'about-heading' :
                                      item.key === 'skills' ? 'skills-title' :
                                      item.key === 'experience' ? 'experience-title' :
                                      item.key === 'projects' ? 'projects-title' :
                                      item.key === 'contact' ? 'contact-title' :
                                      item.key
                                    }
                                    label={`${item.name}`}
                                    onLocate={handleLocateInPreview}
                                    currentHighlight={activeHighlight}
                                  />

                                  {/* Position Direct Selector */}
                                  {isEnabled && (
                                    <div className="flex items-center gap-1.5 text-xs bg-zinc-900 px-2 py-1 rounded-xl border border-zinc-800">
                                      <span className="text-zinc-400 font-mono text-[11px]">Position:</span>
                                      <select
                                        value={enabledComponents.indexOf(item.key) + 1}
                                        onChange={(e) => setComponentPosition(item.key, Number(e.target.value))}
                                        className="px-2 py-0.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white font-mono text-xs focus:outline-none focus:border-orange-500 cursor-pointer"
                                      >
                                        {enabledComponents.map((_, idx) => (
                                          <option key={idx + 1} value={idx + 1}>
                                            #{idx + 1} of {enabledComponents.length}
                                          </option>
                                        ))}
                                      </select>

                                      <div className="flex items-center gap-0.5 ml-1">
                                        <button
                                          type="button"
                                          disabled={enabledComponents.indexOf(item.key) === 0}
                                          onClick={() => moveComponent(enabledComponents.indexOf(item.key), 'up')}
                                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 transition-colors"
                                          title="Move Earlier in Page"
                                        >
                                          <ChevronUp className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          disabled={enabledComponents.indexOf(item.key) === enabledComponents.length - 1}
                                          onClick={() => moveComponent(enabledComponents.indexOf(item.key), 'down')}
                                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30 transition-colors"
                                          title="Move Later in Page"
                                        >
                                          <ChevronDown className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Toggle Active Button */}
                                  <button
                                    type="button"
                                    onClick={() => toggleComponent(item.key)}
                                    className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                                      isEnabled
                                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20'
                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                    }`}
                                  >
                                    {isEnabled ? (
                                      <>
                                        <ToggleRight className="w-3.5 h-3.5 text-orange-400" />
                                        <span>Active</span>
                                      </>
                                    ) : (
                                      <>
                                        <ToggleLeft className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Enable</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Specific Form Fields For This Section */}
                              {renderComponentConfigurator(item.key)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB: PERSONAL INFO */}
              {activeTab === 'personal' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Personal Information</h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigate('/profile')}
                        className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Dedicated Profile Page ↗</span>
                      </button>
                      <PreviewLocateButton
                        field="hero-title"
                        label="Hero Profile Card"
                        onLocate={handleLocateInPreview}
                        currentHighlight={activeHighlight}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20 flex items-center justify-between text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span>Phone, email, avatar & bio automatically sync between your <strong>Profile Page</strong> and this Dashboard.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate('/profile')}
                      className="text-orange-400 hover:text-orange-300 font-bold underline shrink-0 ml-2"
                    >
                      Manage Profile ↗
                    </button>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-700 shrink-0">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors">
                            <Upload className="w-3 h-3" />
                            <span>{isUploading ? 'Uploading...' : 'Upload Avatar'}</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e)}
                            />
                          </label>
                          {profileImage && (
                            <button
                              type="button"
                              onClick={() => setProfileImage('')}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <PreviewLocateButton
                          field="avatar"
                          label="Profile Avatar"
                          onLocate={handleLocateInPreview}
                          currentHighlight={activeHighlight}
                          compact
                        />
                      </div>
                      <p className="text-[11px] text-zinc-500">Supported: JPEG, PNG, WebP (Max 2MB)</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-zinc-300">Professional Headline</label>
                      <PreviewLocateButton
                        field="headline"
                        label="Professional Headline"
                        onLocate={handleLocateInPreview}
                        currentHighlight={activeHighlight}
                        compact
                      />
                    </div>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. IT Engineer & Machine Learning Specialist"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-zinc-300">Phone Number</label>
                      <PreviewLocateButton
                        field="contact-phone"
                        label="Phone Number"
                        onLocate={handleLocateInPreview}
                        currentHighlight={activeHighlight}
                        compact
                      />
                    </div>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. (+963) 935972100"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-zinc-300">Bio Narrative</label>
                      <PreviewLocateButton
                        field="bio"
                        label="Biography Narrative"
                        onLocate={handleLocateInPreview}
                        currentHighlight={activeHighlight}
                        compact
                      />
                    </div>
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell your story, algorithmic background, and focus..."
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-orange-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB: SKILLS MANAGER */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Skills & Proficiency Bars</h3>
                    <div className="flex items-center gap-2">
                      <PreviewLocateButton
                        field="skills"
                        label="All Skill Bars"
                        totalInstances={skills.length}
                        onLocate={handleLocateInPreview}
                        currentHighlight={activeHighlight}
                        compact
                      />
                      <button
                        onClick={addSkill}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-orange-400 text-xs font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Skill</span>
                      </button>
                    </div>
                  </div>

                  {skills.map((skill, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkill(idx, 'name', e.target.value)}
                          placeholder="Skill Name"
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none"
                        />
                        <select
                          value={skill.category}
                          onChange={(e) => updateSkill(idx, 'category', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none"
                        >
                          <option value="Programming">Programming</option>
                          <option value="Web & Databases">Web & Databases</option>
                          <option value="Tools & Design">Tools & Design</option>
                          <option value="Machine Learning">Machine Learning</option>
                        </select>
                        <PreviewLocateButton
                          field="skill"
                          label={`Skill: ${skill.name}`}
                          instanceIndex={idx}
                          totalInstances={skills.length}
                          onLocate={handleLocateInPreview}
                          currentHighlight={activeHighlight}
                          compact
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(idx)}
                          className="p-1.5 text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={skill.proficiency}
                          onChange={(e) => updateSkill(idx, 'proficiency', Number(e.target.value))}
                          className="flex-1 accent-orange-500"
                        />
                        <span className="text-xs font-mono text-orange-400 font-bold w-10 text-right">
                          {skill.proficiency}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: WORK EXPERIENCE */}
              {activeTab === 'experience' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Experience & Timeline</h3>
                    <div className="flex items-center gap-2">
                      <PreviewLocateButton
                        field="experience"
                        label="All Milestones"
                        totalInstances={workExperience.length}
                        onLocate={handleLocateInPreview}
                        currentHighlight={activeHighlight}
                        compact
                      />
                      <button
                        onClick={addExperience}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-orange-400 text-xs font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Milestone</span>
                      </button>
                    </div>
                  </div>

                  {workExperience.map((exp, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-orange-400">Milestone #{idx + 1}</span>
                        <div className="flex items-center gap-1.5">
                          <PreviewLocateButton
                            field="experience-item"
                            label={`Role: ${exp.role}`}
                            instanceIndex={idx}
                            totalInstances={workExperience.length}
                            onLocate={handleLocateInPreview}
                            currentHighlight={activeHighlight}
                            compact
                          />
                          <button
                            type="button"
                            onClick={() => removeExperience(idx)}
                            className="text-zinc-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                          placeholder="Company / Institution"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs"
                        />
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                          placeholder="Role Title"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={typeof exp.startDate === 'string' ? exp.startDate.split('T')[0] : ''}
                          onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                          placeholder="Start Date (YYYY-MM)"
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs"
                        />
                        <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateExperience(idx, 'current', e.target.checked)}
                            className="rounded accent-orange-500"
                          />
                          <span>Current</span>
                        </label>
                      </div>

                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                        placeholder="Key responsibilities and achievements..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: PROJECTS SHOWCASE */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Projects Showcase</h3>
                    <div className="flex items-center gap-2">
                      <PreviewLocateButton
                        field="projects"
                        label="All Projects"
                        totalInstances={projects.length}
                        onLocate={handleLocateInPreview}
                        currentHighlight={activeHighlight}
                        compact
                      />
                      <button
                        onClick={addProject}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-orange-400 text-xs font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Project</span>
                      </button>
                    </div>
                  </div>

                  {projects.map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-orange-400">Project #{idx + 1}</span>
                        <div className="flex items-center gap-1.5">
                          <PreviewLocateButton
                            field="project-item"
                            label={`Project: ${proj.title || 'Item'}`}
                            instanceIndex={idx}
                            totalInstances={projects.length}
                            onLocate={handleLocateInPreview}
                            currentHighlight={activeHighlight}
                            compact
                          />
                          <button
                            type="button"
                            onClick={() => removeProject(idx)}
                            className="text-zinc-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => updateProject(idx, 'title', e.target.value)}
                          placeholder="Project Title"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs font-semibold"
                        />
                        <input
                          type="text"
                          value={proj.techStack?.join(', ') || ''}
                          onChange={(e) => updateTechStack(idx, e.target.value)}
                          placeholder="Tech stack (comma-separated)"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(idx, 'description', e.target.value)}
                        placeholder="Project overview & architecture..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs resize-none"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="url"
                          value={proj.liveUrl || ''}
                          onChange={(e) => updateProject(idx, 'liveUrl', e.target.value)}
                          placeholder="Live Demo URL"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs"
                        />
                        <input
                          type="url"
                          value={proj.githubUrl || ''}
                          onChange={(e) => updateProject(idx, 'githubUrl', e.target.value)}
                          placeholder="GitHub Repository URL"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: ADVANCED STYLING ENGINE */}
              {activeTab === 'styling' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Palette className="w-4 h-4 text-orange-400" />
                        <span>Advanced Styling & Animation Engine</span>
                      </h3>
                      <p className="text-zinc-400 text-xs mt-1">
                        Configure backgrounds, border physics, fonts, and entrance animations.
                      </p>
                    </div>
                    <PreviewLocateButton
                      field="hero-title"
                      label="Theme Visuals"
                      onLocate={handleLocateInPreview}
                      currentHighlight={activeHighlight}
                    />
                  </div>

                  {/* 1. Dynamic Background Style */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300">Background Texture & Effects</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'grid', label: 'Tech Grid (32px)' },
                        { id: 'mesh', label: 'Glowing Mesh Blobs' },
                        { id: 'gradient', label: 'Animated Gradient' },
                        { id: 'particles', label: 'Star Particle Sparks' },
                        { id: 'solid', label: 'Deep Solid Matte' },
                      ].map((bg) => (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => setThemeSettings({ ...themeSettings, backgroundStyle: bg.id as any })}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                            themeSettings.backgroundStyle === bg.id
                              ? 'border-orange-500 bg-zinc-800 text-white'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {bg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Border Effects */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300">Card Border Physics</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'subtle', label: 'Subtle (1px Line)' },
                        { id: 'glow', label: 'Accent Glow Halo' },
                        { id: 'neon', label: 'Cyber Neon Ring' },
                        { id: 'glass', label: 'Heavy Frosted Blur' },
                        { id: 'sharp', label: 'Sharp Crisp Contrast' },
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setThemeSettings({ ...themeSettings, borderStyle: b.id as any })}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                            themeSettings.borderStyle === b.id
                              ? 'border-orange-500 bg-zinc-800 text-white'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Text Animation */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300">Hero Text Animation</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'typewriter', label: 'Typewriter Cursor' },
                        { id: 'fade-slide', label: 'Fade & Slide Up' },
                        { id: 'glitch', label: 'Chromatic Glitch' },
                        { id: 'none', label: 'Static Solid' },
                      ].map((anim) => (
                        <button
                          key={anim.id}
                          type="button"
                          onClick={() => setThemeSettings({ ...themeSettings, textAnimation: anim.id as any })}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                            themeSettings.textAnimation === anim.id
                              ? 'border-orange-500 bg-zinc-800 text-white'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {anim.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. Font Family */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300">Typography Pairing</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'inter', label: 'Inter Sans', font: 'font-sans' },
                        { id: 'fira', label: 'Fira Code Mono', font: 'font-mono' },
                        { id: 'jakarta', label: 'Jakarta Modern', font: 'font-sans' },
                        { id: 'space', label: 'Space Grotesk', font: 'font-mono' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setThemeSettings({ ...themeSettings, fontFamily: f.id as any })}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${f.font} ${
                            themeSettings.fontFamily === f.id
                              ? 'border-orange-500 bg-zinc-800 text-white'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. Accent Color Presets */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-300">Accent Color Flare</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {ACCENT_PRESETS.map((p) => (
                        <button
                          key={p.hex}
                          type="button"
                          onClick={() => setThemeSettings({ ...themeSettings, accentColor: p.hex })}
                          className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs ${
                            themeSettings.accentColor.toLowerCase() === p.hex.toLowerCase()
                              ? 'border-white bg-zinc-800'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400'
                          }`}
                        >
                          <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.hex }} />
                          <span className="truncate">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: CERTIFICATIONS MANAGER */}
              {activeTab === 'certifications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Certifications & Honors</h3>
                    <div className="flex items-center gap-2">
                      <PreviewLocateButton
                        field="certifications"
                        label="All Certifications"
                        totalInstances={certifications.length}
                        onLocate={handleLocateInPreview}
                        currentHighlight={activeHighlight}
                        compact
                      />
                      <button
                        onClick={addCertification}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-orange-400 text-xs font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Credential</span>
                      </button>
                    </div>
                  </div>

                  {certifications.map((cert, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-orange-400">Credential #{idx + 1}</span>
                        <div className="flex items-center gap-1.5">
                          <PreviewLocateButton
                            field="certifications"
                            label={`Cert: ${cert.title}`}
                            instanceIndex={idx}
                            totalInstances={certifications.length}
                            onLocate={handleLocateInPreview}
                            currentHighlight={activeHighlight}
                            compact
                          />
                          <button
                            type="button"
                            onClick={() => removeCertification(idx)}
                            className="text-zinc-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => updateCertification(idx, 'title', e.target.value)}
                          placeholder="Certification Title"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs font-semibold"
                        />
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => updateCertification(idx, 'issuer', e.target.value)}
                          placeholder="Issuer (e.g. DeepLearning.AI, AWS)"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cert.date}
                          onChange={(e) => updateCertification(idx, 'date', e.target.value)}
                          placeholder="Date (e.g. 2024)"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs"
                        />
                        <input
                          type="url"
                          value={cert.link || ''}
                          onChange={(e) => updateCertification(idx, 'link', e.target.value)}
                          placeholder="Verification Link"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: TESTIMONIALS MANAGER */}
              {activeTab === 'testimonials' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Recommendations & Praise</h3>
                    <div className="flex items-center gap-2">
                      <PreviewLocateButton
                        field="testimonials"
                        label="All Recommendations"
                        totalInstances={testimonials.length}
                        onLocate={handleLocateInPreview}
                        currentHighlight={activeHighlight}
                        compact
                      />
                      <button
                        onClick={addTestimonial}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-orange-400 text-xs font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Quote</span>
                      </button>
                    </div>
                  </div>

                  {testimonials.map((test, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-orange-400">Quote #{idx + 1}</span>
                        <div className="flex items-center gap-1.5">
                          <PreviewLocateButton
                            field="testimonials"
                            label={`Quote: ${test.name}`}
                            instanceIndex={idx}
                            totalInstances={testimonials.length}
                            onLocate={handleLocateInPreview}
                            currentHighlight={activeHighlight}
                            compact
                          />
                          <button
                            type="button"
                            onClick={() => removeTestimonial(idx)}
                            className="text-zinc-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={test.name}
                          onChange={(e) => updateTestimonial(idx, 'name', e.target.value)}
                          placeholder="Name"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs font-semibold"
                        />
                        <input
                          type="text"
                          value={test.role}
                          onChange={(e) => updateTestimonial(idx, 'role', e.target.value)}
                          placeholder="Role"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs"
                        />
                        <input
                          type="text"
                          value={test.company}
                          onChange={(e) => updateTestimonial(idx, 'company', e.target.value)}
                          placeholder="Company"
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={test.text}
                        onChange={(e) => updateTestimonial(idx, 'text', e.target.value)}
                        placeholder="Quote text..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-xs resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: SOCIALS & DYNAMIC SLOTS */}
              {activeTab === 'social' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-orange-400" />
                        <span>Social & Coding Profiles</span>
                      </h3>
                      <p className="text-zinc-400 text-xs mt-1">
                        Add, remove, or reorder unlimited social links. No slot limits!
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <PreviewLocateButton
                        field="social-links"
                        label="Social Profiles Bar"
                        totalInstances={socialList.length}
                        onLocate={handleLocateInPreview}
                        currentHighlight={activeHighlight}
                        compact
                      />
                      <button
                        type="button"
                        onClick={() => addSocial('GitHub')}
                        className="px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all w-fit"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Social Link</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick-add presets bar */}
                  <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                      Quick Add Platform:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['GitHub', 'LinkedIn', 'LeetCode', 'Codeforces', 'Twitter / X', 'Personal Website', 'Discord', 'YouTube', 'Telegram', 'Instagram'].map((pName) => {
                        const alreadyAdded = socialList.some(s => s.platform.toLowerCase() === pName.toLowerCase());
                        return (
                          <button
                            key={pName}
                            type="button"
                            onClick={() => addSocial(pName)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
                              alreadyAdded
                                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                                : 'bg-zinc-900/90 border-zinc-700 text-zinc-200 hover:border-orange-500 hover:text-orange-400'
                            }`}
                          >
                            <Plus className="w-3 h-3 text-orange-400" />
                            <span>{pName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Socials List with Up/Down and Delete */}
                  {socialList.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-800 space-y-3">
                      <Share2 className="w-8 h-8 text-zinc-600 mx-auto" />
                      <p className="text-zinc-400 text-xs">
                        No social accounts or links configured yet.
                      </p>
                      <button
                        type="button"
                        onClick={() => addSocial('GitHub')}
                        className="px-4 py-2 rounded-xl flare-gradient text-white text-xs font-bold shadow-md"
                      >
                        Add Your First Link
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {socialList.map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                        >
                          {/* Order index + Reorder arrows */}
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[11px] font-mono text-zinc-500 w-5 text-center">
                              #{idx + 1}
                            </span>
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveSocial(idx, 'up')}
                                className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20 transition-colors"
                                title="Move Up"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === socialList.length - 1}
                                onClick={() => moveSocial(idx, 'down')}
                                className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20 transition-colors"
                                title="Move Down"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Platform Selector or Custom Name */}
                          <div className="w-full sm:w-44 shrink-0">
                            <select
                              value={SOCIAL_PLATFORM_PRESETS.includes(item.platform) ? item.platform : 'Other / Custom'}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val !== 'Other / Custom') {
                                  updateSocial(idx, 'platform', val);
                                } else {
                                  updateSocial(idx, 'platform', 'Custom');
                                }
                              }}
                              className="w-full px-2.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-orange-500 cursor-pointer"
                            >
                              {SOCIAL_PLATFORM_PRESETS.map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </div>

                          {/* Custom Platform Name Input if Other / Custom */}
                          {(!SOCIAL_PLATFORM_PRESETS.includes(item.platform) || item.platform === 'Other / Custom') && (
                            <input
                              type="text"
                              value={item.platform === 'Other / Custom' ? '' : item.platform}
                              onChange={(e) => updateSocial(idx, 'platform', e.target.value || 'Custom')}
                              placeholder="Platform Name..."
                              className="w-full sm:w-36 px-2.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-semibold focus:outline-none focus:border-orange-500"
                            />
                          )}

                          {/* URL input */}
                          <div className="flex-1">
                            <input
                              type="url"
                              value={item.url}
                              onChange={(e) => updateSocial(idx, 'url', e.target.value)}
                              placeholder={`https://${item.platform.toLowerCase().replace(/[^a-z0-9]/g, '') || 'site'}.com/...`}
                              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => removeSocial(idx)}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors self-end sm:self-center"
                            title={`Remove ${item.platform} link`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* RIGHT / LIVE PREVIEW PANEL */}
        {/* ============================================================== */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-6 xl:col-span-7' : 'w-full'}`}>
            <div className="glass-panel rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
              
              {/* Preview Window Header */}
              <div className="px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-mono text-xs text-zinc-400">
                    Live Real-Time Viewport
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeHighlight && (
                    <div className="text-[11px] font-mono font-semibold text-orange-400 flex items-center gap-1.5 bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-500/30">
                      <Target className="w-3 h-3 text-orange-400" />
                      <span>Focus: {activeHighlight.label}</span>
                      {activeHighlight.totalInstances > 1 && (
                        <span>({activeHighlight.instanceIndex + 1}/{activeHighlight.totalInstances})</span>
                      )}
                    </div>
                  )}
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Instant Keystroke Reactivity
                  </span>
                </div>
              </div>

              {/* Rendered Live Preview Frame */}
              <div className="max-h-[85vh] overflow-y-auto relative" id="live-preview-viewport">
                {/* Floating Navigation Pill in Preview */}
                {activeHighlight && (
                  <div className="sticky top-2 z-50 mx-4 my-2 p-2.5 rounded-2xl bg-zinc-950/95 border border-orange-500/80 shadow-2xl flex items-center justify-between gap-3 backdrop-blur-xl animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                      <span className="text-zinc-400 font-mono text-[11px]">Highlighting:</span>
                      <span className="font-bold text-white text-xs">{activeHighlight.label}</span>
                      {activeHighlight.totalInstances > 1 && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-mono text-[11px] font-bold border border-orange-500/30">
                          Instance {activeHighlight.instanceIndex + 1} of {activeHighlight.totalInstances}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {activeHighlight.totalInstances > 1 && (
                        <div className="flex items-center gap-1 bg-zinc-900 px-1.5 py-0.5 rounded-lg border border-zinc-800">
                          <button
                            type="button"
                            onClick={() => handleLocateInPreview(activeHighlight.field, 'prev', activeHighlight.label)}
                            className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white transition-colors"
                            title="Navigate to previous instance"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[11px] font-mono font-bold text-orange-400 px-1">
                            {activeHighlight.instanceIndex + 1}/{activeHighlight.totalInstances}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleLocateInPreview(activeHighlight.field, 'next', activeHighlight.label)}
                            className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-white transition-colors"
                            title="Navigate to next instance"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setActiveHighlight(null)}
                        className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                        title="Clear highlight"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <PortfolioView
                  previewData={currentPreviewData}
                  previewUser={user || { _id: 'demo-id', username: 'laith_hh', email: 'user@example.com' }}
                  isEmbedded={true}
                  onShowToast={onShowToast}
                  onNavigate={onNavigate}
                  activeHighlightField={activeHighlight?.field}
                  activeHighlightIndex={activeHighlight?.instanceIndex}
                />
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};
