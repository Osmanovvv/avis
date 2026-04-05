import { useState, useRef, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import FadeIn from "@/components/FadeIn";

interface VideoTab {
  id: string;
  label: string;
  src: string;
  poster: string;
}

const tabs: VideoTab[] = [
  {
    id: "promo",
    label: "Имиджевое видео",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "",
  },
  {
    id: "overview",
    label: "Обзор решений",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    poster: "",
  },
];

const thumbnails = [
  { id: "t1", title: "Периметровые барьеры", time: "0:45", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
  { id: "t2", title: "Защитные сетки", time: "1:12", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
  { id: "t3", title: "Радарные комплексы", time: "0:58", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" },
  { id: "t4", title: "Комплексная защита", time: "2:03", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
];

const VideoShowcase = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [currentSrc, setCurrentSrc] = useState(tabs[0].src);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  const activeTabData = tabs.find((t) => t.id === activeTab)!;

  const playVideo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play();
    setIsPlaying(true);
    setShowOverlay(false);
  }, []);

  const pauseVideo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setIsPlaying(false);
    setShowOverlay(true);
  }, []);

  const togglePlay = useCallback(() => {
    isPlaying ? pauseVideo() : playVideo();
  }, [isPlaying, playVideo, pauseVideo]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const goFullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
  }, []);

  const switchVideo = useCallback((src: string) => {
    setCurrentSrc(src);
    setIsPlaying(false);
    setIsMuted(true);
    setShowOverlay(true);
    setTimeout(() => {
      const v = videoRef.current;
      if (v) {
        v.muted = true;
        v.load();
      }
    }, 50);
  }, []);

  const handleTabChange = useCallback((val: string) => {
    setActiveTab(val);
    const tab = tabs.find((t) => t.id === val);
    if (tab) switchVideo(tab.src);
  }, [switchVideo]);

  const handleMouseEnter = useCallback(() => {
    const v = videoRef.current;
    if (v && !isPlaying) {
      v.muted = true;
      setIsMuted(true);
      v.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleMouseLeave = useCallback(() => {
    const v = videoRef.current;
    if (v && isPlaying && isMuted) {
      v.pause();
      setIsPlaying(false);
      setShowOverlay(true);
    }
  }, [isPlaying, isMuted]);

  return (
    <section className="border-b border-border/60">
      <div className="container py-section-mobile md:py-section-tablet lg:py-section">
        <FadeIn>
          <div className="mb-6 md:mb-8 max-w-xl">
            <h2>Видео решений</h2>
            <p className="mt-2.5 text-muted-foreground leading-relaxed">
              Посмотрите, как работают наши системы защиты на реальных объектах
            </p>
          </div>
        </FadeIn>

        {/* Tabs */}
        <FadeIn delay={0.05}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-5">
            <TabsList className="bg-secondary/80">
              {tabs.map((t) => (
                <TabsTrigger key={t.id} value={t.id} className="text-[13px]">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </FadeIn>

        {/* Main content: video + text */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Video player */}
            <div
              className="lg:col-span-3 relative rounded-lg overflow-hidden bg-foreground/5 group cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={togglePlay}
            >
              <div className="aspect-[16/9]">
                <video
                  ref={videoRef}
                  src={currentSrc}
                  muted={isMuted}
                  loop
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                  onEnded={() => { setIsPlaying(false); setShowOverlay(true); }}
                />
              </div>

              {/* Play overlay */}
              {showOverlay && (
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 transition-opacity">
                  <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
                    <Play className="h-6 w-6 md:h-7 md:w-7 ml-0.5" />
                  </div>
                </div>
              )}

              {/* Controls bar */}
              <div
                className="absolute bottom-0 left-0 right-0 flex items-center gap-2 p-2.5 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={togglePlay}
                  className="flex h-11 w-11 items-center justify-center rounded-md text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
                  aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="flex h-11 w-11 items-center justify-center rounded-md text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
                  aria-label={isMuted ? "Включить звук" : "Выключить звук"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <div className="flex-1" />
                <button
                  onClick={goFullscreen}
                  className="flex h-11 w-11 items-center justify-center rounded-md text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Полный экран"
                >
                  <Maximize className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Text panel */}
            <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
              <h3 className="text-lg font-medium text-foreground">{activeTabData.label}</h3>
              <p className="text-[14px] text-muted-foreground leading-relaxed">
                {activeTab === "promo"
                  ? "Узнайте, как наши инженерные решения обеспечивают комплексную защиту критической инфраструктуры от беспилотных угроз. Реальные объекты, реальные результаты."
                  : "Детальный обзор каждого продукта: принцип действия, характеристики, варианты конфигурации и примеры внедрения на объектах различных отраслей."}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Реальные объекты и испытания
                </div>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Инженерный разбор решений
                </div>
                <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Результаты внедрения
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Thumbnails */}
        <FadeIn delay={0.15}>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {thumbnails.map((thumb) => (
              <button
                key={thumb.id}
                aria-label={`Воспроизвести: ${thumb.title}`}
                onClick={() => switchVideo(thumb.src)}
                className={`group/thumb relative rounded-lg overflow-hidden border transition-all duration-200 hover:shadow-card-hover ${
                  currentSrc === thumb.src
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-border/60 hover:border-primary/40"
                }`}
              >
                <div className="aspect-[16/9] bg-secondary">
                  <video
                    src={thumb.src}
                    muted
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/10 group-hover/thumb:bg-foreground/20 transition-colors">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/80 text-primary-foreground">
                      <Play className="h-5 w-5 ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-[12px] font-medium text-foreground leading-snug">{thumb.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{thumb.time}</p>
                </div>
              </button>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default VideoShowcase;
