# Myanmar 2D Lottery Application

## Overview

This is a full-stack Myanmar 2D lottery results application built with modern web technologies. The app displays real-time lottery results for 2D and 3D games, providing users with up-to-date information in a mobile-first interface that mimics a native mobile app experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Development**: Hot module replacement via Vite integration

### Data Storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via Drizzle config)
- **Migrations**: Drizzle Kit for schema management
- **Development Storage**: In-memory storage implementation for development

## Key Components

### Core Features
1. **Lottery Results Display**: Real-time 2D and 3D lottery results
2. **Mobile-First UI**: App-like interface with status bar simulation
3. **Live Updates**: Refresh functionality with loading states
4. **Historical Data**: Access to previous results by date and type
5. **Settings Management**: Application configuration storage

### UI Components
- **App Header**: Mobile status bar simulation with view toggle
- **Result Cards**: Display lottery results with SET, Value, and 2D numbers
- **Main Display**: Large result number with update status
- **Action Buttons**: Refresh and history navigation
- **Floating Notifications**: Success/error feedback system

### API Endpoints
- `GET /api/lottery-results` - All lottery results
- `GET /api/lottery-results/:type` - Results by type (2D/3D)
- `GET /api/lottery-results/date/:date` - Results by date
- `POST /api/lottery-results` - Create new result
- `GET /api/settings` - Application settings
- `PATCH /api/settings` - Update settings

## Data Flow

### Client-Server Communication
1. **Initial Load**: Client fetches lottery results and settings via React Query
2. **Real-time Updates**: Manual refresh triggers API calls and cache invalidation
3. **State Persistence**: Settings changes are persisted to backend
4. **Error Handling**: Network errors displayed via toast notifications

### Data Models
- **LotteryResult**: Contains draw time, date, type, SET/Value numbers, and loading states
- **AppSettings**: Stores current view preference and application metadata

## External Dependencies

### UI Framework
- **Radix UI**: Headless UI primitives for accessibility
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **Zod**: Runtime type validation and schema generation
- **ESBuild**: Fast JavaScript bundling for production

### Third-Party Integration
- **Thai Stock 2D API**: External lottery data source (documented in attached assets)
- **Neon Database**: Serverless PostgreSQL provider
- **Replit**: Development environment integration

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: ESBuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: Uses Vite dev server with Express middleware
- **Production**: Serves static files from Express with API routes
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable

### Hosting Considerations
- **Node.js Environment**: Requires Node.js runtime for Express server
- **Database**: PostgreSQL database instance needed
- **Static Assets**: Served directly by Express in production
- **Environment Variables**: Database URL must be configured before deployment

The application follows a standard full-stack deployment pattern where the Express server serves both the API and static frontend files in production, while development uses Vite's dev server for hot reloading.