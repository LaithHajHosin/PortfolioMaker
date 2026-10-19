export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt?: string;
}

export interface Skill {
  name: string;
  category: string;
  proficiency: number;
}

export interface WorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
}

export interface CustomSocial {
  platform: string;
  url: string;
}

export interface DynamicSocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  leetcode?: string;
  codeforces?: string;
  website?: string;
  customSocials?: CustomSocial[];
  dynamicLinks?: DynamicSocialLink[];
}

export interface Project {
  title: string;
  description: string;
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  techStack: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  avatar?: string;
}

export interface AboutMetric {
  label: string;
  value: string;
  sublabel?: string;
}

export interface MarqueeItem {
  label: string;
}

export interface OrbitNode {
  name: string;
  desc: string;
}

export interface ThemeSettings {
  accentColor: string;
  mode: 'light' | 'dark';
  layout: 'minimal' | 'glass';
  backgroundStyle: 'solid' | 'gradient' | 'mesh' | 'grid' | 'particles';
  borderStyle: 'subtle' | 'glow' | 'neon' | 'glass' | 'sharp';
  textAnimation: 'none' | 'typewriter' | 'fade-slide' | 'glitch';
  fontFamily: 'inter' | 'fira' | 'jakarta' | 'space';
}

export interface Portfolio {
  _id?: string;
  userId: string;
  headline: string;
  bio: string;
  phoneNumber: string;
  location?: string;
  resumeUrl?: string;
  profileImage: string;
  heroTitle?: string;
  heroHighlightWord?: string;
  heroSubtitle?: string;
  statusText?: string;
  typewriterPhrases?: string[];
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutMetrics?: AboutMetric[];
  marqueeItems?: MarqueeItem[];
  orbitNodes?: OrbitNode[];
  skillsTitle?: string;
  skillsSubtitle?: string;
  skills: Skill[];
  experienceTitle?: string;
  experienceSubtitle?: string;
  workExperience: WorkExperience[];
  socialLinks: SocialLinks;
  projectsTitle?: string;
  projectsSubtitle?: string;
  projects: Project[];
  certifications?: Certification[];
  testimonials?: Testimonial[];
  contactTitle?: string;
  contactSubtitle?: string;
  enabledComponents?: string[];
  themeSettings: ThemeSettings;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ path: string; message: string }>;
}

export interface AuthResponseData {
  token: string;
  user: User;
  portfolio: Portfolio;
}

export interface PublicPortfolioData {
  user: User;
  portfolio: Portfolio;
}
