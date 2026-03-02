# Mesh Reality Frontend

A Next.js 14 application for transforming ideas into stunning 3D models with authentication and dashboard functionality.

## Features

- Backend-owned authentication (Phone, Google, Apple via backend API; session cookie)
- Protected Dashboard Routes
- Model Upload and Management
- Dark Mode Support
- Responsive Design
- Real-time Updates

## Prerequisites

- Node.js 18.x or later
- Backend API (mesh-reality-backend) running with Supabase configured
- Google Cloud / Apple Developer (for OAuth, configured in Supabase Dashboard)

## Setup

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd mesh-reality-website-main
npm install
```

2. Create a `.env.local` file with:
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
```

3. Ensure the backend is running and has Supabase + FRONTEND_URL configured. Add `http://localhost:3000/auth/callback` to Supabase Auth redirect URLs.

4. Run the development server:
```bash
npm run dev
```

## Project Structure

```
new-design-frontend/
├── app/                    # Next.js 14 app directory
│   ├── (auth)/            # Authentication routes
│   ├── (marketing)/       # Marketing pages
│   └── dashboard/         # Protected dashboard routes
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── ui/              # UI components
│   └── landing/         # Landing page components
├── contexts/             # React contexts
├── hooks/               # Custom hooks
├── lib/                 # Utility functions
└── types/              # TypeScript type definitions
```

## Authentication Flow

1. Users sign in via the backend (Google/Apple OAuth redirect, or phone OTP).
2. Backend validates with Supabase and sets an HTTP-only session cookie.
3. Frontend calls `GET /api/auth/session` (with cookie) for user state; all API requests send the cookie.

## Development

- **Development Mode**: `npm run dev`
- **Build**: `npm run build`
- **Start Production**: `npm start`
- **Lint**: `npm run lint`

## Testing

For development and testing, you can use the following test credentials:
- Test Phone Number: +15035458858
- Test Verification Code: 123456

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[MIT License](LICENSE)
