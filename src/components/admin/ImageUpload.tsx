import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label: string;
  currentImage?: string | null;
  onUpload: (file: File) => Promise<void>;
  onRemove?: () => Promise<void>;
  disabled?: boolean;
  aspectRatio?: "square" | "video" | "auto";
  maxSizeMB?: number;
}

export function ImageUpload({
  label,
  currentImage,
  onUpload,
  onRemove,
  disabled = false,
  aspectRatio = "auto",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona una imagen válida");
      return;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`La imagen no puede superar los ${maxSizeMB}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      setPreview(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!onRemove) return;

    setIsUploading(true);
    try {
      await onRemove();
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error removing image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "aspect-auto",
  }[aspectRatio];

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="flex items-start gap-4">
        {/* Preview */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg overflow-hidden bg-muted/50",
            aspectRatioClass,
            preview ? "border-primary/50" : "border-border",
            "w-full max-w-xs"
          )}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt={label}
                className="w-full h-full object-cover"
              />
              {onRemove && !disabled && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={handleRemove}
                  disabled={isUploading}
                >
                  <X className="size-4" />
                </Button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-6 text-center">
              <ImageIcon className="size-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No hay imagen seleccionada
              </p>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            className="hidden"
            id={`image-upload-${label}`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
          >
            <Upload className="size-4 mr-2" />
            {isUploading ? "Subiendo..." : preview ? "Cambiar" : "Subir"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Máx. {maxSizeMB}MB
            <br />
            JPG, PNG, WebP
          </p>
        </div>
      </div>
    </div>
  );
}
