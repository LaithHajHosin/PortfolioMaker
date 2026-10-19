# FlarePort — Full-Stack Developer Portfolio Builder

FlarePort is a production-grade full-stack web application designed for software engineers, ML specialists, and competitive programmers to build, customize, and publish high-impact personal portfolios.

---

## 📑 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Project File Tree](#project-file-tree)
3. [Strict Data Models & Schemas](#strict-data-models--schemas)
4. [Modular Component System & Advanced Theme Engine](#modular-component-system--advanced-theme-engine)
5. [API Endpoints & Specifications](#api-endpoints--specifications)
6. [Security, Validation & Middlewares](#security-validation--middlewares)
7. [Frontend Architecture & Visual Builder](#frontend-architecture--visual-builder)
8. [Containerization & Docker Setup](#containerization--docker-setup)
9. [Environment & Installation](#environment--installation)
10. [Demo Credentials & Quick Start](#demo-credentials--quick-start)
11. [Changelog & Implementation Log](#changelog--implementation-log)

---

## 1. Architecture Overview

```
+--------------------------------------------------------------------------+
|                               Client (Browser)                           |
|  React 19 SPA + Vite + Tailwind CSS + Lucide Icons + Split-View Builder  |
+--------------------------------------------------------------------------+
                                    |
                        HTTP / REST (JSON + Multer)
                                    |
+--------------------------------------------------------------------------+
|                              Express.js Backend                          |
|  Helmet (Security) + CORS + Zod Validators + JWT Auth Middleware        |
+--------------------------------------------------------------------------+
                                    |
          +-------------------------+-------------------------+
          |                                                   |
+----------------------+                            +----------------------+
| MongoDB / Mongoose   |                            | Local Resilient JSON |
| (When URI configured)|                            | Store (Auto-fallback)|
+----------------------+                            +----------------------+
```

* **Backend Engine:** Node.js (v18+) with Express.js REST API.
* **Database & ODM:** MongoDB with Mongoose (with dual-mode resilience: connects to MongoDB when available or seamlessly uses a persistent ACID JSON store in `data/database.json`).
* **Authentication:** Stateless JSON Web Tokens (JWT) signed with HMAC-SHA256 and salted password hashing via `bcryptjs`.
* **Request Validation:** Strict Zod validation schemas for all authentication and portfolio modification endpoints.
* **File Uploads:** Multer with local disk storage (`/uploads` static directory), max file size 2MB, restricted to `image/jpeg`, `image/png`, and `image/webp`.
* **Frontend:** React 19 SPA, Tailwind CSS (dynamic accent colors, background textures, border physics, and glassmorphism), and `lucide-react` icons.

---

## 2. Project File Tree

```
├── .env.example                       # Environment variable templates (PORT, MONGO_URI, JWT_SECRET)
├── .gitignore                         # Git exclusion rules
├── Dockerfile                         # Production multi-stage Docker build
├── docker-compose.yml                 # One-click Docker Compose combining App & MongoDB
├── index.html                         # HTML entry with Inter, Fira Code, Jakarta & Space fonts
├── metadata.json                      # AI Studio application metadata
├── package.json                       # Scripts, dependencies, and devDependencies
├── server.ts                          # Express server entry point mounting Vite middleware
├── tsconfig.json                      # TypeScript compiler options
├── vite.config.ts                     # Vite + Tailwind Vite plugin configuration
├── README.md                          # Exhaustive project documentation
│
├── uploads/                           # Static folder serving user uploaded images (profile/project)
├── data/
│   └── database.json                  # Local persistent store with auto-seeding
│
├── server/
│   ├── db/
│   │   ├── connection.ts              # MongoDB / Mongoose connection with fallback store
│   │   ├── repository.ts              # Abstracted data access layer
│   │   ├── seed.ts                    # Auto-seeder for demo account (laith_hh)
│   │   └── models/
│   │       ├── User.ts                # Mongoose User model & Schema
│   │       └── Portfolio.ts           # Mongoose Portfolio model & Schema
│   ├── middleware/
│   │   ├── authMiddleware.ts          # Bearer JWT verification & user injection
│   │   ├── uploadMiddleware.ts        # Multer disk upload with 2MB & MIME filtering
│   │   └── errorHandler.ts            # Global error handler with Zod & Multer formatting
│   ├── validators/
│   │   ├── authValidator.ts           # Zod schemas for register and login
│   │   └── portfolioValidator.ts      # Zod schemas for portfolio data updates
│   ├── controllers/
│   │   ├── authController.ts          # Handlers for register, login, and me
│   │   ├── portfolioController.ts     # Handlers for getByUsername and updatePortfolio
│   │   └── uploadController.ts        # Handler for multipart image uploads
│   └── routes/
│       ├── authRoutes.ts              # Routes for /api/auth/*
│       ├── portfolioRoutes.ts         # Routes for /api/portfolio/*
│       └── uploadRoutes.ts            # Routes for /api/upload/*
│
└── src/
    ├── main.tsx                       # React DOM root entry
    ├── App.tsx                        # Client router, theme sync, toast dispatcher
    ├── index.css                      # Tailwind base, dynamic backgrounds, borders & anims
    ├── types/
    │   └── portfolio.ts               # Complete TypeScript interfaces
    ├── services/
    │   └── api.ts                     # Fetch client with auto JWT attachment
    ├── context/
    │   └── AuthContext.tsx            # Global user, portfolio, token, and auth states
    ├── components/
    │   ├── Navbar.tsx                 # Top navigation with route switcher & auth pill
    │   ├── Footer.tsx                 # Site footer with stack details
    │   ├── Toast.tsx                  # Toast notification container
    │   └── portfolio-blocks/          # Reusable modular components
    │       ├── GithubStatsCard.tsx        # GitHub insights, commit streak, top languages
    │       ├── CertificationsGrid.tsx     # Verified credentials & honors
    │       ├── TestimonialsCarousel.tsx   # Peer endorsements & recommendation quotes
    │       ├── InteractiveCanvasWidget.tsx# Generative HTML5 typography canvas
    │       ├── DonutGalleryWidget.tsx     # Radial technology wheel & node inspect
    │       └── TechMarqueeWidget.tsx      # Infinite horizontal tech stack ticker
    └── pages/
        ├── LandingPage.tsx            # Product overview with live preview window
        ├── AuthPage.tsx               # Login & Register tabs with validation & demo fill
        ├── Dashboard.tsx              # Live visual builder with Split-View & component manager
        └── PortfolioView.tsx          # Public dynamic portfolio view (/:username)
```

---

## 3. Strict Data Models & Schemas

### 3.1 User Model (`User`)
* `_id`: String / ObjectId (Primary key).
* `username`: String, Unique, Required, Lowercase, Trimmed, Min 3 / Max 30 chars.
* `email`: String, Unique, Required, Lowercase, Trimmed, Valid Email format.
* `passwordHash`: String, Required (Bcrypt hash).
* `createdAt`: Date (Auto-generated timestamp).

### 3.2 Portfolio Model (`Portfolio`)
* `userId`: Schema.Types.ObjectId, Ref: 'User', Unique, Required.
* `headline`: String, Default: `""`.
* `bio`: String, Default: `""`.
* `phoneNumber`: String, Default: `""`.
* `profileImage`: String (e.g. `/uploads/profile-123.png`), Default: `""`.
* `skills`: Array of `{ name: string, category: string, proficiency: number (1–100) }`.
* `workExperience`: Array of `{ company: string, role: string, startDate: Date, endDate?: Date | null, current: boolean, description: string }`.
* `socialLinks`: Object containing `github`, `linkedin`, `twitter`, `facebook`, `instagram`, `leetcode`, `codeforces`, `website`.
* `projects`: Array of `{ title: string, description: string, image: string, liveUrl: string, githubUrl: string, techStack: string[] }`.
* `certifications`: Array of `{ title: string, issuer: string, date: string, link?: string }`.
* `testimonials`: Array of `{ name: string, role: string, company: string, text: string, avatar?: string }`.
* `enabledComponents`: Array of strings representing active ordered sections (e.g. `["hero", "tech-marquee", "about", "skills", "donut-orbit", "experience", "projects", "github-stats", "certifications", "testimonials", "interactive-canvas", "contact"]`).
* `themeSettings`: Extended object:
  * `accentColor`: Hex code (Default: `#f97316`). Presets include Flame Orange (`#f97316`), Electric Blue (`#3B82F6`), Neon Emerald (`#10B981`), Cyber Rose (`#F43F5E`), Violet Glow (`#8B5CF6`), Amber Sun (`#F59E0B`).
  * `mode`: Enum (`'light' | 'dark'`, Default: `'dark'`).
  * `layout`: Enum (`'minimal' | 'glass'`, Default: `'glass'`).
  * `backgroundStyle`: Enum (`'solid' | 'gradient' | 'mesh' | 'grid' | 'particles'`, Default: `'grid'`).
  * `borderStyle`: Enum (`'subtle' | 'glow' | 'neon' | 'glass' | 'sharp'`, Default: `'subtle'`).
  * `textAnimation`: Enum (`'none' | 'typewriter' | 'fade-slide' | 'glitch'`, Default: `'typewriter'`).
  * `fontFamily`: Enum (`'inter' | 'fira' | 'jakarta' | 'space'`, Default: `'inter'`).

---

## 4. Modular Component System & Advanced Theme Engine

FlarePort features a modular component engine enabling users to pick, order, and customize blocks on their portfolio:

### 4.1 Modular Component Catalog
1. **Hero Profile Card (`hero`):** Profile picture with gradient ring, professional role, typewriter headline, status badge (`status: online · ready`), and direct action buttons.
2. **Tech Marquee Ticker (`tech-marquee`):** Smooth infinite horizontal scrolling technology ticker.
3. **About & System Overview (`about`):** Detailed narrative with verified numerical milestone counters.
4. **Skills & Proficiencies (`skills`):** Categorized progress bars with animated percentage indicators.
5. **Radial Technology Wheel (`donut-orbit`):** Interactive circular orbit gallery where users hover and tap technology nodes for instant summaries.
6. **Experience Timeline (`experience`):** Chronological career and university milestone cards with glowing timeline nodes.
7. **Projects Showcase (`projects`):** Filterable grid with tags, live demo buttons, and source code links.
8. **GitHub Insights (`github-stats`):** Repositories count, stars, commit streak, language breakdown bar, and synthetic 12-month contribution heatmap.
9. **Certifications & Honors (`certifications`):** Credential badges with issuers and verification URLs.
10. **Endorsements & Praise (`testimonials`):** Carousel cards featuring peer recommendation quotes with avatars.
11. **Generative Canvas Widget (`interactive-canvas`):** HTML5 vector typography canvas with particle vector physics.
12. **Contact & Messaging Form (`contact`):** Direct contact cards and working inquiry form.

### 4.2 Advanced Styling Customization
* **Backgrounds:**
  * `grid`: 32px subtle tech architectural grid.
  * `mesh`: Multi-color radial glowing blobs.
  * `gradient`: Subtle shifting dark animated gradient.
  * `particles`: Deep space particle sparks.
  * `solid`: Matte minimalist background.
* **Border Physics:**
  * `subtle`: Clean 1px translucent border.
  * `glow`: Ambient box-shadow halo matching the chosen accent color.
  * `neon`: High-intensity outer glow ring.
  * `glass`: Heavy blur (`backdrop-filter: blur(20px)`) with refraction bevel.
  * `sharp`: High-contrast geometric rectangle border.
* **Text Animations:**
  * `typewriter`: Blinking terminal cursor cycling through headline specialties.
  * `fade-slide`: Smooth entrance keyframe translation.
  * `glitch`: Subtle chromatic glitch effect.
  * `none`: Solid crisp typography.
* **Typography Pairings:**
  * `inter`: Standard modern tech UI.
  * `fira`: Fira Code developer monospace.
  * `jakarta`: Plus Jakarta Sans contemporary geometric.
  * `space`: Space Grotesk futuristic display.

---

## 5. API Endpoints & Specifications

Standard response structure:
```json
{
  "success": true,
  "message": "Optional descriptive status message",
  "data": {},
  "errors": []
}
```

### 5.1 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Protection | Description | Request Body |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Registers new user & initializes default portfolio | `{ username, email, password }` |
| `POST` | `/api/auth/login` | Public | Authenticates credentials & returns JWT | `{ login, password }` |
| `GET` | `/api/auth/me` | Protected (`Bearer <token>`) | Returns currently signed-in user and portfolio | *None* |

### 5.2 Portfolio Endpoints (`/api/portfolio`)

| Method | Endpoint | Protection | Description | Request Body |
|---|---|---|---|---|
| `GET` | `/api/portfolio/:username` | Public | Retrieves public portfolio & user metadata | *None* |
| `PUT` | `/api/portfolio` | Protected (`Bearer <token>`) | Updates authenticated user's portfolio | Validated portfolio payload |

### 5.3 Media Upload Endpoint (`/api/upload`)

| Method | Endpoint | Protection | Description | Request Format |
|---|---|---|---|---|
| `POST` | `/api/upload` | Protected (`Bearer <token>`) | Saves image to disk, returns URL | `multipart/form-data` with field `file` |

* **Upload Limits:**
  * Maximum size: 2MB (`2,097,152` bytes).
  * Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`.

---

## 6. Security, Validation & Middlewares

1. **Password Security:** Salted hashing via `bcryptjs` (salt rounds: 10).
2. **Token Security:** Stateless JSON Web Tokens signed with `JWT_SECRET` (7 days validity).
3. **HTTP Header Security:** `helmet()` with cross-origin policies for iframe embedding.
4. **CORS:** Configured for credentialed origin requests.
5. **Request Validation:** Zod schemas for payload sanitization with path-specific issue mappings.

---

## 7. Frontend Architecture & Visual Builder

The Dashboard (`src/pages/Dashboard.tsx`) features a real-time reactive layout:
* **View Modes:**
  * **Edit Mode:** Full-width focused editing form.
  * **Split View:** Side-by-side editing on desktop (left: tabbed configuration panels, right: live rendered portfolio updating on every keystroke).
  * **Full Preview:** Full-screen immersive portfolio preview.
* **Component Reorder Engine:** Users can reorder sections up/down and toggle any component on or off with instant UI update.

---

## 8. Containerization & Docker Setup

One-click containerized deployment is available via Docker and Docker Compose:

### Using Docker Compose (Recommended)
```bash
# Start both Node application and MongoDB container
docker compose up -d

# View logs
docker compose logs -f

# Stop containers
docker compose down
```

### Standalone Dockerfile Build
```bash
# Build production image
docker build -t flareport:latest .

# Run container on port 3000
docker run -p 3000:3000 -e JWT_SECRET="your_secret" flareport:latest
```

---

## 9. Environment & Installation

### Environment Variables (`.env`)
```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/portfolio_builder
JWT_SECRET=super_secret_jwt_key_change_in_production_123!
APP_URL=http://localhost:3000
```

### Installation Commands
```bash
# Install dependencies
npm install

# Start development server (Express + Vite middleware on port 3000)
npm run dev

# Build production bundle
npm run build

# Start production server
npm start

# Typecheck and lint
npm run lint
```

---

## 10. Demo Credentials & Quick Start

The database is automatically pre-seeded with a complete portfolio matching the reference landing page:

* **Username:** `laith_hh`
* **Email:** `laithhajhosin03@gmail.com`
* **Password:** `password123`
* **Public Portfolio URL:** `http://localhost:3000/laith_hh`

*(You can also use the one-click button on the Sign In page labeled **"Fill Demo Credentials (laith_hh)"**).*

---

## 11. Changelog & Implementation Log

### Release 1.2 — Live Customization & Modular Component System
* **Schema & Model Updates:**
  * Extended `Portfolio` schema in `server/db/models/Portfolio.ts` and `src/types/portfolio.ts` with `themeSettings` (`backgroundStyle`, `borderStyle`, `textAnimation`, `fontFamily`).
  * Added `enabledComponents` array for vertical component toggling and ordering.
  * Added `certifications` and `testimonials` subdocument schemas.
  * Updated Zod validation schemas in `server/validators/portfolioValidator.ts`.
* **Modular Component Library:**
  * Created `src/components/portfolio-blocks/GithubStatsCard.tsx` (GitHub metrics, stars, streak, top languages).
  * Created `src/components/portfolio-blocks/CertificationsGrid.tsx` (credentials with verification links).
  * Created `src/components/portfolio-blocks/TestimonialsCarousel.tsx` (recommendations with quote carousel).
  * Created `src/components/portfolio-blocks/InteractiveCanvasWidget.tsx` (HTML5 generative typography canvas).
  * Created `src/components/portfolio-blocks/DonutGalleryWidget.tsx` (radial interactive technology wheel).
  * Created `src/components/portfolio-blocks/TechMarqueeWidget.tsx` (infinite horizontal tech stack ticker).
* **Live Visual Builder (Dashboard):**
  * Transformed `src/pages/Dashboard.tsx` with Split-View mode (real-time live reactive preview beside editor tabs).
  * Added dedicated managers for Certifications, Testimonials, Component Reordering, and Advanced Styling.
* **Styling & Animation Engine:**
  * Implemented dynamic backgrounds (`grid`, `mesh`, `gradient`, `particles`, `solid`) in `src/index.css`.
  * Implemented border physics (`subtle`, `glow`, `neon`, `glass`, `sharp`).
  * Implemented text animations (`typewriter`, `fade-slide`, `glitch`) and font classes (`Inter`, `Fira Code`, `Plus Jakarta Sans`, `Space Grotesk`).
* **Containerization:**
  * Added multi-stage `Dockerfile` and `docker-compose.yml` linking Express with MongoDB service.

### Release 1.3 — Universal Editability, Unlimited Dynamic Socials & Component In-Form Configurator
* **Universal Editability of Portfolio Elements:**
  * Made hero primary headline (`heroTitle`, e.g. "Engineering digital flare into products.") fully editable with live accent keyword highlighting (`heroHighlightWord`).
  * Made hero subtitle prefix (`heroSubtitle`), professional status badge (`statusText`), location statement (`location`), and resume/CV download URL (`resumeUrl`) completely editable.
  * Made section headings and sub-headings configurable across all portfolio sections:
    * `skillsTitle` & `skillsSubtitle`
    * `experienceTitle` & `experienceSubtitle`
    * `projectsTitle` & `projectsSubtitle`
    * `contactTitle` & `contactSubtitle`
    * `aboutTitle` & `aboutSubtitle`
  * Added editable arrays for:
    * `skills` (Add / Remove / Edit proficiency & category)
    * `workExperience` (Add / Remove / Edit dates, current flag, role, description)
    * `projects` (Add / Remove / Edit live demo URL, GitHub URL, tech stack, and uploaded thumbnail)
    * `certifications` (Add / Remove / Edit title, issuer, date, credential link)
    * `testimonials` (Add / Remove / Edit name, role, company, recommendation quote)
    * `typewriterPhrases` (Add / Remove / Edit cycling animated phrases)
    * `aboutMetrics` (Add / Remove / Edit numerical badges)
    * `marqueeItems` (Add / Remove / Edit technology ticker chips)
    * `orbitNodes` (Add / Remove / Edit radial gallery nodes & descriptions)
* **Unlimited Dynamic Socials Manager (Eliminating the 6-Slot Limit):**
  * Replaced static 6-slot limit with a flexible dynamic list (`socialList`).
  * Added instant 1-click Quick Add buttons for standard developer & social networks: GitHub, LinkedIn, LeetCode, Codeforces, Twitter / X, Personal Website, Discord, YouTube, Telegram, Instagram.
  * Added preset dropdown and custom platform text field (`Other / Custom`) so users can add any conceivable platform or handle.
  * Added Delete button to remove any social slot with a single click.
  * Added Up and Down reordering arrows for each social link to control order of appearance in the header and footer.
* **Component-Level Inline Editing Form & Order Position Control:**
  * Clicking any component card in the "Components" tab opens an interactive section configurator at the bottom of the tab.
  * Features a direct **Position Selector Dropdown** (`Position #X of Y`) allowing users to instantly jump a section to any order in the page.
  * Retains intuitive **Up and Down arrow buttons** alongside the dropdown for rapid one-step repositioning.
  * Directly embeds the editing fields for that specific section (e.g. Hero titles, About metrics, Skills, Projects, etc.) right inside the component view.
* **Database & Backend Verification:**
  * Verified MongoDB connection handling and the persistent local database fallback in `data/database.json`.
  * Verified bcrypt hashing, JWT token issue on login/register, and validation via Zod schemas.

### Release 1.4 — API Reliability, Async Error Shielding & Non-JSON Resolution
* **Root Cause Diagnostics:**
  * Identified that unexpected controller rejections (such as unhandled validation rejections in Express 4 async handlers) triggered Node unhandled rejection events which terminated the server process, causing subsequent requests to encounter reverse-proxy warmup HTML and display `"server returned a non-JSON response"`.
  * Identified that missing 404 handlers for `/api/*` allowed unmatched API routes to fall through to Vite SPA middleware which returned `index.html` (text/html).
* **Async Error Shielding (`asyncHandler.ts`):**
  * Created `server/middleware/asyncHandler.ts` wrapping all controller endpoints (`/api/auth/*`, `/api/portfolio/*`, `/api/upload/*`).
  * All promise rejections are now safely routed to Express's `next(err)` pipeline without process disruption.
* **API 404 Guard & Process Immunity:**
  * Added `app.all('/api/*', ...)` in `server.ts` before frontend middleware to guarantee all unknown or misconfigured API endpoints respond strictly with JSON `{ success: false, message: 'API endpoint not found' }` instead of HTML.
  * Added `process.on('unhandledRejection')` and `process.on('uncaughtException')` crash-prevention listeners in `server.ts`.
* **Permissive Schema Sanitization (`portfolioValidator.ts`):**
  * Updated `updatePortfolioSchema` to `.partial().passthrough()`, preventing save failures during partial edits or empty draft items (skills, projects, experiences).
* **Enhanced Client-Side Error Decoding (`src/services/api.ts`):**
  * Updated client `request()` utility with intelligent status decoding: provides human-friendly explanations for initialization warmups (502/503), route misconfigurations (404), expired tokens (401), and validation issues instead of generic parser errors.

