"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  currentImage?: string;
  className?: string;
}

export function CloudinaryUpload({
  onUploadSuccess,
  onUploadError,
  currentImage,
  className = "",
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || "");
  const [isDragOver, setIsDragOver] = useState(false);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      onUploadError?.("Vui lòng chọn file hình ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onUploadError?.("Kích thước file phải nhỏ hơn 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset || "");
      formData.append("folder", "vocafy/avatars");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // Clean up preview URL
      URL.revokeObjectURL(preview);

      // Set the uploaded image URL
      setPreviewUrl(data.secure_url);
      onUploadSuccess(data.secure_url);
    } catch (error) {
      console.error("Upload error:", error);
      onUploadError?.("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
      setPreviewUrl(currentImage || "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const clearImage = () => {
    setPreviewUrl("");
    onUploadSuccess("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>Ảnh đại diện</Label>

      {/* Preview Area */}
      {previewUrl ? (
        <div className="relative w-32 h-32 mx-auto">
          <Image
            src={previewUrl}
            alt="Preview"
            width={128}
            height={128}
            className="w-full h-full rounded-full object-cover border-4 border-primary/20"
            priority
          />
          {!isUploading && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={clearImage}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        /* Upload Area */
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
            ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:border-primary hover:bg-primary/5"}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() =>
            !isUploading && document.getElementById("avatar-upload")?.click()
          }
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Đang tải ảnh...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Kéo thả ảnh vào đây hoặc click để chọn
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF tối đa 5MB
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <Input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
        disabled={isUploading}
      />
    </div>
  );
}
