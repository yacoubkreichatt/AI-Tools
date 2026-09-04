# Hostinger Production Deployment Guide — AI Tools Hub

This guide provides exact, step-by-step instructions for deploying **AI Tools Hub** to **Hostinger**.

The application utilizes a **dual-architecture design**:
- **Option 1: Static Web Hosting (Hostinger Premium, Business, or Single Shared Hosting)**
  - Runs 100% of the frontend, UI, routing, SEO, LocalStorage, and the high-speed **instant local template engine**.
  - Requires **no Node.js server** to maintain.
  - Zero server maintenance, zero API cost, and instant page speeds via LiteSpeed Web Server.
- **Option 2: Hybrid Full-Stack (Hostinger Cloud Hosting or VPS with Node.js)**
  - Runs the Express API backend (`server.ts` compiled to `dist/server.cjs`) to proxy Gemini AI requests while serving static assets.
  - Seamlessly fails over to the instant local engine if the API key is unconfigured, rate-limited, or times out.

---

## 1. Required Hostinger Plan & Specifications

| Deployment Type | Recommended Hostinger Plan | Node.js Required? | Best For |
| :--- | :--- | :--- | :--- |
| **Option 1: Static Deployment** *(Easiest)* | Premium Shared, Business Shared, or Single Hosting | **No** (Build locally or via CI, deploy static files) | Rapid launch, $0 API bill, AdSense monetization, unlimited instant generations |
| **Option 2: Node.js / Hybrid** | Cloud Startup, Cloud Professional, or KVM VPS | **Yes** (Node.js 20.x or 22.x LTS) | When server-side Gemini 3.8 Flash AI generation is desired alongside local engine |

---

## 2. Runtime & Node.js Requirements

If using **Option 2 (Node.js / VPS)**:
- **Node.js**: `v20.x` or `v22.x` (Active LTS)
- **Package Manager**: `npm` (v10+)
- **Build System**: Vite 6 + Tailwind CSS 4 + esbuild
- **Memory**: Minimum 512 MB RAM (1 GB recommended)

---

## 3. Build & Start Commands

```bash
# 1. Install production and dev dependencies
npm install

# 2. Build production assets (Compiles both static Vite frontend and server.cjs)
npm run build

# 3. Start command (Only applicable for Node.js / VPS mode)
npm start
# (Runs: node dist/server.cjs)
```

**Build Output Directory:**
All production assets are compiled into the `/dist` directory:
- `dist/index.html` (Application HTML entry)
- `dist/assets/` (Hashed JavaScript and CSS bundles)
- `dist/.htaccess` (Apache/LiteSpeed SPA rewrite rules)
- `dist/robots.txt` (Search crawler directives)
- `dist/sitemap.xml` (Full XML sitemap of all 10 tools and policy pages)
- `dist/manifest.json` (Web App Manifest)
- `dist/server.cjs` (Compiled Node.js Express server for VPS/Node mode)

---

## 4. Environment Variables Configuration

Create a `.env` file (or set variables in Hostinger hPanel **Advanced → Environment Variables**):

```env
# ==============================================================================
# PRIVATE SERVER-SIDE VARIABLES (Never exposed to the client/browser)
# ==============================================================================
# Required ONLY if deploying with Node.js backend to enable Gemini AI API:
GEMINI_API_KEY=your_gemini_api_key_here

# Port for Node.js server (Default: 3000):
PORT=3000

# ==============================================================================
# PUBLIC CLIENT-SIDE VARIABLES (Prefixed with VITE_, baked during npm run build)
# ==============================================================================
# Set your production domain for canonical URLs, Open Graph tags, and JSON-LD schema:
VITE_SITE_URL=https://yourdomain.com
```

> **Security Rule:** Never prefix `GEMINI_API_KEY` with `VITE_`. The client-side bundle does not contain and must never contain the Gemini API key.

---

## 5. Recommended Deployment (Static Hosting to public_html/)

This is the recommended, fastest, and most reliable deployment method on Hostinger.

### Step-by-Step Procedure:

