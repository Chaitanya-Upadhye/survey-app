# Health & Financial Survey Application

A modern, production-ready survey application built with React Router and TypeScript.

## Tech Stack

- **React Router v7** - Modern routing with TypeScript support
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Zod** - Schema validation and single source of truth for form metadata
- **Drizzle ORM** - Type-safe PostgreSQL ORM with excellent scaling capabilities
- **React Hook Form** - Performant form management with seamless Zod integration

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 Modern, responsive UI with TailwindCSS
- 📝 Multi-step form with validation
- 💾 PostgreSQL database integration

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

## Future Improvements

### Database Normalization
The current implementation stores survey responses in a single JSON column within the 'survey_responses' table. This could be optimized by:
- Creating a separate 'user_question_answers' table with:
  - survey_response_id
  - question_id
  - response (JSON with {"value": string | string[]})
- This structure would enable easier querying by question or specific response values

### Survey Versioning
- The current form structure is driven by a JSON document built on Zod schema
- This could be persisted in the database to enable:
  - Survey versioning
  - Dynamic form generation
  - Historical tracking of survey changes

### Authentication
- Implement basic email/password authentication
- Future enhancements could include:
  - OAuth integration for social login
  - User profiles
  - View past submissions
  - Survey response management

### Enhanced Error Handling
- Implement comprehensive error boundaries in UI
- Improve API error responses with detailed messages
- Add retry mechanisms for failed submissions
- Better validation feedback in multi-step form

---

Built with ❤️ using React Router.
