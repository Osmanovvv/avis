import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Upload, Image, Film } from "lucide-react";

interface MediaFile {
  id: string;
  name: string;
  type: "image" | "video";
  size: number;
  url: string;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const AdminMedia = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((fileList: FileList) => {
    setError("");
    const newFiles: MediaFile[] = [];

    Array.from(fileList).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        setError("Допустимы только изображения и видео");
        return;
      }

      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
      if (file.size > maxSize) {
        setError(`${file.name}: превышен лимит ${isImage ? "5MB" : "50MB"}`);
        return;
      }

      newFiles.push({
        id: crypto.randomUUID(),
        name: file.name,
        type: isImage ? "image" : "video",
        size: file.size,
        url: URL.createObjectURL(file),
      });
    });

    if (newFiles.length) {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.url);
      return prev.filter((f) => f.id !== id);
    });
  };

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
            <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Перетащите файлы сюда или нажмите для выбора
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
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
          <p className="text-xs text-muted-foreground mt-3">
            Файлы хранятся в текущей сессии браузера. Постоянное хранение будет доступно после подключения хранилища.
          </p>
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
                  {/* Preview */}
                  <div className="aspect-[4/3] bg-muted">
                    {file.type === "image" ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
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

                  {/* Info */}
                  <div className="p-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {file.type === "image" ? <Image className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                      <span className="truncate flex-1">{file.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatSize(file.size)}</p>
                  </div>

                  {/* Delete button */}
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
