# enx-blue Deployment Guide

This guide covers how to push your code to GitHub and deploy your habit tracker website.

---

## Part 1: Push to GitHub

### Step 1: Initialize Git Repository

Open your terminal in the project folder and run:

```bash
cd /mnt/okcomputer/output/app

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: enx-blue habit tracker"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** button → **New repository**
3. Enter repository name: `enx-blue`
4. Choose visibility: **Public** or **Private**
5. **DO NOT** initialize with README (we already have one)
6. Click **Create repository**

### Step 3: Connect and Push

After creating the repository, GitHub will show you commands. Use this:

```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/enx-blue.git

# Push to main branch
git branch -M main
git push -u origin main
```

**Done!** Your code is now on GitHub.

---

## Part 2: Deployment Options

### Option 1: Vercel (Recommended - Free & Easy)

**Best for:** Automatic deployments, custom domains, serverless functions

1. Go to [Vercel](https://vercel.com) and sign up with GitHub
2. Click **Add New Project**
3. Import your `enx-blue` repository
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**

**Features:**
- ✅ Automatic deploy on every git push
- ✅ Free SSL certificate
- ✅ Custom domain support
- ✅ Global CDN

---

### Option 2: Netlify (Free & Popular)

**Best for:** Simple drag-and-drop deployment

#### Method A: Connect to GitHub
1. Go to [Netlify](https://netlify.com) and sign up
2. Click **Add new site** → **Import an existing project**
3. Choose GitHub → Select `enx-blue` repo
4. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**

#### Method B: Manual Upload
1. Run `npm run build` locally
2. Go to Netlify → **Sites** → **Add new site** → **Deploy manually**
3. Drag and drop the `dist` folder

---

### Option 3: GitHub Pages (Free)

**Best for:** Simple static sites, already using GitHub

#### Step 1: Update vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/enx-blue/',  // Add this line for GitHub Pages
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

#### Step 2: Install gh-pages package

```bash
npm install --save-dev gh-pages
```

#### Step 3: Update package.json

Add these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://YOUR_USERNAME.github.io/enx-blue"
}
```

#### Step 4: Deploy

```bash
npm run deploy
```

Your site will be at: `https://YOUR_USERNAME.github.io/enx-blue`

---

### Option 4: Cloudflare Pages (Free)

**Best for:** Fast global CDN, unlimited bandwidth

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Click **Create a project** → **Connect to Git**
3. Select your GitHub account → Choose `enx-blue`
4. Configure build:
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click **Save and Deploy**

---

### Option 5: Render (Free)

1. Go to [Render](https://render.com)
2. Click **New** → **Static Site**
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
5. Click **Create Static Site**

---

## Quick Reference Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages (if configured)
npm run deploy
```

---

## Environment Variables (Optional)

If you need environment variables, create a `.env` file:

```env
# Example: Analytics API key
VITE_ANALYTICS_KEY=your_key_here
```

Access in code:
```typescript
const apiKey = import.meta.env.VITE_ANALYTICS_KEY;
```

---

## Troubleshooting

### Build fails on deployment
- Check `vite.config.ts` has correct base path
- Ensure `dist` folder is created after build
- Verify build command is `npm run build`

### 404 errors after deployment
- For GitHub Pages: Make sure `base: '/enx-blue/'` matches your repo name
- Check that all assets use relative paths

### Local storage data lost
- LocalStorage is domain-specific
- Data won't transfer between localhost and deployed site
- Consider adding export/import feature for data backup

---

## Recommended Workflow

1. **Develop locally:** `npm run dev`
2. **Build and test:** `npm run build && npm run preview`
3. **Commit changes:** `git add . && git commit -m "message"`
4. **Push to GitHub:** `git push origin main`
5. **Auto-deploy:** Vercel/Netlify will deploy automatically

---

## Need Help?

- **Vite docs:** https://vitejs.dev/guide/static-deploy.html
- **React deployment:** https://create-react-app.dev/docs/deployment/
- **GitHub Pages:** https://pages.github.com/
