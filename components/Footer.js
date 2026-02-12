'use client';

import Link from 'next/link';
import { Github, Zap, Terminal, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  
  const footerLinks = {
    product: [
      { label: 'Latest', href: '/' },
      { label: 'About', href: '/about' },
    ],
    resources: [
      { label: 'GitHub', href: 'https://github.com/jijinaiooji/vercel-blog', icon: Github },
      { label: 'Star us on GitHub ⭐', href: 'https://github.com/jijinaiooji/vercel-blog', icon: Github },
    ],
    share: [
      { label: 'Share on X', href: 'https://twitter.com/intent/tweet?text=Check+out+this+AI+News+aggregator&url=https://vercel-blog-beige-five.vercel.app', icon: Twitter, color: 'text-black dark:text-white' },
      { label: 'Share on Facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=https://vercel-blog-beige-five.vercel.app', icon: Facebook, color: 'text-blue-600' },
    ],
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white dark:text-zinc-900" />
              </div>
              <span className="font-semibold text-zinc-900 dark:text-white">
                AI News
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Curated AI news from the world's leading research labs and companies.
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              © {year} AI News
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-medium text-zinc-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-medium text-zinc-900 dark:text-white mb-4">Open Source</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-2"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Share */}
          <div>
            <h4 className="font-medium text-zinc-900 dark:text-white mb-4">Share</h4>
            <ul className="space-y-3">
              {footerLinks.share.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-2 ${link.color || ''}`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label.replace('Share on ', '')}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              © {year} AI News • Open Source on GitHub
            </p>
            <a 
              href="https://github.com/jijinaiooji/vercel-blog" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              ⭐ Star us on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
