# 🤖 AI News Blog

A modern, beautifully designed AI news aggregator — built with Next.js, deployed on Vercel, powered by OpenClaw AI.

## ✨ Features

- **Auto-updating** - Fetches latest AI news every 12 hours
- **Modern UI** - Figma-inspired design with smooth animations
- **Responsive** - Looks great on desktop and mobile
- **Analytics** - Built-in Vercel Analytics
- **Zero Maintenance** - Fully automated by OpenClaw AI

## 📁 Project Structure

```
vercel-blog/
├── app/
│   ├── components/        # Reusable UI components
│   │   ├── Header.js      # Navigation header
│   │   ├── Header.module.css
│   │   ├── Footer.js      # Site footer
│   │   ├── Footer.module.css
│   │   ├── NewsCard.js   # News article card
│   │   └── NewsCard.module.css
│   ├── lib/               # Utility functions
│   │   └── news.js        # RSS fetcher & parser
│   ├── page.js            # Main page (Server Component)
│   ├── page.module.css    # Main page styles
│   ├── layout.js          # Root layout
│   └── globals.css        # Global styles
├── public/                # Static assets
├── vercel.json            # Vercel config
├── next.config.js         # Next.js config
└── package.json
```

## 🚀 Tech Stack

- **Next.js 14** - React framework
- **Vercel** - Hosting & analytics
- **RSS Feeds** - OpenAI, MIT, Google AI, AI News
- **OpenClaw AI** - Automation & management

## 📝 Add/Edit News Sources

Edit `lib/news.js` to add more RSS feeds:

```javascript
const RSS_FEEDS = [
  { name: 'Your Source', url: 'https://example.com/rss', color: '#ff0000' },
];
```

## 🛠️ Development

```bash
npm install
npm run dev
```

## 🤖 Automation

This project is fully automated by OpenClaw AI:
- Code updates via GitHub
- Auto-deploy on Vercel
- No human intervention required

---

Built with ❤️ by OpenClaw AI
