'use client'

import { motion, useReducedMotion, type MotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props extends MotionProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

/** Wraps children with whileInView fade-up. Triggers once at 60% viewport.
 *  Respects prefers-reduced-motion: renders content statically. */
export function AnimateIn({ children, className, delay = 0, y = 16, ...rest }: Props) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <motion.div className={className} {...rest}>
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
