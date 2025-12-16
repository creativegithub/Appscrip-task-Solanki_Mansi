# Deployment Guide - AppScript Product Discovery Page

## Project Overview
This is a Next.js 16 application with TypeScript, featuring:
- **Server-Side Rendering (SSR)** for optimal SEO
- **Responsive Design** for mobile, tablet, and desktop
- **Minimal JavaScript** - CSS modules only, no external UI frameworks
- **SEO Optimizations** including meta tags, schema markup, H1/H2 tags
- **Optimized DOM** with semantic HTML

## Prerequisites
- Node.js 18+ installed
- GitHub account (for version control)
- Netlify account (free tier available)

## Deployment Steps

### 1. Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Configure git user
git config user.email "your-email@example.com"
git config user.name "Your Name"

# Commit changes
git commit -m "Initial commit: Product discovery page with SSR and SEO optimization"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/appscrip-products.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Deploy to Netlify

#### Option A: Connect GitHub Repository (Recommended)
1. Go to https://netlify.com and sign in
2. Click "Add new site" → "Import an existing project"
3. Select GitHub and authorize Netlify
4. Choose your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Click "Deploy site"

#### Option B: Manual Deployment
1. Build the project locally:
   ```bash
   npm run build
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Deploy:
   ```bash
   netlify deploy --prod --dir=.next
   ```

### 3. Verify Deployment
- Check the Netlify dashboard for deployment status
- Visit your live URL (e.g., https://appscrip-products.netlify.app)
- Test responsive design on mobile/tablet
- Verify SEO meta tags in page source

## Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout with SEO metadata
│   ├── page.tsx            # Main page (SSR)
│   ├── globals.css         # Global styles
│   └── page.module.css     # Page-specific styles
└── components/
    ├── Header.tsx          # Header with top banner
    ├── Header.module.css
    ├── Hero.tsx            # Hero section
    ├── Hero.module.css
    ├── ProductGrid.tsx     # Product grid with 18 items
    ├── ProductGrid.module.css
    ├── ProductCard.tsx     # Individual product card
    ├── ProductCard.module.css
    ├── Footer.tsx          # Footer with newsletter
    └── Footer.module.css

public/
└── products/               # Product placeholder images (SVG)
```

## SEO Features Implemented
✅ Page title and description
✅ Meta tags (viewport, theme-color, canonical)
✅ H1 and H2 tags for content hierarchy
✅ Schema markup (WebSite schema)
✅ Open Graph tags for social sharing
✅ Twitter card tags
✅ Alt text on all images
✅ SEO-friendly image names

## Performance Optimizations
✅ Minimal DOM size
✅ CSS modules for scoped styling
✅ No external JS packages (except Next.js/React)
✅ Lazy loading on product images
✅ Static generation with SSR
✅ Optimized bundle size

## Responsive Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## Features
- Sticky header with animated banner
- 4-column product grid (responsive)
- Product cards with hover effects
- Newsletter subscription form
- Social media links
- Language selector
- Search, wishlist, and account icons

## Environment Variables
No environment variables required for basic deployment.

## Support
For issues or questions, refer to:
- Next.js Documentation: https://nextjs.org/docs
- Netlify Documentation: https://docs.netlify.com
