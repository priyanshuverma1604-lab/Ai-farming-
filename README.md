# 🌱 AI Kisan — Production v2.0

**Empowering Farmers with Artificial Intelligence**

AI Kisan is a full-stack AI-powered agricultural intelligence platform for Indian farmers — built with React + Vite.

---

## ✨ Features

| Feature | Status |
|---|---|
| AI Farm Assistant (real Claude AI) | 🟢 Live |
| AI Crop Doctor (disease detection) | 🟢 Live |
| Live Market Intelligence + Profit Predictor | 🟢 Live |
| Government Schemes Finder | 🟢 Live |
| Daily Farm Command Center | 🟢 Live |
| 12-Language Support | 🟢 Live |
| Satellite NDVI Monitoring | 🟡 Beta |
| Farm Community | 🟡 Beta |
| Mobile App | ⚪ Coming Soon |

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local and add your API keys
```

### 3. Run development server
```bash
npm run dev
# Opens at http://localhost:3000
```

### 4. Build for production
```bash
npm run build
# Output in /dist — deploy this folder
```

---

## 🌐 Deploy to Vercel (Recommended — Free)

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Add your environment variables in Vercel dashboard
5. Click **Deploy** — live in ~60 seconds

---

## 🔑 API Keys You Need

| Service | Purpose | Free Tier | Link |
|---|---|---|---|
| Anthropic | AI Assistant | Pay per use | [console.anthropic.com](https://console.anthropic.com) |
| Supabase | Auth + Database | 500 MB free | [supabase.com](https://supabase.com) |
| OpenWeatherMap | Live weather | 1000 calls/day free | [openweathermap.org](https://openweathermap.org/api) |
| Cashfree | Payments | Free to integrate | [cashfree.com](https://cashfree.com) |

> ⚠️ **Security**: Never expose your Anthropic API key directly in the browser.
> For production, route it through a **Supabase Edge Function** or **Vercel API route**.

---

## 📁 Project Structure

```
ai-kisan/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── App.jsx        ← Main application (all pages + components)
│   ├── main.jsx       ← React entry point
│   └── index.css      ← Global resets
├── .env.example       ← Copy to .env.local with your keys
├── .gitignore
├── index.html         ← SEO meta tags, OG tags
├── package.json
├── vite.config.js
└── README.md
```

---

## 📞 Support

**WhatsApp:** [+91 9610159555](https://wa.me/919610159555)  
**Email:** support@aikisan.in

---

© 2026 AI Kisan. All rights reserved.
