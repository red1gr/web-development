
# RDSTORE UPDATES WEBSITE

<div align="center">

[![GitHub Issues](https://img.shields.io/github/issues/red1gr/rdstore_changelogs_website?style=for-the-badge)](https://github.com/red1gr/rdstore_changelogs_website/issues)
[![GitHub License](https://img.shields.io/github/license/red1gr/rdstore_changelogs_website?style=for-the-badge)](LICENSE)

[LIVE DEMO](https://updates.rdstorefivem.com/)

</div>

## OVERVIEW

The RDSTORE Changelogs Website is a sophisticated frontend application designed to dynamically display version history, feature updates, and video previews for various RDSTORE scripts, including Pharmacy, Priority, and Locker. Built as a single-page application, it leverages a modern technology stack to deliver a visually engaging and highly interactive user experience.

The website features a unique Bento Grid layout with advanced 3D tilt effects powered by Framer Motion, complemented by vibrant neon gradients and glassmorphism elements. Its fully responsive design ensures seamless accessibility across all devices, while smooth hover animations further enhance user engagement. This project serves as a central hub for users to easily track and explore updates to RDSTORE products.

## FEATURES

- **Dynamic Changelog Display:** Presents detailed version history, feature updates, and video previews for Pharmacy, Priority, and Locker scripts.
- **Modern & Interactive UI:** Utilizes a Bento Grid layout with 3D tilt effects.
- **Aesthetic Design:** Neon gradients, glassmorphism, and smooth hover animations.
- **Fully Responsive:** Optimized for desktop, tablet, and mobile devices.
- **Robust Data Fetching:** Uses `@tanstack/react-query` for caching and synchronization.
- **SEO Friendly:** Uses `react-helmet-async` for document metadata.
- **Animated Interactions:** Powered by `framer-motion`.
- **Video Previews:** Uses `react-player` for changelog demonstrations.

## SCREENSHOTS
<div align="center">
  <img src="https://r2.fivemanage.com/S1wPEooftNoEmQjn8jhwx/ima2222ge.png" width="900">
  <br><br>
  <img src="https://r2.fivemanage.com/S1wPEooftNoEmQjn8jhwx/i1111mage.png" width="900">
  <br><br>
  <img src="https://r2.fivemanage.com/S1wPEooftNoEmQjn8jhwx/111image.png" width="900">
</div>

## TECH STACK

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![React Router DOM](https://img.shields.io/badge/React_Router_DOM-6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-8-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)
![Day.js](https://img.shields.io/badge/Day.js-1-F2A418?style=for-the-badge&logo=day.js&logoColor=white)
![Heroicons](https://img.shields.io/badge/Heroicons-2-6B7280?style=for-the-badge&logo=heroicons&logoColor=white)
![npm](https://img.shields.io/badge/npm-blue?style=for-the-badge&logo=npm&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-yellow?style=for-the-badge&logo=bun&logoColor=black)
![ESLint](https://img.shields.io/badge/ESLint-8-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)

## QUICK START

Follow these steps to get a development environment up and running.

### PREREQUISITES

- Node.js (v18 or higher)
- npm or Bun

### INSTALLATION

```bash
git clone https://github.com/red1gr/rdstore_changelogs_website.git
cd rdstore_changelogs_website
````

Install dependencies:

```bash
npm install
```

or

```bash
bun install
```

### START DEVELOPMENT SERVER

```bash
npm run dev
```

or

```bash
bun run dev
```

Open:

```
http://localhost:5173
```

## CONFIGURATION

### CONFIGURATION FILES

* `.prettierrc`
* `eslint.config.js`
* `tailwind.config.js`
* `postcss.config.js`
* `vite.config.ts`
* `tsconfig.json`
* `tsconfig.app.json`
* `tsconfig.node.json`

## DEVELOPMENT

### AVAILABLE SCRIPTS

| COMMAND   | DESCRIPTION                            |
| --------- | -------------------------------------- |
| `dev`     | Starts the development server.         |
| `build`   | Builds the application for production. |
| `lint`    | Runs ESLint.                           |
| `preview` | Serves the production build locally.   |

### DEVELOPMENT WORKFLOW

* Linting with ESLint.
* Formatting with Prettier.
* Hot Module Reloading via Vite.

## DEPLOYMENT

### PRODUCTION BUILD

```bash
npm run build

# or

bun run build
```

### DEPLOYMENT OPTIONS

* Vercel
* Netlify
* GitHub Pages
* AWS S3 + CloudFront

Upload the generated `build/` directory to your preferred hosting provider.

## CONTRIBUTING

We welcome contributions.

* **Reporting Bugs:** Open an issue.
* **Suggesting Features:** Create a feature request.
* **Submitting Pull Requests:** Fork the repository and submit a pull request.

Please ensure your code passes:

```bash
npm run lint
```

### DEVELOPMENT SETUP FOR CONTRIBUTORS

Follow the instructions in the **QUICK START** section.

## SUPPORT & CONTACT

* **ISSUES:** [GITHUB ISSUES](https://github.com/red1gr/rdstore_changelogs_website/issues)
* **CONTACT:** [mail@red1gr.dev](mailto:mail@red1gr.dev)

