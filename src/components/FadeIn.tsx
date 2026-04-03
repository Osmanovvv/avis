import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  direction = "up",
  className,
  ...props
}) => {
  const directionMap = {
    up: { y: 12, x: 0 },
    down: { y: -12, x: 0 },
    left: { y: 0, x: 12 },
    right: { y: 0, x: -12 },
  };

  const offset = directionMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
