# Technical Context: Mesh Reality

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **3D Rendering**: Three.js
- **Animation**: Framer Motion
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Notifications**: Sonner
- **Theming**: next-themes (dark/light mode)

### Authentication & Security
- **Auth**: Backend-owned (Express API). Session via HTTP-only cookie.
- **Auth Methods**: Phone OTP, Google OAuth, Apple OAuth (backend talks to Supabase Auth).
- **Frontend**: No auth SDK; calls backend `/api/auth/session`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/oauth`, `/api/auth/phone/*`.

### API & Backend
- **API Routes**: Next.js API Routes
- **Database**: (External, accessed through API)
- **External APIs**: 
  - Model generation service API
  - Job management API
  - Storage service API

### Media Processing
- **Image Handling**: @imgly/background-removal
- **File Upload**: react-dropzone
- **3D Model Format**: Three.js compatible formats
- **Preview Generation**: Via Python service

### Deployment
- **Hosting**: Vercel
- **CI/CD**: GitLab CI/CD (`.gitlab-ci.yml`)
- **Edge Functions**: Vercel Edge
- **Analytics**: (Not specified in current codebase)

## Development Environment

### Prerequisites
- Node.js 18.x or later
- npm or pnpm package manager
- Backend API (mesh-reality-backend) with Supabase configured
- Google Cloud project (for OAuth, configured in Supabase)
- Apple Developer account (optional, for Apple Sign In)

### Local Setup
1. Repository clone and dependency installation
2. Backend env (SUPABASE_*, FRONTEND_URL, etc.)
3. OAuth provider configuration in Supabase Dashboard
4. Environment variables setup (`.env.local`)
5. Local development server via `npm run dev`

## Key Dependencies

### Core Dependencies
```json
{
  "next": "^14.2.0",
  "react": "^18",
  "react-dom": "^18",
  "typescript": "^5"
}
```

### Authentication
- No auth SDK on frontend. Backend uses Supabase (server-side) and session cookies.

### UI & Styling
```json
{
  "@radix-ui/react-dropdown-menu": "^2.1.6",
  "@radix-ui/react-icons": "^1.3.0",
  "@radix-ui/react-label": "^2.1.2",
  "@radix-ui/react-slot": "^1.0.2",
  "@radix-ui/react-switch": "^1.0.3",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.0",
  "framer-motion": "^11.0.14",
  "lucide-react": "^0.358.0",
  "tailwind-merge": "^2.2.2",
  "tailwindcss-animate": "^1.0.7"
}
```

### 3D & Media
```json
{
  "@imgly/background-removal": "^1.5.8",
  "@types/three": "^0.173.0",
  "three": "^0.173.0",
  "simplex-noise": "^4.0.3"
}
```

### Form Handling
```json
{
  "@hookform/resolvers": "^3.3.4",
  "react-hook-form": "^7.51.3",
  "zod": "^3.22.4"
}
```

## Environment Variables Structure

The application requires the following environment variables:

```
# Frontend (.env)
NEXT_PUBLIC_API_URL=http://localhost:3002

# Backend handles auth (Supabase, cookies). See backend .env.example.
```

## API Integration

The frontend interfaces with multiple backend services:

1. **Job Creation API**
   - Endpoint: `/api/generate-model/route.ts`
   - Purpose: Creates 3D generation jobs

2. **Job Status API**
   - Endpoint: `/api/jobs/[jobId]/route.ts`
   - Purpose: Retrieves job status and metadata

3. **Authentication**
   - Handled by backend (mesh-reality-backend): `/api/auth/session`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/oauth`, `/api/auth/phone/*`
   - Frontend uses cookies (credentials: include) for session

## Deployment Strategy

Deployment is handled through Vercel with configuration in `vercel.json` and follows these key principles:

1. **Continuous Deployment**: Automatic deployments on main branch changes
2. **Preview Deployments**: Automated preview deployments for pull requests
3. **Environment Segregation**: Development, staging, and production environments
4. **Edge Functions**: For authentication and API routes requiring low latency
5. **Static Optimization**: For marketing pages and other static content

### Deployment Documentation

Detailed deployment procedures are documented in `DEPLOYMENT.md` which includes:
- Environment configuration
- Deployment steps
- Rollback procedures
- Monitoring setup

## Technical Constraints

1. **Browser Compatibility**: Modern browsers only (no IE support)
2. **Mobile Responsiveness**: Required for all views
3. **Performance**: Optimization for large 3D models
4. **API Timeouts**: Job-based architecture to handle long-running processes
5. **Authentication**: Limited to supported OAuth providers and phone authentication
6. **Storage Limits**: Based on user tier/subscription level

## Development Workflow

1. **Local Development**: NextJS dev server with hot reloading
2. **Code Style**: ESLint for TypeScript/React
3. **Build Process**: Next.js build and static optimization
4. **Testing**: (Testing framework not yet implemented in current codebase)
5. **Deployment**: GitLab CI/CD pipeline to Vercel

This technical context provides the essential information needed to understand the technology stack, development environment, dependencies, and constraints of the Mesh Reality project.
