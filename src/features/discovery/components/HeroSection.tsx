import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, MapPin, Search, Users2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { CATEGORIES } from '@/shared/constants/categories';
import { CITIES } from '@/shared/constants/cities';
import { staggerChildren, fadeInUp } from '@/shared/utils/animations';

const iconMap = Icons as unknown as Record<string, LucideIcon>;

const ALL_CATEGORIES_VALUE = 'all';
const ALL_LOCATIONS_VALUE = 'all';

export interface HeroSearchParams {
  search?: string;
  category?: string;
  city?: string;
}

interface HeroSectionProps {
  onSearch: (params: HeroSearchParams) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL_CATEGORIES_VALUE);
  const [city, setCity] = useState(ALL_LOCATIONS_VALUE);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch({
      search: query.trim() || undefined,
      category: category === ALL_CATEGORIES_VALUE ? undefined : category,
      city: city === ALL_LOCATIONS_VALUE ? undefined : city,
    });
    document.getElementById('browse-clubs')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="relative left-1/2 -mx-[50vw] w-screen overflow-hidden bg-neutral-950 text-white">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="https://picsum.photos/seed/social-circle-hero/1920/1080"
          alt=""
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/55 to-neutral-950/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-14 pt-28 sm:px-6 sm:pt-36">
        <motion.div
          className="max-w-xl"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.span
            variants={fadeInUp}
            className="inline-flex items-center rounded-full border border-primary-500/40 bg-primary-600/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur"
          >
            {en.marketing.heroEyebrow}
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="mt-5 text-4xl font-bold leading-tight tracking-tight [text-shadow:0_2px_16px_rgb(0_0_0_/_0.45)] sm:text-6xl"
          >
            {en.marketing.heroHeadlineLine1}
            <br />
            <span className="text-primary-500">{en.marketing.heroHeadlineHighlight}</span>{' '}
            {en.marketing.heroHeadlineLine2Suffix}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-4 max-w-md text-base text-neutral-300 [text-shadow:0_1px_12px_rgb(0_0_0_/_0.5)]"
          >
            {en.marketing.heroSubheadline}
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href="/clubs">
                {en.marketing.heroExploreCta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <Link to={ROUTES.services}>
                {en.marketing.heroCreateClubCta}
                <Users2 className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.form
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          onSubmit={handleSubmit}
          className="mt-10 flex w-full flex-col gap-2 rounded-2xl bg-surface-raised p-3 text-text-primary shadow-modal sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary-500"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={en.marketing.heroSearchPlaceholder}
              aria-label={en.marketing.heroSearchPlaceholder}
              className="border-border pl-9 shadow-none focus-visible:ring-0"
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              className="border-border bg-background sm:w-48"
              aria-label={en.marketing.heroSearchAllCategories}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES_VALUE}>
                {en.marketing.heroSearchAllCategories}
              </SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={city} onValueChange={setCity}>
            <SelectTrigger
              className="border-border bg-background sm:w-44"
              aria-label={en.marketing.heroSearchAllLocations}
            >
              <span className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-primary-500" aria-hidden="true" />
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_LOCATIONS_VALUE}>
                {en.marketing.heroSearchAllLocations}
              </SelectItem>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" size="lg" className="sm:px-8">
            {en.marketing.heroSearchCta}
          </Button>
        </motion.form>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4"
        >
          {en.marketing.trustBadges.map((badge) => {
            const Icon = iconMap[badge.icon] ?? Icons.Circle;
            return (
              <motion.div key={badge.title} variants={fadeInUp} className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon className="size-4 text-primary-500" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{badge.title}</span>
                  <span className="block text-xs text-neutral-400">{badge.subtitle}</span>
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
