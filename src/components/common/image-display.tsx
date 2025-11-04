import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Image as ImageIcon } from "lucide-react";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
  
interface ImageDisplayProps {
  imageUrl: string | undefined;
  alt?: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function ImageDisplay({
  imageUrl,
  alt = "Image",
  className,
  size = "md",
}: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

    const sizeClasses = {
      xs:"w-10 h-10",
    sm: "w-16 h-16",
    md: "w-32 h-32",
    lg: "w-48 h-48",
    xl: "w-64 h-64",
  };

  // Reset loading state when imageUrl changes
  useEffect(() => {
    setIsLoading(true);
    setError(false);
  }, [imageUrl]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  if (!imageUrl) {
    return (
      <div
        className={cn(
          "border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50",
          sizeClasses[size],
          className
        )}
      >
        <ImageIcon className="h-8 w-8 text-gray-400" />
      </div>
    );
  }

  // Construct full URL if it's a relative path
  const getFullImageUrl = (url: string) => {
    if (url.startsWith("http")) {
      return url;
    }
    // Assuming your backend is running on localhost:8080
    return `${API_BASE_URL}${url}`;
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
        </div>
      )}

      {error ? (
        <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
          <ImageIcon className="h-8 w-8 text-gray-400" />
          <span className="text-xs text-gray-500 ml-2">Failed to load</span>
        </div>
      ) : (
        <img
          src={getFullImageUrl(imageUrl)}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover rounded-lg border-2 border-gray-200 transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        />
      )}
    </div>
  );
}
