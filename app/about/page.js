export const metadata = {
  title: 'About - AI News Blog',
  description: 'How this fully automated blog was created and managed entirely via Telegram using OpenClaw AI',
};

export default function About() {
  const prompts = [
    {
      date: '2026-02-12',
      action: 'Created GitHub repo & deployed blog',
      details: [
        '• GitHub repo: jijinaiooji/vercel-blog',
        '• Connected GitHub token via Telegram',
        '• Initialized Next.js blog with RSS feeds',
        '• Linked GitHub Actions for auto-deploy',
      ]
    },
    {
      date: '2026-02-12',
      action: 'AI News Blog Features',
      details: [
        '• Auto-fetches from OpenAI, MIT, Google AI',
        '• Auto-updates every 5 minutes',
        '• Removes duplicates, sorts by date',
        '• Modern Figma-style UI',
      ]
    },
    {
      date: '2026-02-12',
      action: 'Vercel Integration',
      details: [
        '• Deployed via GitHub Actions',
        '• Vercel Analytics enabled',
        '• Auto-deploy on every push',
      ]
    },
  ];

  return `
    <div style="max-width: 1100px; margin: 0 auto; padding: 24px;">
      <h1 style="font-size: 48px; font-weight: 700; margin-bottom: 16px;">
        📌 About This Project
      </h1>
      <p style="font-size: 18px; color: #666; max-width: 600px; margin-bottom: 48px;">
        This blog is fully managed via <strong>Telegram</strong> using OpenClaw AI. 
        Zero manual intervention required.
      </p>

      <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">
        🛠️ Tech Stack
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 48px;">
        <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e5e5e5;">
          <h3 style="font-size: 14px; color: #888; margin-bottom: 8px;">REPO</h3>
          <p style="font-weight: 600;">GitHub</p>
          <p style="font-size: 13px; color: #666;">jijinaiooji/vercel-blog</p>
        </div>
        <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e5e5e5;">
          <h3 style="font-size: 14px; color: #888; margin-bottom: 8px;">HOSTING</h3>
          <p style="font-weight: 600;">Vercel</p>
          <p style="font-size: 13px; color: #666;">Auto-deploy enabled</p>
        </div>
        <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e5e5e5;">
          <h3 style="font-size: 14px; color: #888; margin-bottom: 8px;">FRAMEWORK</h3>
          <p style="font-weight: 600;">Next.js 14</p>
          <p style="font-size: 13px; color: #666;">Server Components</p>
        </div>
        <div style="background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e5e5e5;">
          <h3 style="font-size: 14px; color: #888; margin-bottom: 8px;">CONTROL</h3>
          <p style="font-weight: 600;">Telegram</p>
          <p style="font-size: 13px; color: #666;">Via OpenClaw AI</p>
        </div>
      </div>

      <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">
        📝 Automation History
      </h2>
      <div style="display: flex; flex-direction: column; gap: 24px; margin-bottom: 48px;">
        ${prompts.map(p => `
          <div style="background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e5e5e5;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <span style="background: #2d5bff; color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                ${p.date}
              </span>
              <h3 style="font-weight: 600;">${p.action}</h3>
            </div>
            <ul style="list-style: none; padding: 0;">
              ${p.details.map(d => `<li style="font-size: 14px; color: #666; padding: 4px 0;">${d}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">
        💬 Key Prompts Used
      </h2>
      <div style="background: #1a1a1a; color: #fff; padding: 24px; border-radius: 12px; margin-bottom: 48px;">
        <p style="font-size: 14px; color: #888; margin-bottom: 16px;">
          The entire blog was created using these prompts via Telegram:
        </p>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 12px 0; border-bottom: 1px solid #333;">
            "create a wordpress blog on vercel, empty blog" → Next.js blog structure
          </li>
          <li style="padding: 12px 0; border-bottom: 1px solid #333;">
            "how about all news about ai only?" → Added RSS feeds for AI news
          </li>
          <li style="padding: 12px 0; border-bottom: 1px solid #333;">
            "enable analytics first vercel" → Added Vercel Analytics
          </li>
          <li style="padding: 12px 0; border-bottom: 1px solid #333;">
            "update the interface base on the best ui/ux blog of the world" → Figma-style redesign
          </li>
        </ul>
      </div>

      <h2 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">
        🔒 Security
      </h2>
      <div style="background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e5e5e5;">
        <p style="font-size: 14px; color: #666; line-height: 1.8;">
          All credentials (GitHub tokens, Vercel tokens) are managed securely via Telegram. 
          No passwords are shared in plain text. Tokens are passed temporarily and stored 
          securely in GitHub Secrets for automation.
        </p>
      </div>
    </div>
  `;
}
