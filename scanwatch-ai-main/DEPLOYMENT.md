# CyberWatch AI - Deployment Guide

## Production Deployment

This guide will help you deploy CyberWatch AI to production environments.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git repository access

## Build for Production

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **The built files will be in the `dist` directory**

## Deployment Options

### 1. Netlify (Recommended)

1. **Connect your repository to Netlify**
2. **Set build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy automatically on push to main branch**

### 2. Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

### 3. GitHub Pages

1. **Add to package.json:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### 4. AWS S3 + CloudFront

1. **Upload dist folder to S3 bucket**
2. **Configure CloudFront distribution**
3. **Set up custom domain (optional)**

### 5. Any Static Hosting

Upload the contents of the `dist` folder to any web server or CDN.

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_URL_SCAN_ENDPOINT=https://your-api-endpoint/webhook/check-url
VITE_IP_SCAN_ENDPOINT=https://your-api-endpoint/webhook/check-ip
VITE_FILE_SCAN_ENDPOINT=https://your-api-endpoint/webhook/check-file
```

## Security Considerations

- All API communications use HTTPS
- Input validation and sanitization implemented
- No sensitive data stored in frontend
- Proper error handling without information disclosure

## Performance Optimization

The application is optimized for production with:
- Code splitting and lazy loading
- Optimized bundle size
- Efficient rendering
- Responsive design

## Monitoring

Consider setting up:
- Error tracking (Sentry, LogRocket)
- Performance monitoring
- Analytics (Google Analytics, Plausible)

## Support

For deployment issues, contact the development team. 