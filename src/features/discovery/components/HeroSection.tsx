import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { CATEGORIES } from '@/shared/constants/categories';
import { staggerChildren, fadeInUp } from '@/shared/utils/animations';
import { cn } from '@/shared/utils/cn';

const iconMap = Icons as unknown as Record<string, LucideIcon>;

const [heroLine1, heroLine2] = en.marketing.heroHeadline.split('. ');

interface CollageCard {
  categorySlug: (typeof CATEGORIES)[number]['slug'];
  top: string;
  left: string;
  rotate: number;
  size: number;
  delay: number;
}

const COLLAGE_CARDS: CollageCard[] = [
  { categorySlug: 'music', top: '8%', left: '6%', rotate: -10, size: 84, delay: 0 },
  { categorySlug: 'photography', top: '4%', left: '78%', rotate: 8, size: 76, delay: 0.4 },
  { categorySlug: 'travel', top: '20%', left: '20%', rotate: 12, size: 64, delay: 0.8 },
  { categorySlug: 'tech', top: '14%', left: '60%', rotate: -8, size: 72, delay: 1.2 },
  { categorySlug: 'food', top: '62%', left: '10%', rotate: 9, size: 80, delay: 0.2 },
  { categorySlug: 'fitness', top: '70%', left: '84%', rotate: -12, size: 72, delay: 0.6 },
  { categorySlug: 'arts', top: '78%', left: '30%', rotate: -6, size: 60, delay: 1 },
  { categorySlug: 'social', top: '66%', left: '68%', rotate: 6, size: 64, delay: 1.4 },
];

export function HeroSection() {
  return (
    <section className="marketing-dark relative overflow-hidden rounded-3xl bg-background px-6 py-24 text-center sm:py-32">
      <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden="true">
        {COLLAGE_CARDS.map((card) => {
          const category = CATEGORIES.find((c) => c.slug === card.categorySlug);
          if (!category) return null;
          const Icon = iconMap[category.icon] ?? Icons.Circle;
          return (
            <div
              key={card.categorySlug}
              className="animate-float-card absolute flex items-center justify-center rounded-2xl border border-border-strong bg-surface-raised shadow-lg"
              style={
                {
                  top: card.top,
                  left: card.left,
                  width: card.size,
                  height: card.size,
                  '--card-rotate': `${card.rotate}deg`,
                  transform: `rotate(${card.rotate}deg)`,
                  animationDelay: `${card.delay}s`,
                  opacity: 0.85,
                } as CSSProperties
              }
            >
              <Icon
                className="text-primary-500"
                style={{ width: card.size * 0.32, height: card.size * 0.32 }}
              />
            </div>
          );
        })}
      </div>

      <motion.div
        className="relative mx-auto max-w-2xl"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <motion.span
          variants={fadeInUp}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-secondary"
        >
          <Sparkles className="size-3.5 text-primary-500" aria-hidden="true" />
          {en.marketing.statsClubsValue} {en.marketing.statsClubsLabel.toLowerCase()}
        </motion.span>

        <motion.h1
          variants={fadeInUp}
          className="mt-6 text-5xl font-bold tracking-tight text-text-primary sm:text-7xl"
        >
          {heroLine1}.
          <br />
          <span className="gradient-text">{heroLine2}</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-5 max-w-xl text-base text-text-secondary sm:text-lg"
        >
          {en.marketing.heroSubheadline}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            asChild
            size="lg"
            className={cn('rounded-full bg-white px-7 text-neutral-900 hover:bg-neutral-200')}
          >
            <a href="#club-grid">{en.marketing.heroExploreCta}</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-border-strong bg-transparent px-7 text-text-primary hover:bg-surface"
          >
            <Link to={ROUTES.search}>{en.marketing.heroBrowseEventsCta}</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
