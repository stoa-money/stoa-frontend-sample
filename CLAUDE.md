# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack for fast refresh
- `npm run build` - Build production-ready application
- `npm run start` - Run production build
- `npm run lint` - Run ESLint (note: errors are ignored during builds)

### Code Formatting
This project uses Biome for formatting with the following configuration:
- 2 spaces indentation
- 120 character line width
- LF line endings
- Config extends "ultracite" preset

To format code, ensure it follows these standards. Note: There's no explicit format command in package.json, so formatting is likely handled by IDE integration.

## Architecture Overview

This is a Next.js 15 financial platform for managing "Pots" (savings/investment products) with various "Pot Factories" (product providers).

### Core Architecture Patterns

1. **Multi-Step Workflow System**
   - The application uses a complex workflow pattern for pot creation located in `src/pages/pots/create/[potFactoryOfferId].tsx`
   - Steps are managed through a state machine pattern with components in `src/components/steps/`
   - Each step has its own component handling validation and state transitions

2. **API Service Layer**
   - All backend communication goes through `src/api/` services
   - Services use token-based authentication via Clerk
   - API base URL is configurable via `NEXT_PUBLIC_CORE_API_BASE_URL`
   - Common pattern: Service classes with static methods returning typed responses

3. **Real-time Communication**
   - SignalR integration for live updates via `src/contexts/SignalRContext.tsx`
   - Hub connection managed at application level
   - Used for notifications and real-time pot status updates

4. **State Management**
   - Zustand stores in `src/store/` for global state
   - Local component state for UI-specific data
   - Context providers for cross-component communication

5. **Authentication Flow**
   - Clerk handles user authentication
   - Middleware protects routes requiring authentication
   - Admin routes under `/admin/*` require specific roles
   - API tokens automatically injected into service calls

### Key Architectural Components

1. **PotFlow Component** (`src/components/PotFlow.tsx`)
   - Central orchestrator for the pot creation workflow
   - Manages step progression and validation
   - Handles API calls between steps

2. **Service Architecture** (`src/api/`)
   - `UserService` - User management and KYC
   - `PotFactoryService` - Product provider operations
   - `PotService` - Pot creation and management
   - `BankAccountService` - Bank connection handling
   - All services follow similar patterns with typed requests/responses

3. **Type System** (`src/types/`)
   - Comprehensive TypeScript types for all entities
   - Shared between frontend and API communication
   - Key types: User, Pot, PotFactory, PotFactoryOffer

4. **UI Component Library** (`src/components/ui/`)
   - Built on Radix UI primitives
   - Styled with Tailwind CSS v4
   - Consistent design system across the application

### Environment Configuration

Required environment variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk authentication
- `NEXT_PUBLIC_CORE_API_BASE_URL` - Backend API endpoint
- `NEXT_PUBLIC_CORE_SIGNALR_URL` - SignalR hub URL

### Development Guidelines

1. **Component Structure**
   - Use functional components with TypeScript
   - Follow existing patterns in `src/components/`
   - Separate business logic into custom hooks

2. **API Integration**
   - Always use service classes in `src/api/`
   - Handle errors at the service level
   - Return typed responses

3. **State Management**
   - Use Zustand stores for global state
   - Keep component state local when possible
   - Avoid prop drilling by using contexts

4. **Code Style**
   - TypeScript strict mode is enabled
   - Follow Biome formatting rules (2 spaces, 120 line width)
   - Use explicit types rather than inference where clarity improves

5. **Testing Approach**
   - No test framework is currently configured
   - When adding tests, consider the existing architecture patterns