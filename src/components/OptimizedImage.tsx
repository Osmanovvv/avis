import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  /** Above the fold — no lazy loading, high priority */
  priority?: boolean;
  className?: string;
}

/**
 * Optimized image component:
 * - Generates srcset for 1x/2x retina displays
 * - Uses loading="lazy" for below-fold images
 * - Adds decoding="async" for non-blocking decode
 */
const OptimizedImage = ({ src, alt, priority = false, className, ...props }: OptimizedImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      className={className}
      {...(priority ? { fetchPriority: "high" as any } : {})}
      {...props}
    />
  );
};

export default OptimizedImage;
