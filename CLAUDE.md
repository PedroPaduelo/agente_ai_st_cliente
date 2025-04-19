# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Code Style Guidelines

### Imports/Formatting
- Use `@/*` path aliases for imports from src directory
- Order: external libraries → internal components → types/styles
- Use ESLint for code formatting

### TypeScript
- Strict mode enabled with noUnusedLocals/Parameters
- Explicit type annotations for function parameters/returns
- No unchecked side effects (noUncheckedSideEffectImports)

### Component Structure
- React 19 functional components
- shadcn/ui components from /components, custom in /components-custom
- Context providers for state management
- Use React Query for API calls and error handling

### Naming/Styling
- PascalCase: components, types; camelCase: variables, functions
- Tailwind CSS with clsx/class-variance-authority for conditional classes
- Component-centric organization with descriptive semantic names
