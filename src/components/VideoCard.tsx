import { useState, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface VideoCardProps {
  src?: string;
  poster: string;
  title: string;
  number: string;
  large?: boolean;
  posterFilter?: string;
}

const VideoCard = ({ src, poster, title, number, posterFilter }: VideoCardProps) => {
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();

  const handleToggle = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!src) {
      setShowNotice(true);
      setTimeout(() => setShowNotice(false), 2500);
      return;
    }
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  }, [playing, src]);

  const handlePause = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (videoRef.current) {
      videoRef.current.pause();
      setPlaying(false);
    }
  }, []);

  const btnSize = isMobile ? 48 : 56;

  return (
    <div
      className="relative overflow-hidden rounded-lg cursor-pointer w-full h-full"
      style={{
        background: "#141720",
        border: `1px solid rgba(255,255,255,${hovered && !playing ? 0.15 : 0.07})`,
        transition: "border-color 0.2s ease",
      }}
      onClick={handleToggle}
      onTouchEnd={isMobile ? handleToggle : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Video element */}
      {src && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          // @ts-ignore — WebKit/x5 compat attrs
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="none"
          onEnded={() => setPlaying(false)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: playing ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Poster image */}
      <img
        src={poster}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: playing ? 0 : 1,
          transition: "opacity 0.3s ease",
          filter: posterFilter || "brightness(0.6) saturate(0.5)",
        }}
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(8,10,14,0.8) 0%, transparent 50%)",
        }}
      />

      {/* Play button */}
      {!playing && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          style={{
            width: btnSize,
            height: btnSize,
            borderRadius: "50%",
            border: `1.5px solid rgba(255,255,255,${hovered ? 0.9 : 0.6})`,
            background: `rgba(8,10,14,${hovered ? 0.6 : 0.4})`,
            backdropFilter: "blur(4px)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        </div>
      )}

      {/* Mobile pause indicator — top-right */}
      {playing && isMobile && (
        <div
          onClick={handlePause}
          onTouchEnd={handlePause}
          className="absolute flex items-center justify-center"
          style={{
            top: 12,
            right: 12,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(8,10,14,0.55)",
            cursor: "pointer",
          }}
        >
          <svg width="10" height="12" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        </div>
      )}

      {/* "Video coming soon" notice */}
      {showNotice && (
        <div
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
          style={{
            bottom: 60,
            background: "rgba(20,23,32,0.95)",
            border: "1px solid rgba(74,127,165,0.4)",
            borderRadius: 6,
            padding: "8px 16px",
            fontSize: 12,
            color: "#c0cdd8",
            zIndex: 20,
          }}
        >
          Видео скоро будет добавлено
        </div>
      )}

      {/* Bottom label */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center"
        style={{ padding: isMobile ? "12px 16px" : "16px 20px", gap: 10 }}
      >
        <span style={{ fontSize: isMobile ? 12 : 11, fontWeight: 400, color: "#4a7fa5", letterSpacing: "0.08em" }}>
          {number}
        </span>
        <span style={{ fontSize: isMobile ? 13 : 14, fontWeight: 300, color: "#c0cdd8", letterSpacing: "0.03em" }}>
          {title}
        </span>
      </div>
    </div>
  );
};

export default VideoCard;
