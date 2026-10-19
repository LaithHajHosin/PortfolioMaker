import { z } from 'zod';

export const skillSchema = z.object({
  name: z.string().trim().default('Skill'),
  category: z.string().trim().default('General'),
  proficiency: z.coerce.number().min(0).max(100).default(80),
}).passthrough();

export const workExperienceSchema = z.object({
  company: z.string().trim().default('Company'),
  role: z.string().trim().default('Role'),
  startDate: z.string().or(z.date()).default('2024'),
  endDate: z.string().or(z.date()).nullable().optional().default(null),
  current: z.boolean().default(false),
  description: z.string().default(''),
}).passthrough();

export const customSocialSchema = z.object({
  platform: z.string().trim().default('Website'),
  url: z.string().trim().default(''),
}).passthrough();

export const dynamicSocialSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  platform: z.string().trim().default('Platform'),
  url: z.string().trim().default(''),
}).passthrough();

export const socialLinksSchema = z.object({
  github: z.string().default(''),
  linkedin: z.string().default(''),
  twitter: z.string().default(''),
  facebook: z.string().default(''),
  instagram: z.string().default(''),
  leetcode: z.string().default(''),
  codeforces: z.string().default(''),
  website: z.string().default(''),
  customSocials: z.array(customSocialSchema).default([]),
  dynamicLinks: z.array(dynamicSocialSchema).default([]),
}).partial().passthrough();

export const projectSchema = z.object({
  title: z.string().trim().default('Project Title'),
  description: z.string().default(''),
  image: z.string().default(''),
  liveUrl: z.string().default(''),
  githubUrl: z.string().default(''),
  techStack: z.array(z.string()).default([]),
}).passthrough();

export const certificationSchema = z.object({
  title: z.string().trim().default('Certification'),
  issuer: z.string().trim().default('Issuer'),
  date: z.string().default(''),
  link: z.string().default(''),
}).passthrough();

export const testimonialSchema = z.object({
  name: z.string().trim().default('Name'),
  role: z.string().default(''),
  company: z.string().default(''),
  text: z.string().default('Testimonial note'),
  avatar: z.string().default(''),
}).passthrough();

export const aboutMetricSchema = z.object({
  label: z.string().default(''),
  value: z.string().default(''),
  sublabel: z.string().default(''),
}).passthrough();

export const marqueeItemSchema = z.object({
  label: z.string().default(''),
}).passthrough();

export const orbitNodeSchema = z.object({
  name: z.string().default(''),
  desc: z.string().default(''),
}).passthrough();

export const themeSettingsSchema = z.object({
  accentColor: z.string().default('#f97316'),
  mode: z.string().default('dark'),
  layout: z.string().default('glass'),
  backgroundStyle: z.string().default('grid'),
  borderStyle: z.string().default('subtle'),
  textAnimation: z.string().default('typewriter'),
  fontFamily: z.string().default('inter'),
}).partial().passthrough();

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

export const updatePortfolioSchema = z.object({
  headline: z.string().optional(),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  resumeUrl: z.string().optional(),
  profileImage: z.string().optional(),
  heroTitle: z.string().optional(),
  heroHighlightWord: z.string().optional(),
  heroSubtitle: z.string().optional(),
  statusText: z.string().optional(),
  typewriterPhrases: z.array(z.string()).optional(),
  aboutTitle: z.string().optional(),
  aboutSubtitle: z.string().optional(),
  aboutMetrics: z.array(aboutMetricSchema).optional(),
  marqueeItems: z.array(marqueeItemSchema).optional(),
  orbitNodes: z.array(orbitNodeSchema).optional(),
  skillsTitle: z.string().optional(),
  skillsSubtitle: z.string().optional(),
  skills: z.array(skillSchema).optional(),
  experienceTitle: z.string().optional(),
  experienceSubtitle: z.string().optional(),
  workExperience: z.array(workExperienceSchema).optional(),
  socialLinks: socialLinksSchema.optional(),
  projectsTitle: z.string().optional(),
  projectsSubtitle: z.string().optional(),
  projects: z.array(projectSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  testimonials: z.array(testimonialSchema).optional(),
  contactTitle: z.string().optional(),
  contactSubtitle: z.string().optional(),
  enabledComponents: z.array(z.string()).optional(),
  themeSettings: themeSettingsSchema.optional(),
}).passthrough();

export type UpdatePortfolioInput = z.infer<typeof updatePortfolioSchema>;
