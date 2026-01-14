🛠️ Getting Started
1. Installation
Before running any scripts, you must install the project dependencies. This step downloads all required Angular packages, SSR tools, and build optimizers defined in package.json.

Bash

npm install
🚀 Build & Rendering Process
This project utilizes the modern Angular Application Builder (based on esbuild) to handle Hybrid Rendering (CSR + SSR/SSG) in a single step.

2. How to Build
To generate the production build, run:

Bash

npm run build
What Happens During the Build?
The ng build command now performs three key tasks automatically:

Browser Bundling: Compiles TypeScript and SCSS into optimized JavaScript and CSS for the client.

Server Bundling: Generates the Node.js server logic required for Server-Side Rendering (SSR).

Prerendering (SSG): It boots up the server internally, extracts routes, and generates static HTML files for immediate loading and better SEO.

Output Structure (dist/)
After the build finishes, the dist/3dp-landing/ folder will contain:

📂 browser/: Contains the static assets (HTML, JS, CSS, images).

Note: This is the folder deployed to GitHub Pages or static hosts (Nginx/Apache).

📂 server/: Contains the server.mjs file.

Note: Used only if hosting on a Node.js server for dynamic SSR.

3. Deployment
To build and deploy to GitHub Pages:

Bash

npm run deploy
This script builds the project with the correct base-href and pushes the contents of the browser folder to the gh-pages branch.