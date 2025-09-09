# Overview

Bouquet Bar is a full-stack web application that combines an e-commerce flower shop with a floral design school. The platform allows customers to browse and purchase fresh flowers while also offering professional floral design courses and certifications. Built as a single-page application with a modern React frontend and Express backend, it provides a comprehensive floral business solution.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with single-page application structure
- **UI Library**: Radix UI components with shadcn/ui design system for consistent, accessible interface
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management with custom query client
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing

## Backend Architecture
- **Framework**: Express.js with TypeScript for RESTful API endpoints
- **Data Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Storage Strategy**: Abstracted storage interface with in-memory implementation for development
- **API Structure**: Resource-based endpoints for products, courses, orders, enrollments, testimonials, and blog posts
- **Middleware**: Custom logging middleware for API request tracking

## Database Schema Design
The application uses PostgreSQL with Drizzle ORM defining these core entities:
- **Users**: Authentication and user management
- **Products**: Flower inventory with categories, pricing, and stock status
- **Courses**: Floral design training programs with pricing and scheduling
- **Orders**: Customer orders with item details and order status tracking
- **Enrollments**: Course registrations linking users to training programs
- **Testimonials**: Customer reviews and ratings for both products and courses
- **Blog Posts**: Content management for floral tips and industry insights

## Development Workflow
- **Type Safety**: Shared TypeScript schemas between frontend and backend using Drizzle Zod integration
- **Hot Reload**: Vite development server with HMR for rapid frontend development
- **Database Management**: Drizzle Kit for schema migrations and database synchronization
- **Asset Management**: Vite asset pipeline with path aliases for clean imports

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Neon database driver for PostgreSQL connections
- **drizzle-orm** and **drizzle-kit**: Type-safe ORM with migration tooling
- **express**: Backend web framework
- **@tanstack/react-query**: Server state management and caching

## UI and Styling Libraries
- **@radix-ui/***: Complete set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library for consistent iconography

## Form and Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation and schema definition

## Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Third-Party Services
- **Google Fonts**: Typography with Inter, Architects Daughter, DM Sans, Fira Code, and Geist Mono fonts
- **Unsplash**: Stock photography for product images and gallery content
- **WhatsApp Business**: Customer communication integration
- **Email Services**: Contact form and order notification capabilities (implementation ready)