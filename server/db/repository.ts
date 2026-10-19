import { UserModel } from './models/User.ts';
import { PortfolioModel } from './models/Portfolio.ts';
import { isConnectedToMongo, readLocalDB, writeLocalDB } from './connection.ts';
import { Types } from 'mongoose';

function generateId(): string {
  return new Types.ObjectId().toHexString();
}

export const Repository = {
  async findUserByUsername(username: string) {
    const cleanUsername = username.toLowerCase().trim();
    if (isConnectedToMongo()) {
      return await UserModel.findOne({ username: cleanUsername });
    }
    const db = readLocalDB();
    const user = db.users.find(u => u.username.toLowerCase() === cleanUsername);
    return user ? { ...user } : null;
  },

  async findUserByEmail(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    if (isConnectedToMongo()) {
      return await UserModel.findOne({ email: cleanEmail });
    }
    const db = readLocalDB();
    const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
    return user ? { ...user } : null;
  },

  async findUserById(id: string) {
    if (isConnectedToMongo()) {
      return await UserModel.findById(id);
    }
    const db = readLocalDB();
    const user = db.users.find(u => u._id === id);
    return user ? { ...user } : null;
  },

  async createUser(userData: { username: string; email: string; passwordHash: string }) {
    const username = userData.username.toLowerCase().trim();
    const email = userData.email.toLowerCase().trim();

    if (isConnectedToMongo()) {
      const newUser = new UserModel({
        username,
        email,
        passwordHash: userData.passwordHash,
      });
      return await newUser.save();
    }

    const db = readLocalDB();
    const newUser = {
      _id: generateId(),
      username,
      email,
      passwordHash: userData.passwordHash,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    writeLocalDB(db);
    return newUser;
  },

  async updateUser(userId: string, updateData: { email?: string; username?: string }) {
    const cleanData: { email?: string; username?: string } = {};
    if (updateData.email) cleanData.email = updateData.email.toLowerCase().trim();
    if (updateData.username) cleanData.username = updateData.username.toLowerCase().trim();

    if (isConnectedToMongo()) {
      return await UserModel.findByIdAndUpdate(
        userId,
        { $set: cleanData },
        { new: true, runValidators: true }
      );
    }

    const db = readLocalDB();
    const index = db.users.findIndex(u => u._id === userId);
    if (index !== -1) {
      db.users[index] = {
        ...db.users[index],
        ...cleanData,
      };
      writeLocalDB(db);
      return db.users[index];
    }
    return null;
  },

  async findPortfolioByUserId(userId: string) {
    if (isConnectedToMongo()) {
      return await PortfolioModel.findOne({ userId });
    }
    const db = readLocalDB();
    const portfolio = db.portfolios.find(p => p.userId === userId);
    return portfolio ? { ...portfolio } : null;
  },

  async createPortfolio(portfolioData: any) {
    if (isConnectedToMongo()) {
      const newPortfolio = new PortfolioModel(portfolioData);
      return await newPortfolio.save();
    }

    const db = readLocalDB();
    const newPortfolio = {
      _id: generateId(),
      ...portfolioData,
      skills: portfolioData.skills || [],
      workExperience: portfolioData.workExperience || [],
      socialLinks: portfolioData.socialLinks || {},
      projects: portfolioData.projects || [],
      certifications: portfolioData.certifications || [],
      testimonials: portfolioData.testimonials || [],
      enabledComponents: portfolioData.enabledComponents || [
        'hero',
        'about',
        'skills',
        'experience',
        'projects',
        'github-stats',
        'certifications',
        'testimonials',
        'interactive-canvas',
        'contact',
      ],
      themeSettings: portfolioData.themeSettings || {
        accentColor: '#f97316',
        mode: 'dark',
        layout: 'glass',
        backgroundStyle: 'grid',
        borderStyle: 'subtle',
        textAnimation: 'typewriter',
        fontFamily: 'inter',
      },
    };
    db.portfolios.push(newPortfolio);
    writeLocalDB(db);
    return newPortfolio;
  },

  async updatePortfolioByUserId(userId: string, updateData: any) {
    if (isConnectedToMongo()) {
      return await PortfolioModel.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }

    const db = readLocalDB();
    const index = db.portfolios.findIndex(p => p.userId === userId);
    if (index === -1) {
      // Create if not exists
      const newPortfolio = {
        _id: generateId(),
        userId,
        ...updateData,
      };
      db.portfolios.push(newPortfolio);
      writeLocalDB(db);
      return newPortfolio;
    }

    db.portfolios[index] = {
      ...db.portfolios[index],
      ...updateData,
      themeSettings: {
        ...db.portfolios[index].themeSettings,
        ...(updateData.themeSettings || {}),
      },
      socialLinks: updateData.socialLinks !== undefined 
        ? updateData.socialLinks 
        : (db.portfolios[index].socialLinks || {}),
      certifications: updateData.certifications !== undefined 
        ? updateData.certifications 
        : db.portfolios[index].certifications || [],
      testimonials: updateData.testimonials !== undefined 
        ? updateData.testimonials 
        : db.portfolios[index].testimonials || [],
      enabledComponents: updateData.enabledComponents !== undefined 
        ? updateData.enabledComponents 
        : db.portfolios[index].enabledComponents || [],
    };
    writeLocalDB(db);
    return db.portfolios[index];
  },

  async getPublicPortfolioByUsername(username: string) {
    const user = await this.findUserByUsername(username);
    if (!user) return null;

    const portfolio = await this.findPortfolioByUserId(user._id.toString());
    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      portfolio: portfolio || {
        userId: user._id,
        headline: '',
        bio: '',
        phoneNumber: '',
        profileImage: '',
        skills: [],
        workExperience: [],
        socialLinks: {},
        projects: [],
        themeSettings: { accentColor: '#f97316', mode: 'dark', layout: 'glass' },
      },
    };
  },
};
