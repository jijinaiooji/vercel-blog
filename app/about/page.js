import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Github, Zap, Terminal, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About - AI News',
  description: 'Learn how this project is managed entirely through Telegram by OpenClaw AI.',
};

const steps = [
  {
    num: 1,
    title: 'User sends a message on Telegram',
    desc: '"Create a Next.js blog for AI news"',
  },
  {
    num: 2,
    title: 'OpenClaw receives the message',
    desc: 'Routes through the Gateway, parsed as a system event',
  },
  {
    num: 3,
    title: 'OpenClaw thinks and plans',
    desc: 'Generates code, creates files, commits to git',
  },
  {
    num: 4,
    title: 'GitHub Actions triggers',
    desc: 'Builds the Next.js app, deploys to Vercel',
  },
  {
    num: 5,
    title: 'User gets the Vercel URL',
    desc: 'Directly in Telegram, no context switching',
  },
];

const techStack = [
  { name: 'Next.js 14', desc: 'React framework' },
  { name: 'Vercel', desc: 'Hosting & serverless' },
  { name: 'GitHub Actions', desc: 'CI/CD automation' },
  { name: 'OpenClaw', desc: 'AI-powered automation' },
  { name: 'Telegram', desc: 'Human-AI interface' },
  { name: 'RSS Feeds', desc: 'AI news aggregation' },
  { name: 'Supabase', desc: 'User authentication' },
  { name: 'Open-Meteo', desc: 'Free weather API' },
];

const features = [
  { title: 'User accounts', desc: 'Sign up/login with Supabase auth' },
  { title: 'Weather by IP', desc: 'Local weather from your IP' },
  { title: 'Dark/Light theme', desc: 'Persistent theme preference' },
  { title: 'Search & filter', desc: 'Find articles instantly' },
  { title: 'Auto-updating news', desc: 'RSS feeds refresh every 12 hours' },
  { title: 'Zero manual deployment', desc: 'Push to GitHub triggers Vercel' },
  { title: 'Serverless API', desc: 'News fetched on-demand, cached at edge' },
  { title: 'Fully open-source', desc: 'Code on GitHub, free to fork' },
];

export default function About() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen pt-20">
        {/* Hero */}
        <section className="py-16 px-4 sm:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Built by AI
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
              OpenClaw AI
            </h1>
            
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
              An open-source AI assistant that lives in your terminal, cloud machines, 
              and messaging apps. It can read files, write code, run commands, and manage infrastructure.
            </p>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-600 dark:text-zinc-400">
              <span>This blog was built entirely through Telegram — no human wrote code.</span>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">
              How It Works
            </h2>
            
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div 
                  key={step.num}
                  className="flex gap-4 p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-semibold">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">
              Tech Stack
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {techStack.map((tech) => (
                <div 
                  key={tech.name}
                  className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                >
                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    {tech.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {tech.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">
              Key Features
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div 
                  key={feature.title}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
              Links
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/jijinaiooji/vercel-blog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                <Github className="w-4 h-4" />
                View Source Code
              </a>
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <Zap className="w-4 h-4" />
                Deploy Your Own
              </a>
              <a
                href="https://github.com/openclaw/openclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <Terminal className="w-4 h-4" />
                Get OpenClaw
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-zinc-900 dark:bg-zinc-950">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Want one?
            </h2>
            <p className="text-zinc-400 mb-6">
              OpenClaw can build anything — websites, apps, infrastructure, 
              automation scripts — just ask on Telegram.
            </p>
            <p className="text-sm text-zinc-500">
              Status: This project was entirely written, committed, 
              and deployed through AI conversation. No human touched a terminal or code.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
