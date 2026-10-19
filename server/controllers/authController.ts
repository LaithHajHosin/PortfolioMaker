import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Repository } from '../db/repository.ts';
import { registerSchema, loginSchema } from '../validators/authValidator.ts';
import { AuthenticatedRequest } from '../middleware/authMiddleware.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production_123!';

export const AuthController = {
  async register(req: Request, res: Response): Promise<void> {
    const validatedData = registerSchema.parse(req.body);
    const { username, email, password } = validatedData;

    // Check unique username
    const existingUsername = await Repository.findUserByUsername(username);
    if (existingUsername) {
      res.status(400).json({
        success: false,
        message: 'Username is already taken. Please choose another.',
      });
      return;
    }

    // Check unique email
    const existingEmail = await Repository.findUserByEmail(email);
    if (existingEmail) {
      res.status(400).json({
        success: false,
        message: 'Email is already registered. Please sign in.',
      });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user
    const newUser = await Repository.createUser({
      username,
      email,
      passwordHash,
    });

    const userId = newUser._id ? newUser._id.toString() : newUser.id;

    // Create default empty portfolio
    const defaultPortfolio = await Repository.createPortfolio({
      userId,
      headline: 'Software Engineer',
      bio: '',
      phoneNumber: '',
      profileImage: '',
      skills: [],
      workExperience: [],
      socialLinks: {
        github: '',
        linkedin: '',
        twitter: '',
        facebook: '',
        instagram: '',
        leetcode: '',
        codeforces: '',
        website: '',
      },
      projects: [],
      themeSettings: {
        accentColor: '#f97316',
        mode: 'dark',
        layout: 'glass',
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        token,
        user: {
          _id: userId,
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
        portfolio: defaultPortfolio,
      },
    });
  },

  async login(req: Request, res: Response): Promise<void> {
    const validatedData = loginSchema.parse(req.body);
    const { login, password } = validatedData;

    const cleanLogin = login.toLowerCase().trim();

    // Find by username or email
    let user = await Repository.findUserByUsername(cleanLogin);
    if (!user) {
      user = await Repository.findUserByEmail(cleanLogin);
    }

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
      return;
    }

    const userId = user._id ? user._id.toString() : user.id;

    // Get or create user portfolio
    let portfolio = await Repository.findPortfolioByUserId(userId);
    if (!portfolio) {
      portfolio = await Repository.createPortfolio({
        userId,
        headline: 'Software Engineer',
        bio: '',
        phoneNumber: '',
        profileImage: '',
        skills: [],
        workExperience: [],
        socialLinks: {},
        projects: [],
        themeSettings: { accentColor: '#f97316', mode: 'dark', layout: 'glass' },
      });
    }

    const token = jwt.sign(
      { userId, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      data: {
        token,
        user: {
          _id: userId,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
        portfolio,
      },
    });
  },

  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const user = await Repository.findUserById(req.user._id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User record not found.',
      });
      return;
    }

    let portfolio = await Repository.findPortfolioByUserId(req.user._id);
    if (!portfolio) {
      portfolio = await Repository.createPortfolio({
        userId: req.user._id,
        headline: 'Software Engineer',
        bio: '',
        phoneNumber: '',
        profileImage: '',
        skills: [],
        workExperience: [],
        socialLinks: {},
        projects: [],
        themeSettings: { accentColor: '#f97316', mode: 'dark', layout: 'glass' },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
        portfolio,
      },
    });
  },

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required to update profile.',
      });
      return;
    }

    const { email, username } = req.body;
    const currentUserId = req.user._id;

    // Check email uniqueness if changing
    if (email && email.toLowerCase().trim() !== req.user.email.toLowerCase()) {
      const cleanEmail = email.toLowerCase().trim();
      const existingUser = await Repository.findUserByEmail(cleanEmail);
      if (existingUser && (existingUser._id?.toString() !== currentUserId && existingUser.id !== currentUserId)) {
        res.status(400).json({
          success: false,
          message: 'This email address is already in use by another account.',
        });
        return;
      }
    }

    // Check username uniqueness if changing
    if (username && username.toLowerCase().trim() !== req.user.username.toLowerCase()) {
      const cleanUsername = username.toLowerCase().trim();
      const existingUser = await Repository.findUserByUsername(cleanUsername);
      if (existingUser && (existingUser._id?.toString() !== currentUserId && existingUser.id !== currentUserId)) {
        res.status(400).json({
          success: false,
          message: 'This username is already taken. Please choose another.',
        });
        return;
      }
    }

    const updatedUser = await Repository.updateUser(currentUserId, {
      email,
      username,
    });

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found.',
      });
      return;
    }

    // Generate fresh JWT token with updated credentials
    const token = jwt.sign(
      { 
        userId: currentUserId, 
        username: updatedUser.username, 
        email: updatedUser.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Profile account details updated successfully!',
      data: {
        token,
        user: {
          _id: currentUserId,
          username: updatedUser.username,
          email: updatedUser.email,
          createdAt: updatedUser.createdAt,
        },
      },
    });
  },
};
