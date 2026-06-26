"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { itemVariants, headingVariants } from "@/lib/animations";

type Props = Omit<HTMLMotionProps<"div">, "variants"> & {
  variant?: "default" | "heading";
};

export default function StaggerItem({
  variant = "default",
  children,
  ...rest
}: Props) {
  const variants = variant === "heading" ? headingVariants : itemVariants;

  return (
    <motion.div variants={variants} {...rest}>
      {children}
    </motion.div>
  );
}
