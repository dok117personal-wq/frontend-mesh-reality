"use client";

import { Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  className?: string;
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
  isDragAccept: boolean;
  isDragReject: boolean;
  fileCount: number;
}

export function Dropzone({
  className,
  getRootProps,
  getInputProps,
  isDragActive,
  isDragAccept,
  isDragReject,
  fileCount
}: DropzoneProps) {
  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-lg transition-colors cursor-pointer",
        isDragActive ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700",
        isDragAccept && "border-green-500 bg-green-50 dark:bg-green-900/20",
        isDragReject && "border-red-500 bg-red-50 dark:bg-red-900/20",
        className
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-2 p-4 text-center">
        {isDragActive ? (
          <>
            <Upload className="h-10 w-10 text-primary" />
            <p className="text-sm text-muted-foreground">
              Drop the images here...
            </p>
          </>
        ) : (
          <>
            {fileCount > 0 ? (
              <>
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {fileCount} {fileCount === 1 ? 'image' : 'images'} selected
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag and drop more images here, or click to select
                </p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop images here, or click to select
                </p>
                <p className="text-xs text-muted-foreground">
                  For best results, upload at least 30 images
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Dropzone;
