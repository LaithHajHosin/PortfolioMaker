import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Interface for local json store
export interface LocalDB {
  users: Array<{
    _id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: string;
  }>;
  portfolios: Array<{
    _id: string;
    userId: string;
    headline: string;
    bio: string;
    phoneNumber: string;
    location?: string;
    resumeUrl?: string;
    profileImage?: string;
    heroTitle?: string;
    heroHighlightWord?: string;
    heroSubtitle?: string;
    statusText?: string;
    typewriterPhrases?: string[];
    aboutTitle?: string;
    aboutSubtitle?: string;
    aboutMetrics?: Array<{ label: string; value: string; sublabel?: string }>;
    marqueeItems?: Array<{ label: string }>;
    orbitNodes?: Array<{ name: string; desc: string }>;
    skillsTitle?: string;
    skillsSubtitle?: string;
    skills: Array<{ name: string; category: string; proficiency: number }>;
    experienceTitle?: string;
    experienceSubtitle?: string;
    workExperience: Array<{
      company: string;
      role: string;
      startDate: string;
      endDate?: string | null;
      current: boolean;
      description: string;
    }>;
    socialLinks: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
      leetcode?: string;
      codeforces?: string;
      website?: string;
      customSocials?: Array<{ platform: string; url: string }>;
      dynamicLinks?: Array<{ id: string; platform: string; url: string }>;
    };
    projectsTitle?: string;
    projectsSubtitle?: string;
    projects: Array<{
      title: string;
      description: string;
      image?: string;
      liveUrl?: string;
      githubUrl?: string;
      techStack: string[];
    }>;
    certifications?: Array<{
      title: string;
      issuer: string;
      date: string;
      link?: string;
    }>;
    testimonials?: Array<{
      name: string;
      role: string;
      company: string;
      text: string;
      avatar?: string;
    }>;
    contactTitle?: string;
    contactSubtitle?: string;
    enabledComponents?: string[];
    themeSettings: {
      accentColor: string;
      mode: 'light' | 'dark';
      layout: 'minimal' | 'glass';
      backgroundStyle?: 'solid' | 'gradient' | 'mesh' | 'grid' | 'particles';
      borderStyle?: 'subtle' | 'glow' | 'neon' | 'glass' | 'sharp';
      textAnimation?: 'none' | 'typewriter' | 'fade-slide' | 'glitch';
      fontFamily?: 'inter' | 'fira' | 'jakarta' | 'space';
    };
  }>;
}

let isMongooseConnected = false;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readLocalDB(): LocalDB {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    const initial: LocalDB = { users: [], portfolios: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local DB, resetting:', err);
    const initial: LocalDB = { users: [], portfolios: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

export function writeLocalDB(data: LocalDB): void {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri && !mongoUri.includes('localhost:27017')) {
    try {
      console.log('Attempting MongoDB connection via Mongoose...');
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      isMongooseConnected = true;
      console.log('MongoDB connected successfully via Mongoose.');
      return;
    } catch (err) {
      console.warn('MongoDB connection failed, falling back to local persistent file store:', (err as Error).message);
    }
  } else {
    // If local default or not set, test brief connection
    if (mongoUri) {
      try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 1500 });
        isMongooseConnected = true;
        console.log('Local MongoDB connected via Mongoose.');
        return;
      } catch {
        // Fall back gracefully
      }
    }
  }

  isMongooseConnected = false;
  console.log('Operating in high-fidelity local persistent store mode.');
  ensureDataDir();
}

export function isConnectedToMongo(): boolean {
  return isMongooseConnected && mongoose.connection.readyState === 1;
}
