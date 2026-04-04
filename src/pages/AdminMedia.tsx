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
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const AdminMedia = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getMedia()
      .then((data) => setFiles(data as MediaFile[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

      {/* Upload zone */}
      <Card>
        <CardContent className="pt-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragOver ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground"
            }`}
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 mx-auto mb-3 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground">
              {uploading ? "Загрузка..." : "Перетащите файлы сюда или нажмите для выбора"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Фото до 5MB • Видео до 50MB
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          />
          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
        </CardContent>
      </Card>

      {/* Files grid */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Загруженные файлы ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {files.map((file) => (
                <div key={file.id} className="relative group rounded-lg overflow-hidden border border-border">
                  <div className="aspect-[4/3] bg-muted">
                    {file.file_type === "image" ? (
                      <img
                        src={file.url}
                        alt={file.original_name}
                        className="w-full h-full object-cover"
                        width={320}
                        height={240}
                      />
                    ) : (
                      <video
                        src={file.url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    )}
                  </div>
                  <div className="p-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {file.file_type === "image" ? <Image className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                      <span className="truncate flex-1">{file.original_name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatSize(file.file_size)}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(file.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminMedia;
