import bcrypt from 'bcryptjs';
import { Repository } from './repository.ts';

export async function seedDatabase() {
  try {
    const existing = await Repository.findUserByUsername('laith_hh');
    if (existing) {
      // Ensure existing portfolio has the latest modular components & certifications
      const existingPort = await Repository.findPortfolioByUserId(existing._id.toString());
      if (existingPort) {
        await Repository.updatePortfolioByUserId(existing._id.toString(), {
          heroTitle: existingPort.heroTitle || 'Engineering digital flare into products.',
          heroHighlightWord: existingPort.heroHighlightWord || 'digital flare',
          heroSubtitle: existingPort.heroSubtitle || "Hi, I'm Laith Haj Hosin. An IT Engineering student specializing in Machine Learning, crafting:",
          statusText: existingPort.statusText || 'ready for hire',
          typewriterPhrases: existingPort.typewriterPhrases?.length ? existingPort.typewriterPhrases : [
            'machine learning models.',
            'competitive algorithms.',
            'C# & Python apps.',
            'user-focused high-impact solutions.',
          ],
          aboutTitle: existingPort.aboutTitle || 'Bridging technical rigor with human-centric interfaces.',
          aboutSubtitle: existingPort.aboutSubtitle || 'System Overview',
          aboutMetrics: existingPort.aboutMetrics?.length ? existingPort.aboutMetrics : [
            { label: 'Positions', value: '3+', sublabel: 'Roles / Fellowships' },
            { label: 'Projects', value: '10+', sublabel: 'Featured Projects' },
            { label: 'Tech Tools', value: '8+', sublabel: 'Languages & Frameworks' },
          ],
          marqueeItems: existingPort.marqueeItems?.length ? existingPort.marqueeItems : [
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
          orbitNodes: existingPort.orbitNodes?.length ? existingPort.orbitNodes : [
            { name: 'Python', desc: 'Machine learning pipelines & PyTorch models' },
            { name: 'C# / .NET', desc: 'Object-oriented architecture & Unity systems' },
            { name: 'JavaScript', desc: 'Full-stack reactive web applications' },
            { name: 'C++', desc: 'High-performance algorithms & data structures' },
            { name: 'Unity', desc: 'Interactive 3D simulations & shaders' },
            { name: 'MySQL', desc: 'Relational data modeling & query optimizations' },
            { name: 'Git & GitHub', desc: 'Collaborative version control & CI/CD' },
            { name: 'Blender 3D', desc: 'Geometric meshes & procedural modeling' },
          ],
          enabledComponents: existingPort.enabledComponents?.length ? existingPort.enabledComponents : [
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
          ],
          socialLinks: {
            ...existingPort.socialLinks,
            customSocials: existingPort.socialLinks?.customSocials || [
              { platform: 'Discord', url: 'https://discord.com/users/laith' },
              { platform: 'YouTube', url: 'https://youtube.com/@laith' },
            ],
          },
          certifications: existingPort.certifications?.length ? existingPort.certifications : [
            {
              title: 'Machine Learning Specialization',
              issuer: 'DeepLearning.AI / Coursera',
              date: '2023',
              link: 'https://coursera.org',
            },
            {
              title: 'Competitive Programming Masterclass',
              issuer: 'Codeforces Academy',
              date: '2024',
              link: 'https://codeforces.com',
            },
          ],
          testimonials: existingPort.testimonials?.length ? existingPort.testimonials : [
            {
              name: 'Dr. Alex Rivera',
              role: 'AI Research Lead',
              company: 'Bytes 4 Future',
              text: 'Laith combines rigorous theoretical understanding of neural networks with exceptional implementation speed and clean architectural design.',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
            },
            {
              name: 'Elena Rostova',
              role: 'Senior Systems Engineer',
              company: 'TechForge',
              text: 'A dedicated problem solver who excels under competitive time limits and writes pristine, robust full-stack code.',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
            },
          ],
          themeSettings: {
            accentColor: '#f97316',
            mode: 'dark',
            layout: 'glass',
            backgroundStyle: 'grid',
            borderStyle: 'glow',
            textAnimation: 'typewriter',
            fontFamily: 'inter',
            ...(existingPort.themeSettings || {}),
          },
        });
      }
      return;
    }

    console.log('Seeding demo user and portfolio (laith_hh)...');
    const passwordHash = await bcrypt.hash('password123', 10);

    const user = await Repository.createUser({
      username: 'laith_hh',
      email: 'laithhajhosin03@gmail.com',
      passwordHash,
    });

    const userId = user._id ? user._id.toString() : user.id;

    await Repository.createPortfolio({
      userId,
      headline: 'IT Engineer & ML Specialist',
      bio: 'IT Engineering student specializing in Machine Learning, building intelligent models, competitive algorithms, and user-focused digital solutions.',
      phoneNumber: '(+963) 935972100',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      skills: [
        { name: 'Python (ML)', category: 'Programming', proficiency: 92 },
        { name: 'C# / C++', category: 'Programming', proficiency: 90 },
        { name: 'JavaScript / TypeScript', category: 'Programming', proficiency: 85 },
        { name: 'Laravel / PHP', category: 'Web & Databases', proficiency: 85 },
        { name: 'HTML5 / CSS3 / Tailwind', category: 'Web & Databases', proficiency: 95 },
        { name: 'MySQL & MongoDB', category: 'Web & Databases', proficiency: 82 },
        { name: 'Git & GitHub', category: 'Tools & Design', proficiency: 90 },
        { name: 'Figma UI/UX', category: 'Tools & Design', proficiency: 80 },
        { name: 'Unity & Blender', category: 'Tools & Design', proficiency: 75 },
      ],
      workExperience: [
        {
          company: 'Bytes 4 Future',
          role: 'Software Development & Emerging Tech Fellow',
          startDate: '2024-01-15',
          endDate: null,
          current: true,
          description: 'Advancing skills in software development and emerging technologies. Collaborating on real-world machine learning systems and production grade web platforms.',
        },
        {
          company: 'Syrian Virtual University',
          role: 'Bachelor of IT Engineering',
          startDate: '2021-09-01',
          endDate: null,
          current: true,
          description: 'Specializing in Machine Learning and Software Systems. Strong coursework in discrete algorithms, system architecture, neural networks, and computer graphics.',
        },
        {
          company: 'Jeralty Tech Solutions',
          role: 'Junior Systems & Operations Associate',
          startDate: '2021-07-01',
          endDate: '2022-07-31',
          current: false,
          description: 'Handled customer operations, inventory systems, automated payment processing workflows, and assisted in technical support.',
        },
      ],
      socialLinks: {
        github: 'https://github.com/LaithHajHosin',
        linkedin: 'https://www.linkedin.com/in/laith-haj-hosin-35b508258',
        codeforces: 'https://codeforces.com/profile/Distortionator',
        leetcode: 'https://leetcode.com',
        twitter: 'https://twitter.com',
        facebook: '',
        instagram: '',
        website: 'https://laithhajhosin.github.io/Portfolio-Website/',
      },
      projects: [
        {
          title: 'Stickorator — AI Studio',
          description: 'An AI-powered creative studio turning ideas into custom stickers and character art. Built end-to-end with an ML generation pipeline and real-time reactive web UI.',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          liveUrl: 'https://stickorator.ai.studio',
          githubUrl: 'https://github.com/LaithHajHosin',
          techStack: ['Python', 'AI/ML', 'JavaScript', 'Generative Art', 'Full-Stack'],
        },
        {
          title: 'Competitive Algorithm Engine',
          description: 'High-performance algorithmic benchmark suites solving graph theoretical problems, dynamic programming optimizations, and custom data structures.',
          image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
          liveUrl: 'https://codeforces.com/profile/Distortionator',
          githubUrl: 'https://github.com/LaithHajHosin',
          techStack: ['C++', 'Algorithms', 'Data Structures', 'Competitive Programming'],
        },
        {
          title: 'Interactive 3D Simulation Arena',
          description: 'Physics-based interactive simulation exploring particle dynamics, 3D meshes rendered with custom shaders, and interactive camera controllers.',
          image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
          liveUrl: 'https://github.com/LaithHajHosin',
          githubUrl: 'https://github.com/LaithHajHosin',
          techStack: ['Unity', 'C#', 'Blender', '3D Graphics', 'WebGL'],
        },
      ],
      certifications: [
        {
          title: 'Machine Learning Specialization',
          issuer: 'DeepLearning.AI / Coursera',
          date: '2023',
          link: 'https://coursera.org',
        },
        {
          title: 'Competitive Programming Masterclass',
          issuer: 'Codeforces Academy',
          date: '2024',
          link: 'https://codeforces.com',
        },
      ],
      testimonials: [
        {
          name: 'Dr. Alex Rivera',
          role: 'AI Research Lead',
          company: 'Bytes 4 Future',
          text: 'Laith combines rigorous theoretical understanding of neural networks with exceptional implementation speed and clean architectural design.',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        },
        {
          name: 'Elena Rostova',
          role: 'Senior Systems Engineer',
          company: 'TechForge',
          text: 'A dedicated problem solver who excels under competitive time limits and writes pristine, robust full-stack code.',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        },
      ],
      enabledComponents: [
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
      themeSettings: {
        accentColor: '#f97316',
        mode: 'dark',
        layout: 'glass',
        backgroundStyle: 'grid',
        borderStyle: 'glow',
        textAnimation: 'typewriter',
        fontFamily: 'inter',
      },
    });

    console.log('Seeded demo user successfully with modular components!');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}
