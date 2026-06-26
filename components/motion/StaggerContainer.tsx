"use client";

import { motion, useReducedMotion } from "motion/react";
import { containerVariants } from "@/lib/animations";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function StaggerContainer({ children, className }: Props) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}
