# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router pages and API routes (`src/app/api/.../route.ts`).
- `src/components`: UI components (kebab-case filenames, export PascalCase components).
- `src/lib`: domain services, stores (Zustand), security, config, clients (`db.ts`, `supabase.ts`). Use `@/*` path alias.
- `src/hooks`, `src/types`, `src/styles`, `public/` assets.
- `prisma/schema.prisma` for data model; `supabase/` for SQL/migrations; `reset-prisma.js` for local resets.

## Build, Test, and Development Commands
- `npm run dev` — start development (Turbopack).
- `npm run build` — production build.
- `npm run start` — start production server.
- `npm run lint` — ESLint (Next + TypeScript rules).
- Prisma: `npx prisma migrate dev`, `npx prisma generate`, `npx prisma studio`.

## Coding Style & Naming Conventions
- TypeScript strict mode; prefer 2-space indentation; keep imports sorted and minimal.
- Components: PascalCase exports; files in `src/components/**` use kebab-case (e.g., `pricing-history.tsx` → `PricingHistory`).
- Functions/variables camelCase; constants UPPER_SNAKE_CASE.
- Use `@/*` alias for internal imports; avoid deep relative paths.
- Tailwind CSS v4 + shadcn/ui: prefer utility classes; use existing UI primitives under `src/components/ui`.

## Testing Guidelines
- No automated tests yet. When adding, use React Testing Library for UI and Vitest/Jest for units.
- Co-locate tests or mirror structure in `__tests__`. Name as `*.test.ts`/`*.test.tsx`.
- Prioritize `src/lib/**` services, critical flows, and security/validation utils.

## Commit & Pull Request Guidelines
- Follow Conventional Commits: `feat`, `fix`, `refactor`, optional scope. Examples: `feat(auth): implement email/password`, `fix: corrigir erros TypeScript`.
- PRs must include: purpose/summary, linked issues, screenshots for UI changes, validation steps, and notes on env vars or Prisma migrations. Update docs when changing schema/env/routes.

## Security & Configuration Tips
- Never commit secrets. Use `.env.local`; keep `.env.example` current.
- Prisma uses `DATABASE_URL` and `DIRECT_URL`. Ensure Supabase RLS is configured.
- Mercado Livre OAuth requires HTTPS callbacks; keep redirect URIs in sync with deploy.
- Allowed image domains live in `next.config.ts`.
