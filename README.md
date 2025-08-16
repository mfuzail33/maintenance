# Property Management System - Frontend

A modern, production-ready React/Next.js frontend application for property management with separate admin and resident portals.

## 🚀 Features

### Admin Portal
- **Analytics Dashboard**: Comprehensive charts and statistics with real-time data
- **Resident Management**: Complete CRUD operations with ban/unban functionality
- **Phase Management**: Track development phases with payment status and image uploads
- **Announcements**: Create, edit, and manage community announcements with priority levels

### Resident Portal
- **Profile Dashboard**: Personal information management and activity overview
- **Announcements**: Browse community announcements with advanced search and filtering
- **Phase Details**: View development phases with images and progress tracking
- **Resident Directory**: Complete resident list with payment status across all phases

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3.4
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts for data visualization
- **Authentication**: JWT-based with role-based routing
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API server running

### Installation

1. **Clone and install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Setup**:
   Create a `.env.local` file:
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   \`\`\`

3. **Development Server**:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Access the Application**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Default redirect: Resident login page
   - Admin login: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## 📁 Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── admin/             # Admin portal pages
│   │   ├── dashboard/     # Analytics dashboard
│   │   ├── residents/     # Resident management
│   │   ├── phases/        # Phase management
│   │   └── announcements/ # Announcement management
│   ├── resident/          # Resident portal pages
│   │   ├── dashboard/     # Personal dashboard
│   │   ├── announcements/ # Community announcements
│   │   ├── phases/        # Phase information
│   │   └── residents/     # Resident directory
│   └── globals.css        # Global styles with design tokens
├── components/            # Reusable UI components
│   ├── admin/             # Admin-specific components
│   ├── resident/          # Resident-specific components
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components
│   ├── ui/                # Base UI components (shadcn/ui)
│   └── icons/             # Custom icons
├── contexts/              # React contexts (Auth)
├── hooks/                 # Custom hooks
├── lib/                   # Utilities and API client
└── public/                # Static assets
\`\`\`

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full system access with management capabilities
- **Resident**: Limited access to personal and community information

### Route Protection
- Automatic role-based redirects
- Protected routes with middleware
- Session management with JWT tokens

### Login Flow
1. Default: Resident login (`/resident/login`)
2. Admin access: `/admin/login`
3. Auto-redirect based on user role after authentication

## 🎨 Design System

### Color Palette
- **Primary**: Charcoal Gray (#1f2937)
- **Secondary**: Medium Gray (#6b7280) 
- **Accent**: Purple (#8b5cf6)
- **Success**: Green (#10b981)
- **Warning**: Orange (#d97706)
- **Error**: Red (#dc2626)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Responsive**: Mobile-first approach

## 🚀 Production Deployment

### Build Process
\`\`\`bash
npm run build
npm start
\`\`\`

### Environment Variables
Set these in your production environment:
\`\`\`env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NODE_ENV=production
\`\`\`

### Performance Features
- Optimized images and assets
- Code splitting and lazy loading
- Responsive design for all devices
- Accessibility compliance (WCAG AA)

## 🔧 Development

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Responsive design patterns
- Component composition architecture

### API Integration
- Centralized API client (`lib/api.ts`)
- Error handling and loading states
- Optimistic updates where appropriate
- File upload support for images

## 📱 Features Overview

### Admin Capabilities
- Real-time analytics and reporting
- Resident account management
- Development phase tracking
- Community announcement system
- Payment status monitoring

### Resident Experience  
- Personal profile management
- Community updates and news
- Development progress tracking
- Resident directory access
- Payment history visibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.
