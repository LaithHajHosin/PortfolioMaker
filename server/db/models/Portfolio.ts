import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISkill {
  name: string;
  category: string;
  proficiency: number;
}

export interface IWorkExperience {
  company: string;
  role: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  current: boolean;
  description: string;
}

export interface ICustomSocial {
  platform: string;
  url: string;
}

export interface IDynamicSocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  leetcode?: string;
  codeforces?: string;
  website?: string;
  customSocials?: ICustomSocial[];
  dynamicLinks?: IDynamicSocialLink[];
}

export interface IProject {
  title: string;
  description: string;
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  techStack: string[];
}

export interface ICertification {
  title: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface ITestimonial {
  name: string;
  role: string;
  company: string;
  text: string;
  avatar?: string;
}

export interface IAboutMetric {
  label: string;
  value: string;
  sublabel?: string;
}

export interface IThemeSettings {
  accentColor: string;
  mode: 'light' | 'dark';
  layout: 'minimal' | 'glass';
  backgroundStyle: 'solid' | 'gradient' | 'mesh' | 'grid' | 'particles';
  borderStyle: 'subtle' | 'glow' | 'neon' | 'glass' | 'sharp';
  textAnimation: 'none' | 'typewriter' | 'fade-slide' | 'glitch';
  fontFamily: 'inter' | 'fira' | 'jakarta' | 'space';
}

export interface IPortfolio extends Document {
  userId: Types.ObjectId | string;
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
  aboutMetrics?: IAboutMetric[];
  marqueeItems?: Array<{ label: string }>;
  orbitNodes?: Array<{ name: string; desc: string }>;
  skillsTitle?: string;
  skillsSubtitle?: string;
  skills: ISkill[];
  experienceTitle?: string;
  experienceSubtitle?: string;
  workExperience: IWorkExperience[];
  socialLinks: ISocialLinks;
  projectsTitle?: string;
  projectsSubtitle?: string;
  projects: IProject[];
  certifications: ICertification[];
  testimonials: ITestimonial[];
  contactTitle?: string;
  contactSubtitle?: string;
  enabledComponents: string[];
  themeSettings: IThemeSettings;
}

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  category: { type: String, default: 'General' },
  proficiency: { type: Number, min: 1, max: 100, default: 80 },
}, { _id: false });

const WorkExperienceSchema = new Schema<IWorkExperience>({
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, default: null },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
}, { _id: false });

const CustomSocialSchema = new Schema<ICustomSocial>({
  platform: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const DynamicSocialSchema = new Schema<IDynamicSocialLink>({
  id: { type: String, required: true },
  platform: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const SocialLinksSchema = new Schema<ISocialLinks>({
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  leetcode: { type: String, default: '' },
  codeforces: { type: String, default: '' },
  website: { type: String, default: '' },
  customSocials: { type: [CustomSocialSchema], default: [] },
  dynamicLinks: { type: [DynamicSocialSchema], default: [] },
}, { _id: false });

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  techStack: { type: [String], default: [] },
}, { _id: false });

const CertificationSchema = new Schema<ICertification>({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, default: '' },
  link: { type: String, default: '' },
}, { _id: false });

const TestimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  text: { type: String, required: true },
  avatar: { type: String, default: '' },
}, { _id: false });

const AboutMetricSchema = new Schema<IAboutMetric>({
  label: { type: String, required: true },
  value: { type: String, required: true },
  sublabel: { type: String, default: '' },
}, { _id: false });

const MarqueeItemSchema = new Schema<{ label: string }>({
  label: { type: String, required: true },
}, { _id: false });

const OrbitNodeSchema = new Schema<{ name: string; desc: string }>({
  name: { type: String, required: true },
  desc: { type: String, default: '' },
}, { _id: false });

const ThemeSettingsSchema = new Schema<IThemeSettings>({
  accentColor: { type: String, default: '#f97316' },
  mode: { type: String, enum: ['light', 'dark'], default: 'dark' },
  layout: { type: String, enum: ['minimal', 'glass'], default: 'glass' },
  backgroundStyle: {
    type: String,
    enum: ['solid', 'gradient', 'mesh', 'grid', 'particles'],
    default: 'grid',
  },
  borderStyle: {
    type: String,
    enum: ['subtle', 'glow', 'neon', 'glass', 'sharp'],
    default: 'subtle',
  },
  textAnimation: {
    type: String,
    enum: ['none', 'typewriter', 'fade-slide', 'glitch'],
    default: 'typewriter',
  },
  fontFamily: {
    type: String,
    enum: ['inter', 'fira', 'jakarta', 'space'],
    default: 'inter',
  },
}, { _id: false });