1. **Build project**: Run `npm run build` to generate the production `/dist` directory.
2. **Open `dist/`**: Locate your compiled `/dist` directory.
3. **Upload the CONTENTS of `dist/` to `public_html/`**: In Hostinger File Manager or via FTP, upload the files inside `dist/` directly into `public_html/` (not the `dist` folder itself).
4. **Ensure `.htaccess` is uploaded**: Enable "Show Hidden Files" in Hostinger File Manager and confirm `public_html/.htaccess` is present.
5. **Enable SSL/HTTPS**: In Hostinger hPanel under **Security**, install the free Let's Encrypt SSL and toggle **Force HTTPS** ON.
6. **Open website**: Visit your domain (`https://YOUR-DOMAIN.com`) in your browser.
7. **Test homepage**: Confirm the hero, categories, search, and tools grid load instantly.
8. **Test all 10 tool URLs**: Open tool pages directly (e.g., `/tools/tiktok-hook-generator`, `/tools/business-name-generator`).
9. **Test browser refresh on tool URLs**: Press F5 or Ctrl+R on any tool page to verify LiteSpeed `.htaccess` URL rewriting routes correctly without 404 errors.

---

### Contents of `public_html/` Verification:
```
public_html/
  ├── assets/
  │    ├── index-[hash].js
  │    └── index-[hash].css
  ├── .htaccess
  ├── index.html
  ├── manifest.json
  ├── robots.txt
  └── sitemap.xml
```
*(Note: `server.cjs` is only used if running in Node.js mode and is ignored by static web hosting).*

---

### Method B: Node.js Deployment (Hostinger Cloud or VPS)

If your Hostinger account includes **Node.js Application Manager** or a **VPS**:

#### Using Hostinger hPanel Node.js Application:
1. In hPanel, go to **Advanced** → **Node.js**.
2. Click **Create Application**.
3. Configure the fields:
   - **Node.js version**: Select `20.x` or `22.x`.
   - **Application mode**: `Production`.
   - **Application root**: `/home/uXXXX/public_html` (or your chosen directory).
   - **Application startup file**: `dist/server.cjs` (or `server.ts` with `tsx`).
4. Set Environment Variables:
   - `GEMINI_API_KEY`: `your_key_here`
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
5. Upload project files, run `npm install`, `npm run build`, and click **Restart Application**.

#### Using Hostinger KVM VPS (Ubuntu 22.04 / 24.04 with PM2 and Nginx):
1. **Connect via SSH:**
   ```bash
   ssh root@your_server_ip
   ```
2. **Install Node.js 22 LTS & PM2:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```
3. **Deploy project to `/var/www/aitoolshub`:**
   ```bash
   git clone <your-repo-url> /var/www/aitoolshub
   cd /var/www/aitoolshub
   npm install
   npm run build
   ```
4. **Start PM2 process manager:**
   ```bash
   pm2 start dist/server.cjs --name "aitoolshub"
   pm2 save
   pm2 startup
   ```
5. **Configure Nginx reverse proxy** to forward port 80/443 to `http://127.0.0.1:3000`.

---

## 6. Domain Setup & DNS Configuration

1. In Hostinger hPanel, go to **Domains** or **DNS Zone Editor**.
2. Verify DNS records:
   - **A Record**: Host `@` pointing to your Hostinger server IP address.
   - **CNAME Record**: Host `www` pointing to `@` (or `yourdomain.com`).
3. If using Cloudflare or an external registrar, point the nameservers to Hostinger:
   - `ns1.dns-parking.com`
   - `ns2.dns-parking.com`

---

## 7. SSL Certificate Setup

