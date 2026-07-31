import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { en } from '@/shared/constants/locales/en';
import { ROUTES } from '@/shared/constants/routes';
import { staggerChildren, fadeInUp } from '@/shared/utils/animations';
import { getIcon } from '@/shared/utils/iconRegistry';
import heroBanner from '@/assets/images/banner.png';

export function HeroSection() {
  return (
    <section className="relative left-1/2 -mx-[50vw] w-screen overflow-hidden bg-neutral-950 text-white">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={heroBanner}
          alt=""
          fetchPriority="high"
          decoding="async"
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
            <span className="text-primary-500">{en.marketing.heroHeadlineHighlight}</span>
            <br />
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

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 sm:grid-cols-4"
        >
          {en.marketing.trustBadges.map((badge) => {
            const Icon = getIcon(badge.icon);
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
