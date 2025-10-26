"use client";

import { motion, AnimatePresence } from "framer-motion";

interface AnimatedTabContentProps {
  value: string | number;
  current: string | number;
  children: React.ReactNode;
}

export function AnimatedTabContent({
  value,
  current,
  children,
}: AnimatedTabContentProps) {
  const isActive = value === current;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={value}
          initial={{ opacity: 0, x: 40 }} // 👉 vem da direita
          animate={{ opacity: 1, x: 0 }} // 👉 chega no centro
          exit={{ opacity: 0, x: -40 }} // 👉 sai para a esquerda
          transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }} // easing Apple
          className="absolute w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
