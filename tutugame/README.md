# TUTUGAME WEBSITE 

[![GitHub issues](https://img.shields.io/github/issues/red1gr/TUTUGAME?style=for-the-badge&logo=github&logoColor=white)](https://github.com/red1gr/TUTUGAME/issues)
[![GitHub license](https://img.shields.io/github/license/red1gr/TUTUGAME?style=for-the-badge&logo=apache&logoColor=white)](LICENSE)

## OVERVIEW

TUTUGAME is an innovative, high-performance web application built to serve as a gamified mission engine. It provides a dynamic and engaging interface for users to undertake quests, fostering collaboration and competition through features like duo collaboration modes and dynamic agent ranking. Leveraging Supabase for a robust backend-as-a-service, it offers real-time data synchronization with PostgreSQL and integrates with Discord webhooks for live mission logging. Developed with modern web technologies including React, TypeScript, and Framer Motion, TUTUGAME delivers a secure, fast, and fully responsive experience with custom nebula visual themes.

## FEATURES

-   **Gamified Mission Interface**: Engage users with a visually compelling and interactive questing system.
-   **Duo Collaboration Modes**: Facilitate teamwork and shared objectives with built-in cooperative functionalities.
-   **Dynamic Agent Ranking**: Implement competitive elements with real-time ranking and leaderboards.
-   **Custom Nebula Visual Themes**: Personalize the user experience with unique, aesthetically pleasing themes.
-   **Real-time Postgres Sync**: Seamlessly synchronize data with Supabase's PostgreSQL database for live updates.
-   **Webhook Integration for Live Logging**: Send mission updates and events directly to Discord channels for real-time monitoring.
-   **Secure & Performant**: Built with modern best practices for security and high responsiveness across devices.
-   **Modern Frontend Stack**: Utilizes React and TypeScript for a scalable and maintainable codebase, enhanced with Framer Motion for fluid animations.


## TECH STACK

**FRONTEND:**

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

**BACKEND-AS-A-SERVICE:**

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**DATABASE:**

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

**DEVOPS & TOOLS:**

![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7BA3E?style=for-the-badge&logo=prettier&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

## QUICK START

Follow these steps to get a development environment up and running.

### PREREQUISITES

Before you begin, ensure you have the following installed:

-   **Node.js**: `^18.0.0` or higher (LTS recommended)
-   **Bun**: `^1.0.0` or `npm`: `^9.0.0`
-   A **Supabase** account and project for database and authentication services.
-   A **Discord** server and webhook URL for mission logging (optional).

### INSTALLATION

1.  **CLONE THE REPOSITORY**
    ```bash
    git clone https://github.com/red1gr/TUTUGAME.git
    cd TUTUGAME
    ```

2.  **Install dependencies**
    ```bash
    # Using Bun (recommended)
    bun install

    # Alternatively, using npm
    # npm install
    ```

3.  **Environment setup**
    Create a `.env` file in the project root by copying the example:
    ```bash
    cp .env.example .env
    ```
    Then, open `.env` and configure your environment variables. You will need:
    ```
    VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_PUBLIC_KEY"
    VITE_DISCORD_WEBHOOK_URL="YOUR_DISCORD_WEBHOOK_URL" # Optional, for live logging
    ```
    *   **Supabase Project URL & Anon Key**: Find these in your Supabase project settings under "API".
    *   **Discord Webhook URL**: Create a webhook in your Discord server's channel settings.

4.  **Database setup (Supabase)**
    TUTUGAME relies on Supabase for its backend. You'll need to set up tables and RLS policies in your Supabase project according to the application's data models. Refer to the Supabase documentation or any schema definitions within the project (e.g., `supabase/schema.sql` if present, though not explicitly detected in this analysis) to configure your tables correctly.

5.  **Start development server**
    ```bash
    # Using Bun
    bun run dev

    # Alternatively, using npm
    # npm run dev
    ```

6.  **Open your browser**
    Visit `http://localhost:5173` (or the port indicated in your terminal) to see the application running.


### ENVIRONMENT VARIABLES

The application relies on environment variables for sensitive information and configuration.
A `.env.example` file is provided, which you should copy to `.env` and populate.

| Variable                   | Description                                             | Example Value                       | Required |
| :-------------------------- | :-------------------------------------------------------- | :------------------------------------- | :------- |
| `VITE_SUPABASE_URL`        | Your Supabase project URL.                              | `https://xyzcompany.supabase.co`    | Yes      |
| `VITE_SUPABASE_ANON_KEY`   | Your Supabase "anon public" key.                         | `eyJ...`                            | Yes      |
| `VITE_DISCORD_WEBHOOK_URL` | Discord webhook URL for live mission event logging.      | `https://discord.com/api/webhooks/` | No       |

### CONFIGURATION FILES

-   **`vite.config.ts`**: Configures Vite, the build tool, for development and production builds.
-   **`tailwind.config.js`**: Customizes Tailwind CSS to match the project's design system and theme.
-   **`postcss.config.js`**: Configures PostCSS plugins, usually for Tailwind CSS processing.
-   **`eslint.config.js`**: Defines linting rules to maintain code quality and consistency.
-   **`.prettierrc`**: Specifies code formatting rules for consistent styling across the codebase.
-   **`tsconfig.*.json`**: TypeScript configuration files defining compilation options and project structure for different contexts.

## DEVELOPMENT

### AVAILABLE SCRIPTS

The `package.json` defines several scripts for common development tasks:

| Command           | Description                                          |
| :----------------- | :------------------------------------------------------ |
| `bun run dev`     | Starts the development server with hot-reloading.    |
| `bun run build`   | Compiles the application for production deployment.  |
| `bun run lint`    | Lints the codebase using ESLint.                      |
| `bun run preview` | Serves the production build locally.                  |

### DEVELOPMENT WORKFLOW

1.  Start the development server using `bun run dev`.
2.  Make changes to the `src/` directory. Vite will automatically reload the application.
3.  Ensure code quality by running `bun run lint` periodically.
4.  Format your code with Prettier (often integrated with IDEs or run as a pre-commit hook).

## TESTING

This project doesn't explicitly define testing scripts or frameworks in the provided data.
A common setup for React applications involves [Vitest](https://vitest.dev/) for unit tests or [Cypress](https://www.cypress.io/) for end-to-end tests.

```bash
# Example: To run tests if Vitest or Jest is configured
# bun test

# Example: To run E2E tests if Cypress is configured
# bun run cypress open
```

**TODO**: Implement a testing framework (e.g., Vitest, Jest, React Testing Library) and add corresponding scripts and instructions here.

## DEPLOYMENT

### PRODUCTION BUILD

To create a production-ready build of the application:

```bash
bun run build
```

This command will compile and optimize the application into the `build/` directory, ready for deployment.

### DEPLOYMENT OPTIONS

-   **Static Hosting**: The `build/` directory can be deployed to any static hosting service (e.g., Netlify, Vercel, GitHub Pages, Firebase Hosting).
-   **Containerization**: A `Dockerfile` could be added to containerize the application for deployment to platforms like Docker, Kubernetes, or AWS ECS. (No Dockerfile detected currently)
-   **Vercel/Netlify**: These platforms offer seamless integration with GitHub repositories for continuous deployment.
    <!-- TODO: Add a "Deploy to Vercel/Netlify" button if applicable -->

## CONTRIBUTING

We welcome contributions! If you're interested in improving TUTUGAME, please consider the following:

-   Fork the repository.
-   Create a new branch for your feature or bug fix.
-   Make your changes, ensuring they adhere to the project's coding style (ESLint and Prettier are configured).
-   Write clear, concise commit messages.
-   Submit a pull request.

### DEVELOPMENT SETUP FOR CONTRIBUTORS

- THE DEVELOPMENT SETUP IS THE SAME AS DESCRIBED IN THE [QUICK START](#QUICK-START) SECTION. ENSURE YOU HAVE THE PREREQUISITES INSTALLED AND ENVIRONMENT VARIABLES CONFIGURED CORRECTLY.


## LICENSE

THIS PROJECT IS LICENSED UNDER THE [APACHE LICENSE 2.0](LICENSE) - SEE THE [LICENSE](LICENSE) FILE FOR DETAILS.

## SUPPORT & CONTACT

- ISSUES:  [GITHUB ISSUES](https://github.com/red1gr/tutugame/issues)
- CONTACT: [SUPPORT CONTACT](mailto:mail@red1gr.dev) 