export const DEFAULT_ENABLED_COMPONENTS = [
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
];

export const PortfolioSchema: Schema = new Schema<IPortfolio>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  headline: { type: String, default: '' },
  bio: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  location: { type: String, default: 'Available for remote roles & contracts' },
  resumeUrl: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  heroTitle: { type: String, default: 'Engineering digital flare into products.' },
  heroHighlightWord: { type: String, default: 'digital flare' },
  heroSubtitle: { type: String, default: '' },
  statusText: { type: String, default: 'ready for hire' },
  typewriterPhrases: {
    type: [String],
    default: [
      'machine learning models.',
      'competitive algorithms.',
      'C# & Python apps.',
      'user-focused high-impact solutions.',
    ],
  },
  aboutTitle: { type: String, default: 'Bridging technical rigor with human-centric interfaces.' },
  aboutSubtitle: { type: String, default: 'System Overview' },
  aboutMetrics: {
    type: [AboutMetricSchema],
    default: [
      { label: 'Positions', value: '3+', sublabel: 'Roles / Fellowships' },
      { label: 'Projects', value: '10+', sublabel: 'Featured Projects' },
      { label: 'Tech Tools', value: '8+', sublabel: 'Languages & Frameworks' },
    ],
  },
  marqueeItems: {
    type: [MarqueeItemSchema],
    default: [
      { label: 'PyTorch / ML' },
      { label: 'Codeforces Algorithms' },
      { label: 'TypeScript / React 19' },
      { label: 'MongoDB / Mongoose' },
      { label: 'Unity & C#' },
      { label: 'Linux & Docker' },
      { label: 'Tailwind CSS' },
      { label: 'Git & Version Control' },
      { label: 'RESTful Architecture' },
    ],
  },
  orbitNodes: {
    type: [OrbitNodeSchema],
    default: [
      { name: 'Python', desc: 'Machine learning pipelines & PyTorch models' },
      { name: 'C# / .NET', desc: 'Object-oriented architecture & Unity systems' },
      { name: 'JavaScript', desc: 'Full-stack reactive web applications' },
      { name: 'C++', desc: 'High-performance algorithms & data structures' },
      { name: 'Unity', desc: 'Interactive 3D simulations & shaders' },
      { name: 'MySQL', desc: 'Relational data modeling & query optimizations' },
      { name: 'Git & GitHub', desc: 'Collaborative version control & CI/CD' },
      { name: 'Blender 3D', desc: 'Geometric meshes & procedural modeling' },
    ],
  },
  skillsTitle: { type: String, default: 'Skills & Technical Stack' },
  skillsSubtitle: { type: String, default: 'Demonstrated competencies across programming languages, backend systems, and modern tools.' },
  skills: { type: [SkillSchema], default: [] },
  experienceTitle: { type: String, default: 'Work Experience & History' },
  experienceSubtitle: { type: String, default: 'Chronological trajectory of technical fellowships, academic rigor, and production contributions.' },
  workExperience: { type: [WorkExperienceSchema], default: [] },
  socialLinks: { type: SocialLinksSchema, default: () => ({}) },
  projectsTitle: { type: String, default: 'Featured Engineering Projects' },
  projectsSubtitle: { type: String, default: 'Interactive simulations, AI architectures, and algorithmic systems built with modern engineering.' },
  projects: { type: [ProjectSchema], default: [] },
  certifications: { type: [CertificationSchema], default: [] },
  testimonials: { type: [TestimonialSchema], default: [] },
  contactTitle: { type: String, default: "Let's Work Together" },
  contactSubtitle: { type: String, default: 'Have a project inquiry or software opportunity? Send a message directly.' },
  enabledComponents: { type: [String], default: DEFAULT_ENABLED_COMPONENTS },
  themeSettings: {
    type: ThemeSettingsSchema,
    default: () => ({
      accentColor: '#f97316',
      mode: 'dark',
      layout: 'glass',
      backgroundStyle: 'grid',
      borderStyle: 'subtle',
      textAnimation: 'typewriter',
      fontFamily: 'inter',
    }),
  },
});

export const PortfolioModel = mongoose.models.Portfolio || mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
