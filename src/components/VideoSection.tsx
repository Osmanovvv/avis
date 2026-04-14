import { useState, useRef, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import FadeIn from "@/components/FadeIn";
import { useContent } from "@/hooks/use-content";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  src: string;
  poster: string;
}

const videos: VideoItem[] = [
  {
    id: "promo",
    title: "Имиджевое видео",
    description: "Как наши инженерные решения обеспечивают комплексную защиту критической инфраструктуры от беспилотных угроз.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "/images/nets-main.jpg",
  },
  {
    id: "overview",
    title: "Обзор решений",
    description: "Детальный обзор каждого продукта: принцип действия, характеристики и примеры внедрения на объектах.",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "/images/nets-main.jpg",
  },
];

const VideoPlayer = ({ video }: { video: VideoItem }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const isMobile = useIsMobile();

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.pause();
      setPlaying(false);
      setShowOverlay(true);
    } else {
      v.play();
      setPlaying(true);
      setShowOverlay(false);
    }
  }, [playing]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(!muted);
  }, [muted]);

  const goFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative rounded-lg overflow-hidden cursor-pointer group"
        style={{
          background: "#141720",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
        onClick={togglePlay}
      >
        <div className="aspect-[16/9]">
          <video
            ref={videoRef}
            src={video.src}
            poster={video.poster}
            muted={muted}
            loop
            playsInline
            preload="none"
            className="h-full w-full object-cover"
            onEnded={() => { setPlaying(false); setShowOverlay(true); }}
          />
        </div>

        {/* Play overlay */}
        {showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center transition-opacity"
            style={{ background: "rgba(8,10,14,0.35)" }}
          >
            <div
              className="flex items-center justify-center rounded-full transition-transform group-hover:scale-110"
              style={{
                width: isMobile ? 52 : 64,
                height: isMobile ? 52 : 64,
                border: "1.5px solid rgba(255,255,255,0.6)",
                background: "rgba(8,10,14,0.4)",
                backdropFilter: "blur(4px)",
              }}
            >
              <Play className="h-5 w-5 md:h-6 md:w-6 ml-0.5" style={{ color: "#fff" }} />
            </div>
          </div>
        )}

        {/* Controls bar */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center gap-2 p-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "linear-gradient(to top, rgba(8,10,14,0.7), transparent)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={togglePlay}
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
            style={{ color: "#fff" }}
            aria-label={playing ? "Пауза" : "Воспроизвести"}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </button>
          <button
            onClick={toggleMute}
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
            style={{ color: "#fff" }}
            aria-label={muted ? "Включить звук" : "Выключить звук"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <div className="flex-1" />
          <button
            onClick={goFullscreen}
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
            style={{ color: "#fff" }}
            aria-label="Полный экран"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Title + description below */}
      <div>
        <h3 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: "#fff", margin: 0 }}>
          {video.title}
        </h3>
        <p style={{ fontSize: 13, color: "#7a8394", marginTop: 6, lineHeight: 1.5 }}>
          {video.description}
        </p>
      </div>
    </div>
  );
};

const VideoSection = () => {
  const { content } = useContent();
  const slots = content?.videoSlots;
  const effectiveVideos: VideoItem[] = [
    {
      ...videos[0],
      src: slots?.video01_mp4?.trim() || videos[0].src,
      poster: slots?.video01_poster?.trim() || videos[0].poster,
    },
    {
      ...videos[1],
      src: slots?.video02_mp4?.trim() || videos[1].src,
      poster: slots?.video02_poster?.trim() || videos[1].poster,
    },
  ];
  const isMobile = useIsMobile();

  return (
    <section style={{ background: "#090b0e" }}>
      <div
        className="mx-auto"
        style={{
          maxWidth: 1200,
          padding: isMobile ? "48px 20px" : "80px 40px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <FadeIn>
          <div style={{ marginBottom: isMobile ? 24 : 32 }}>
            <h2
              style={{
                fontSize: "0.6875rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#4a7fa5",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Видео решений
            </h2>
            <p style={{ fontSize: 14, color: "#7a8394", marginTop: 8 }}>
              Посмотрите, как работают наши системы защиты на реальных объектах
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className={`grid gap-5 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            {effectiveVideos.map((video) => (
              <VideoPlayer key={video.id} video={video} />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default VideoSection;