1. In Hostinger hPanel, search for **SSL**.
2. Select your domain and click **Install SSL** (Hostinger provides free lifetime Let's Encrypt SSL certificates).
3. Toggle ON **Force HTTPS** under **Websites → Dashboard → Security** to ensure all traffic redirects securely to `https://`.

---

## 8. Apache / LiteSpeed `.htaccess` Configuration

The application includes an optimized `.htaccess` file inside `public/.htaccess` which is automatically copied to `dist/.htaccess` during the build.

It handles:
1. **SPA Client-Side Deep Linking**: Routes direct hits to `/tools/*`, `/categories/*`, etc., back to `index.html`.
2. **Security Headers**: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
3. **Static Asset Caching**: 1-year cache headers for immutable hashed assets (`.js`, `.css`), fonts, and images.
4. **Gzip / Brotli Compression**: Enabled automatically on LiteSpeed.

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>
```

---

## 9. Gemini API & Dual-Engine Failover

- When the application detects that the backend `/api/generate` is unavailable (or if deployed as a pure static site without Node.js), it **automatically falls back to the client-side local template engine**.
- In local mode, generation is **instant (0 ms)**, 100% deterministic, and requires **no external API calls or billing**.
- When falling back, the UI informs the user:
  > *"AI generation is currently unavailable. Using instant generation mode."*
- When a valid `GEMINI_API_KEY` is configured in Node.js mode, it uses Google's `gemini-2.5-flash` model.

---

## 10. Post-Deployment Verification Checklist

After deploying to Hostinger, verify these 10 checkpoints in your browser:

- [ ] **Homepage**: Visit `https://yourdomain.com/` — page loads with full hero, category pills, and tools grid.
- [ ] **Direct Deep Link**: Visit `https://yourdomain.com/tools/tiktok-hook-generator` directly in a fresh tab. Verify it opens the tool workspace without a 404 error.
- [ ] **Browser Refresh**: Press F5 / Ctrl+R while on a tool page. Verify the page reloads cleanly.
- [ ] **Input & Generation**: Fill out the form and click **Generate**. Verify output appears with actionable results.
- [ ] **Single & All Copy**: Click the copy icon on an output and click **Copy All**. Verify the clipboard notification fires.
- [ ] **TXT Export**: Click **Download TXT**. Verify the formatted file is saved to your computer.
- [ ] **Social Share**: Click **Share**. Verify the native share or fallback modal opens with active copy links.
- [ ] **Search Modal**: Press `Cmd+K` / `Ctrl+K` or click the search icon. Search for "YouTube" and verify live filtering.
- [ ] **Sitemap & Robots**:
  - Visit `https://yourdomain.com/sitemap.xml` (all 10 tools present).
  - Visit `https://yourdomain.com/robots.txt` (crawlers allowed).
- [ ] **Legal & Policy Pages**: Click the footer links for **Privacy Policy**, **Terms**, and **Cookie Policy** to confirm compliance.

---

## 11. Common Errors & Troubleshooting

| Issue / Symptom | Root Cause | Solution |
| :--- | :--- | :--- |
| **404 Not Found when opening `/tools/...` directly or refreshing** | `.htaccess` file was not uploaded to `public_html/` or hidden files are not enabled. | In Hostinger File Manager, enable **Show Hidden Files** (cog icon). Ensure `.htaccess` exists in `public_html` with the rewrite rules intact. |
| **Blank white screen on visit** | Asset paths are incorrect or old cached files exist. | Clear browser cache with Ctrl+Shift+R. Verify `assets/` folder was uploaded to `public_html/assets/`. |
| **"AI generation is currently unavailable. Using instant generation mode."** | The Gemini API key is not configured or rate-limited. | **This is expected behavior** in static mode or when no API key is provided. The local engine ensures the app remains 100% functional. To enable Gemini AI, configure `GEMINI_API_KEY` in your Hostinger Node.js environment. |
| **Hostinger LiteSpeed 500 Internal Server Error** | Syntax error in custom `.htaccess` directives. | Ensure `public_html/.htaccess` matches the clean rewrite block provided in this repository. |
| **Changes not visible after upload** | Hostinger LiteSpeed Cache or browser caching is serving old files. | In Hostinger hPanel, go to **Performance** → **LiteSpeed** → Click **Purge All Cache**. |

---

## 12. AdSense Readiness Verification

The site is built in compliance with Google AdSense Publisher Policies:
- Clean, uncluttered layout with authentic user utilities.
- Seven required informational and legal pages (`/about`, `/contact`, `/privacy-policy`, `/terms`, `/cookie-policy`, `/disclaimer`, `/affiliate-disclosure`).
- Mobile-first responsiveness tested across 320px to 4K displays.
- Zero deceptive elements, zero fake download buttons, zero forced interactions.
- Valid Schema.org structured data (JSON-LD) for `WebApplication`, `BreadcrumbList`, and `FAQPage`.
