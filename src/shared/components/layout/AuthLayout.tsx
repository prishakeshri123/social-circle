import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopBar } from '@/shared/components/layout/TopBar';
import { fadeInUp } from '@/shared/utils/animations';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TopBar />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="w-full max-w-md rounded-2xl border border-border bg-surface-raised p-8 shadow-card"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
