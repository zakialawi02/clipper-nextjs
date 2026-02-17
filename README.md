# Next.js Authentication Starter Pack with Prisma

A production-ready authentication starter template for Next.js 16 App Router with Prisma ORM, PostgreSQL, and NextAuth.js. Preconfigured with Discord, GitHub, and Google OAuth providers.

## Features

- 🔐 Full authentication system with NextAuth.js
- 🗄️ PostgreSQL database integration with Prisma ORM
- 🚀 Next.js 16+ App Router with Server Components
- 🎨 Tailwind CSS for styling
- 🌙 Dark mode support
- 📱 Responsive UI components
- 🔒 Secure environment variable validation
- 🧠 TypeScript support
- 🛡️ Protected routes with middleware
- 🔄 Session management
- 📦 Ready-to-use UI components

## Tech Stack

- [Next.js 16+](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [NextAuth.js](https://next-auth.js.org/) - Authentication solution
- [Prisma](https://www.prisma.io/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide Icons](https://lucide.dev/) - Icon library

## Prerequisites

- Node.js 18+
- PostgreSQL database
- OAuth credentials for providers you want to use (Discord, GitHub, Google)

## Getting Started

1. Clone the repository:

```bash
git clone <repository-url>
cd starterpack-nextjs-auth-prisma
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:

- `DATABASE_URL`: Your PostgreSQL connection string
- `AUTH_SECRET`: Secret for NextAuth.js (generate with `openssl rand -base64 32` or run script `npm run generate:auth`)
- OAuth provider credentials (at least one):
  - `AUTH_DISCORD_ID` and `AUTH_DISCORD_SECRET`
  - `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`
  - `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`

5. Generate Prisma client:

```bash
npx prisma generate
```

6. Set up the database:

```bash
npm run db:migrate
```

7. Run the development server:

```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run generate:auth` - Generate authentication key
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run check` - Run linting and type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Apply database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npm run format:check` - Check code formatting
- `npm run format:write` - Format code
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── (admin)/         # Admin/dashboard routes (protected)
│   ├── (public)/        # Public routes
│   ├── api/auth/        # NextAuth.js API routes
├── components/          # React components
├── lib/                 # Utility libraries
├── types/               # TypeScript types
├── env.ts              # Environment variable validation
```

## Authentication Providers

This starter pack comes preconfigured with three OAuth providers:

1. Discord
2. GitHub
3. Google

To enable a provider, simply add the corresponding environment variables. At least one provider must be configured for authentication to work.

## Database Schema

The project uses Prisma with a PostgreSQL database. The schema includes:

- User model
- Account model
- Session model
- VerificationToken model

These models are based on the default NextAuth.js schema and are automatically managed by the Prisma adapter.

## UI Components

The project includes several pre-built UI components from Shadcn/ui:

- Buttons
- Cards
- Dropdown menus
- Inputs
- Avatars
- And more

All components are styled with Tailwind CSS and support dark mode.

## Deployment

1. Set up your production database
2. Configure all environment variables
3. Build the application:

```bash
npm run build
```

4. Start the production server:

```bash
npm start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support and Donations

If you find this project useful and would like to support its further
development, you can make a donation via the following platforms:

https://ko-fi.com/zakialawi

Every contribution you make is greatly appreciated. Thank you!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
