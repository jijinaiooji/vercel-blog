'use client';

import { Sparkles } from 'lucide-react';
import { useMemo } from 'react';

const QUOTES = [
  { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
  { text: "AI will probably most likely lead to the end of the world, but in the good way.", author: "Sam Altman" },
  { text: "I am in favor of AI because I'm lazy and don't want to think for myself.", author: "Mark Zuckerberg" },
  { text: "AI is not a tool, it's a co-pilot for human creativity.", author: "Satya Nadella" },
  { text: "The future is already here – it's just not evenly distributed.", author: "William Gibson" },
  { text: "AI is the new electricity. It will transform every industry.", author: "Andrew Ng" },
  { text: "We're building a society where machines can learn and think.", author: "Yann LeCun" },
  { text: "The biggest risk is not that AI will fail, but that it will succeed.", author: "Elon Musk" },
  { text: "Artificial intelligence is the new electricity.", author: "Andrew Ng" },
  { text: "AI doesn't need to be evil to be dangerous.", author: "Nick Bostrom" },
  { text: "We're entering a new era of human-machine collaboration.", author: "Demis Hassabis" },
  { text: "The real question is, how will humans and AI best work together?", author: "Fei-Fei Li" },
  { text: "Machine learning is the new standard for software.", author: "Jensen Huang" },
  { text: "We're building tools that augment human intelligence.", author: "Dario Amodei" },
  { text: "AI will be the most transformative technology in human history.", author: "Sam Altman" },
  { text: "The key to AI safety is building aligned systems from the start.", author: "Ilya Sutskever" },
  { text: "Code is poetry. AI is the new library of Alexandria.", author: "Demis Hassabis" },
  { text: "Artificial General Intelligence is inevitable. The question is when.", author: "Ray Kurzweil" },
  { text: "We're teaching machines to learn, and that's changing everything.", author: "Jeff Dean" },
  { text: "AI will not replace doctors, but doctors who use AI will replace those who don't.", author: "Eric Topol" },
  { text: "The future belongs to those who can collaborate with machines.", author: "Andrew Ng" },
  { text: "We're building minds, not just tools.", author: "Dario Amodei" },
  { text: "Neural networks are the new transistors of the digital age.", author: "Geoffrey Hinton" },
  { text: "The promise of AI is to amplify human potential.", author: "Satya Nadella" },
  { text: "AI systems are becoming our most powerful tools for understanding.", author: "Yoshua Bengio" },
  { text: "The best AI is the one that helps humans do more.", author: "Sam Altman" },
  { text: "We're creating intelligence to solve humanity's biggest challenges.", author: "Demis Hassabis" },
  { text: "Machine learning is eating software.", author: "Ben Horowitz" },
  { text: "AI is not about replacing humans, it's about enhancing them.", author: "Fei-Fei Li" },
  { text: "The magic of AI is making the impossible possible.", author: "Jensen Huang" },
  { text: "Every company will be an AI company.", author: "Paul Daugherty" },
  { text: "AI is the most important technology of our era.", author: "Elon Musk" },
  { text: "We're building systems that can learn from and adapt to humans.", author: "Ilya Sutskever" },
  { text: "The real value of AI is in its applications to real problems.", author: "Andrew Ng" },
  { text: "Artificial intelligence is becoming infrastructure.", author: "Jensen Huang" },
  { text: "AI is the new assembly line for the digital world.", author: "Dario Amodei" },
  { text: "Machine intelligence is the last invention humanity will ever need.", author: "Nick Bostrom" },
  { text: "We're teaching computers to see, hear, and understand.", author: "Fei-Fei Li" },
  { text: "The future of AI is collaborative, not competitive.", author: "Sam Altman" },
  { text: "AI will change how we work, create, and relate to each other.", author: "Demis Hassabis" },
  { text: "The most powerful technology is the one you don't notice.", author: "John Giannandrea" },
  { text: "Neural nets are the new standard for intelligence.", author: "Geoffrey Hinton" },
  { text: "We're creating a new kind of intelligence on Earth.", author: "Yann LeCun" },
  { text: "AI is the ultimate tool for human augmentation.", author: "Jeff Dean" },
  { text: "The next era is about human-AI collaboration.", author: "Satya Nadella" },
  { text: "Machine learning is the new electricity.", author: "Andrew Ng" },
  { text: "AI systems can learn from the world and help us understand it.", author: "Yoshua Bengio" },
  { text: "We're building AI that benefits everyone.", author: "Sam Altman" },
  { text: "The power of AI is in its ability to scale human effort.", author: "Dario Amodei" },
  { text: "Artificial intelligence is becoming the new operating system.", author: "Paul Daugherty" },
  { text: "The future of computing is intelligent.", author: "Jensen Huang" },
  { text: "We're creating tools that make us more creative.", author: "Demis Hassabis" },
  { text: "AI will solve problems we haven't imagined yet.", author: "Ilya Sutskever" },
  { text: "The key is to build AI that aligns with human values.", author: "Anthropic" },
  { text: "Machine learning is the key to unlocking new possibilities.", author: "Andrew Ng" },
  { text: "We're building a more intelligent world.", author: "Fei-Fei Li" },
  { text: "AI is the ultimate tool for discovery.", author: "Jeff Dean" },
  { text: "The promise of AI is to augment human capabilities.", author: "Satya Nadella" },
  { text: "Neural networks are the foundation of modern AI.", author: "Geoffrey Hinton" },
  { text: "AI will transform every aspect of human life.", author: "Yann LeCun" },
  { text: "We're creating intelligence at scale.", author: "Jensen Huang" },
  { text: "The most powerful AI is the one that helps people.", author: "Sam Altman" },
  { text: "Machine learning is the new programming paradigm.", author: "Dario Amodei" },
  { text: "AI is democratizing intelligence.", author: "Paul Daugherty" },
  { text: "The future is intelligent and inclusive.", author: "Fei-Fei Li" },
  { text: "We're building AI that can learn and adapt.", author: "Demis Hassabis" },
  { text: "Artificial intelligence is the new frontier.", author: "Ilya Sutskever" },
  { text: "AI will help us achieve more than we can alone.", author: "Andrew Ng" },
  { text: "The power of AI is in its ability to process and understand.", author: "Yoshua Bengio" },
  { text: "We're creating tools that enhance human potential.", author: "Jeff Dean" },
  { text: "Machine learning is the engine of the AI revolution.", author: "Jensen Huang" },
  { text: "AI is about making machines smarter for human benefit.", author: "Satya Nadella" },
  { text: "The future of work is human-AI collaboration.", author: "Sam Altman" },
  { text: "We're building intelligence that can help solve global challenges.", author: "Demis Hassabis" },
  { text: "Neural nets are unlocking new capabilities.", author: "Geoffrey Hinton" },
  { text: "AI is the most transformative technology of our time.", author: "Elon Musk" },
  { text: "The goal is to build AI that is helpful and harmless.", author: "Anthropic" },
  { text: "Machine learning enables machines to learn from experience.", author: "Yann LeCun" },
  { text: "We're creating AI that can reason and plan.", author: "Dario Amodei" },
  { text: "AI will be the most important tool of the 21st century.", author: "Andrew Ng" },
  { text: "The future is bright with AI.", author: "Jensen Huang" },
  { text: "We're building a better world with AI.", author: "Fei-Fei Li" },
  { text: "Artificial intelligence is our path to the future.", author: "Satya Nadella" },
  { text: "AI is enabling new forms of creativity.", author: "Jeff Dean" },
  { text: "The revolution is happening now.", author: "Sam Altman" },
  { text: "We're teaching machines to be helpful.", author: "Demis Hassabis" },
  { text: "Neural networks are the new building blocks.", author: "Ilya Sutskever" },
  { text: "AI is the key to solving complex problems.", author: "Paul Daugherty" },
  { text: "Machine learning is transforming industries.", author: "Andrew Ng" },
  { text: "We're creating intelligence that serves humanity.", author: "Yoshua Bengio" },
  { text: "AI will make us more productive and creative.", author: "Jensen Huang" },
  { text: "The best AI is yet to come.", author: "Sam Altman" },
  { text: "We're building tools that empower humans.", author: "Demis Hassabis" },
  { text: "Artificial intelligence is for everyone.", author: "Fei-Fei Li" },
  { text: "AI is the future we create together.", author: "Satya Nadella" },
  { text: "Machine learning is the most exciting field.", author: "Andrew Ng" },
  { text: "We're creating a more intelligent tomorrow.", author: "Jeff Dean" },
  { text: "AI is the new superpower.", author: "Jensen Huang" },
  { text: "The future of AI is bright.", author: "Sam Altman" },
];

export function DailyQuote() {
  const quote = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % QUOTES.length;
    return QUOTES[index];
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-yellow-500 dark:text-yellow-400 mb-4">
      <Sparkles className="w-3.5 h-3.5" />
      <span>"{quote.text}"</span>
      <span className="text-zinc-400">— {quote.author}</span>
    </div>
  );
}
