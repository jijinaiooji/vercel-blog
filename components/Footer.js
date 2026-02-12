'use client';

import Link from 'next/link';
import { Github, Zap, Twitter, Facebook } from 'lucide-react';

// Simple Mastodon SVG icon
function MastodonIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-6.151.309C3.355.703.903 2.734.553 5.312c-.143.992-.118 2.012.046 2.987-.126.563-.196 1.17-.196 1.79 0 3.41 2.575 6.286 6.326 6.286 2.857 0 5.373-1.556 6.26-3.906.34.118.686.196 1.05.196 2.38 0 4.566-1.93 4.566-4.437 0-1.08-.38-2.06-1.005-2.837.26-.58.405-1.216.405-1.893 0-1.33-.566-2.494-1.425-3.315zm-6.292 14.83H9.808v-8.088c-1.45-1.734-3.635-2.51-5.254-2.51-1.597 0-3.178.776-3.635 2.292-.69 2.28-.27 4.633 1.054 5.992v1.378c0 .656.03 1.268.09 1.932h3.953v-.378c-.54-.69-.81-1.487-.81-2.366 0-1.78 1.18-2.688 2.95-2.688 1.78 0 2.94.908 2.94 2.688 0 .878-.27 1.675-.81 2.366v.378h3.79l-.04-1.84zm8.07-10.97c-.55.55-1.37.78-2.45.78-1.05 0-1.94-.24-2.45-.75-.55-.55-.78-1.37-.78-2.45 0-1.08.23-1.94.75-2.45.55-.55 1.4-.78 2.45-.78 1.08 0 1.94.23 2.5.75.55.51.78 1.37.78 2.45 0 1.08-.23 1.94-.78 2.45z"/>
    </svg>
  );
}

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
      { label: 'Share on Mastodon', href: 'https://mastodon.social/share?text=Check+out+this+AI+News+aggregator&url=https://vercel-blog-beige-five.vercel.app', icon: MastodonIcon, color: 'text-purple-600' },
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
