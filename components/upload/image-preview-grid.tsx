"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewGridProps {
  images: File[];
  onRemove?: (index: number) => void;
}

export function ImagePreviewGrid({ images, onRemove }: ImagePreviewGridProps) {
  const [objectUrls, setObjectUrls] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState<boolean[]>([]);
  const [errorStates, setErrorStates] = useState<boolean[]>([]);

  useEffect(() => {
    // Create object URLs for all images
    const urls = images.map(file => URL.createObjectURL(file));
    setObjectUrls(urls);
    setLoadingStates(new Array(images.length).fill(true));
    setErrorStates(new Array(images.length).fill(false));

    // Cleanup function to revoke object URLs
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleImageLoad = (index: number) => {
    setLoadingStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
  };

  const handleImageError = (index: number) => {
    setLoadingStates(prev => {
      const newStates = [...prev];
      newStates[index] = false;
      return newStates;
    });
    setErrorStates(prev => {
      const newStates = [...prev];
      newStates[index] = true;
      return newStates;
    });
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((file, index) => {
        const url = objectUrls[index];
        if (!url) return null;
        return (
          <div
            key={`${file.name}-${index}`}
            className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square"
          >
            {loadingStates[index] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              </div>
            )}

            {errorStates[index] ? (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
                <p className="text-sm text-red-500 dark:text-red-400 text-center p-2">
                  Failed to load image
                </p>
              </div>
            ) : (
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="object-cover w-full h-full transition-opacity"
                style={{ opacity: loadingStates[index] ? 0 : 1 }}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
              />
            )}

            {onRemove && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                onClick={() => onRemove(index)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </Button>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
              {file.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ImagePreviewGrid;
