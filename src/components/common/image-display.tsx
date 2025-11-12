import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Image as ImageIcon } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

interface ImageDisplayProps {
  imageUrl?: string;
  alt?: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fallbackText?: string; 
}

export function ImageDisplay({
  imageUrl,
  alt = "Image",
  className,
  size = "md",
  fallbackText,
}: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const sizeClasses = {
    xs: "h-8 w-8",
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32",
  };

  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false); 
      setError(false);
      return;
    }
    setIsLoading(true);
    setError(false);
  }, [imageUrl]);

  const handleLoad = () => setIsLoading(false);
  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  const getFullImageUrl = (url: string) =>
    url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  return (
    <Avatar
      className={cn(
        sizeClasses[size],
        className,
        "border-2 border-gray-200 shadow-sm"
      )}
    >
      {imageUrl && !error ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-full">
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            </div>
          )}
          <AvatarImage
            src={getFullImageUrl(imageUrl)}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "object-cover transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
          />
        </>
      ) : (
        <AvatarFallback className="bg-gray-100 text-gray-500 flex items-center justify-center text-sm font-medium">
          {error ? (
            <ImageIcon className="h-5 w-5 text-gray-400" />
          ) : (
            fallbackText ?? alt[0]?.toUpperCase() ?? "?"
          )}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
