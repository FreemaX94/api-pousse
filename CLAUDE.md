# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT RULES

⚠️ **NEVER automatically run `npm run dev` or `npm start` commands** - The user will handle starting the development servers locally.

## Project Structure

This is a full-stack application with separate frontend and backend:

- **Backend**: Node.js/Express API server (`backend/`)
- **Frontend**: React application with Vite (`frontend/`)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication system
- **Deployment**: DigitalOcean App Platform with auto-deployment

## Development Commands

### Backend Development
```bash
cd backend
npm install                    # Install dependencies
npm run dev                    # Start development server with nodemon
npm start                      # Start production server
npm test                       # Run Jest tests with coverage
npm run lint                   # Run ESLint
```

### Frontend Development
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                    # Start Vite development server (port 3000)
npm run build                  # Build for production
npm run preview                # Preview production build
npm test                       # Run Vitest tests
npm run test:coverage          # Run tests with coverage
npm run lint                   # Run ESLint
```

### Full Application Build & Deploy
```bash
./deploy.sh                    # Build frontend, copy to backend/public, and deploy
```

## Architecture Overview

### Backend (`backend/`)
- **Entry Point**: `index.js` starts the server, `app.js` configures Express
- **Routes**: Organized by feature in `routes/` directory
- **Controllers**: Business logic handlers in `controllers/`
- **Models**: Mongoose schemas in `models/`
- **Services**: Business logic layer in `services/`
- **Middleware**: Authentication, security, and utilities in `middlewares/`
- **Configuration**: Database, mailer, Redis setup in `config/`
- **Security**: Helmet, rate limiting, CORS configured in `middlewares/security.js`

### Frontend (`frontend/`)
- **Entry Point**: `main.jsx` with React Router
- **Components**: Reusable UI components in `components/`
- **Pages**: Route-specific components in `pages/`
- **API Layer**: API calls organized in `api/`
- **Styling**: Tailwind CSS with custom components
- **State Management**: React hooks and context
- **Testing**: Vitest with React Testing Library

### Key Features
- **Authentication**: JWT-based with refresh tokens
- **Stock Management**: Inventory tracking with entries/exits
- **Invoicing**: Invoice generation and management
- **Vehicle Management**: Fleet tracking with document uploads
- **Catalog Management**: Product catalog with Nieuwkoop integration
- **Event Management**: Calendar integration
- **User Management**: Role-based access control

## Database Models

Main entities include:
- `User`: Authentication and user profiles
- `StockEntry`: Inventory tracking
- `Invoice`: Billing management
- `Vehicle`: Fleet management
- `CatalogueItem`: Product catalog
- `Concepteur`: Designer management
- `Expense`: Expense tracking

## API Integration

The application integrates with external APIs:
- **Nieuwkoop**: Plant supplier API integration
- **Google Calendar**: Event management
- **Email**: Nodemailer for notifications

## Testing

### Backend Tests
- **Framework**: Jest with Supertest
- **Location**: `backend/tests/`
- **Coverage**: Generated in `backend/coverage/`
- **Configuration**: `jest.config.cjs`

### Frontend Tests
- **Framework**: Vitest with React Testing Library
- **Location**: `frontend/src/__tests__/`
- **Configuration**: `vitest.config.js`

## Security

Security measures implemented:
- Helmet for HTTP headers
- Rate limiting on authentication endpoints
- CORS configuration
- Input validation with Celebrate
- JWT token management
- SQL injection prevention with Mongoose

## Development Workflow

1. **Local Development**: Frontend (port 3000) proxies API calls to backend (port 3001)
2. **Build Process**: `deploy.sh` builds frontend and copies to `backend/public/`
3. **Deployment**: Auto-deployment to DigitalOcean on git push
4. **Testing**: Run tests before deployment with `npm test`

## Environment Configuration

- **Backend**: Requires `.env` file with database, JWT secrets, and API keys
- **Frontend**: Vite configuration handles environment variables
- **Production**: Environment variables configured in DigitalOcean App Platform

## File Upload Handling

- **Backend**: Multer middleware for file uploads
- **Storage**: Files stored in `backend/uploads/` and `backend/public/vehicles/`
- **Security**: File type validation and size limits

## Common Development Tasks

### Adding New Features
1. Create backend route in `routes/`
2. Add controller in `controllers/`
3. Create service in `services/`
4. Add model if needed in `models/`
5. Create frontend components and pages
6. Add API calls in `frontend/src/api/`
7. Write tests for both backend and frontend

### Database Operations
- Models use Mongoose for MongoDB interactions
- Connection configured in `backend/config/config.js`
- Seeding scripts available in `backend/scripts/`

### API Documentation
- Swagger documentation available at `/api-docs` endpoint
- Generated from JSDoc comments in route files