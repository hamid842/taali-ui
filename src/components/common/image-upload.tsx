import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useUploadProfileImage, useUploadSchoolLogo } from "@/hooks/use-upload";

interface ImageUploadProps {
  onImageChange: (url: string | null) => void;
  existingImageUrl?: string | null;
  uploadType: "school-logo" | "profile-image";
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  onImageChange,
  existingImageUrl,
  uploadType,
  className,
  disabled = false,
}: ImageUploadProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingImageUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: uploadSchoolLogo } = useUploadSchoolLogo();
  const { mutate: uploadProfileImage } = useUploadProfileImage();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert(t("upload.invalidType"));
      return;
    }

    // Validate file size
    const maxSize =
      uploadType === "school-logo" ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(t("upload.fileTooLarge"));
      return;
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload file
    setIsUploading(true);
    const uploadMutation =
      uploadType === "school-logo" ? uploadSchoolLogo : uploadProfileImage;

    uploadMutation(file, {
      onSuccess: (response) => {
        onImageChange(response.url);
        setIsUploading(false);
      },
      onError: (error) => {
        console.error("Upload failed:", error);
        setPreviewUrl(null);
        setIsUploading(false);
        alert(t("upload.failed"));
      },
    });
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        disabled={disabled || isUploading}
      />

      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
          />
          {!isUploading && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemoveImage}
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors",
            disabled || isUploading
              ? "border-gray-300 bg-gray-100 cursor-not-allowed"
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
          )}
          onClick={handleClick}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
        </div>
      )}

      <div className="text-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled || isUploading}
        >
          {isUploading ? t("common.uploading") : t("upload.chooseImage")}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          {uploadType === "school-logo"
            ? t("upload.schoolLogoHint")
            : t("upload.profileImageHint")}
        </p>
      </div>
    </div>
  );
}
