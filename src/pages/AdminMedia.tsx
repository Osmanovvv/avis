import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Upload, Image, Film, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface MediaFile {
  id: number;
  filename: string;
  original_name: string;
  file_type: "image" | "video";
  file_size: number;
  url: string;
  category?: string;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

/* ── Slot uploader for video poster/mp4 ── */
function SlotUploader({
  label,
  accept,
  maxMB,
  currentUrl,
  onUpload,
  onDelete,
}: {
  label: string;
  accept: string;
  maxMB: number;
  currentUrl: string;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const isVideo = accept.startsWith("video");

  const handle = async (file: File) => {
    if (file.size > maxMB * 1024 * 1024) {
      setError(`Максимум ${maxMB}MB`);
      return;
    }
    setError("");
    setUploading(true);
    try {
      await onUpload(file);
    } catch {
      setError("Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-muted-foreground block">{label}</label>
      {currentUrl ? (
        <div className="relative group rounded-lg overflow-hidden border border-border inline-block">
          <div className="w-48 h-32 bg-muted">
            {isVideo ? (
              <video src={currentUrl} className="w-full h-full object-cover" muted playsInline />
            ) : (
              <img src={currentUrl} alt={label} className="w-full h-full object-cover" width={192} height={128} />
            )}
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => ref.current?.click()}
          className="w-48 h-32 border-2 border-dashed border-border hover:border-muted-foreground rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          ) : (
            <>
              <Upload className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-[11px] text-muted-foreground">До {maxMB}MB</span>
            </>
          )}
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); e.target.value = ""; }}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ── Settings for video slots stored in content ── */
const VIDEO_SLOTS_KEY = "videoSlots";

interface VideoSlots {
  video01_poster: string;
  video01_mp4: string;
  video02_poster: string;
  video02_mp4: string;
}

const defaultSlots: VideoSlots = {
  video01_poster: "",
  video01_mp4: "",
  video02_poster: "",
  video02_mp4: "",
};

const AdminMedia = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [slots, setSlots] = useState<VideoSlots>(defaultSlots);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      api.getMedia().then((data) => setFiles(data as MediaFile[])),
      api.getContent().then((data: any) => {
        if (data[VIDEO_SLOTS_KEY]) setSlots({ ...defaultSlots, ...data[VIDEO_SLOTS_KEY] });
      }),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveSlots = async (updated: VideoSlots) => {
    setSlots(updated);
    await api.updateContent(VIDEO_SLOTS_KEY, updated);
  };

  const handleSlotUpload = async (slotKey: keyof VideoSlots, file: File) => {
    const result = await api.uploadMedia(file);
    await saveSlots({ ...slots, [slotKey]: result.url });
  };

  const handleSlotDelete = async (slotKey: keyof VideoSlots) => {
    await saveSlots({ ...slots, [slotKey]: "" });
  };

  /* ── General upload ── */
  const uploadFiles = useCallback(async (fileList: FileList) => {
    setError("");
    setUploading(true);

    for (const file of Array.from(fileList)) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        setError("Допустимы только изображения и видео");
        continue;
      }

      const maxSize = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(`${file.name}: превышен лимит ${isImage ? "5MB" : "50MB"}`);
        continue;
      }

      try {
        const result = await api.uploadMedia(file);
        setFiles((prev) => [
          {
            id: result.id,
            filename: "",
            original_name: file.name,
            file_type: isImage ? "image" : "video",
            file_size: file.size,
            url: result.url,
          },
          ...prev,
        ]);
      } catch {
        setError(`Ошибка загрузки ${file.name}`);
      }
    }

    setUploading(false);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.deleteMedia(id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch {
      setError("Ошибка удаления");
    }
  };

  if (loading) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Загрузка...</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-xl font-light">Медиафайлы</h1>

      {/* Video slots */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Видеоплеер — ролик 01</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <SlotUploader
            label="Poster (изображение)"
            accept="image/*"
            maxMB={5}
            currentUrl={slots.video01_poster}
            onUpload={(f) => handleSlotUpload("video01_poster", f)}
            onDelete={() => handleSlotDelete("video01_poster")}
          />
          <SlotUploader
            label="Видео (MP4)"
            accept="video/mp4"
            maxMB={50}
            currentUrl={slots.video01_mp4}
            onUpload={(f) => handleSlotUpload("video01_mp4", f)}
            onDelete={() => handleSlotDelete("video01_mp4")}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Видеоплеер — ролик 02</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <SlotUploader
            label="Poster (изображение)"
            accept="image/*"
            maxMB={5}
            currentUrl={slots.video02_poster}
            onUpload={(f) => handleSlotUpload("video02_poster", f)}
            onDelete={() => handleSlotDelete("video02_poster")}
          />
          <SlotUploader
            label="Видео (MP4)"
            accept="video/mp4"
            maxMB={50}
            currentUrl={slots.video02_mp4}
            onUpload={(f) => handleSlotUpload("video02_mp4", f)}
            onDelete={() => handleSlotDelete("video02_mp4")}
          />
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default AdminMedia;
