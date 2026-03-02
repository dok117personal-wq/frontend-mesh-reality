import { useCallback, useState } from 'react';
import { useDropzone, FileRejection, DropzoneOptions } from 'react-dropzone';
import { toast } from 'sonner';

interface UseMultiImageDropzoneProps {
  onDrop?: (files: File[]) => void;
  maxSize?: number;
  maxFiles?: number;
}

export function useMultiImageDropzone({
  onDrop,
  maxSize = 100 * 1024 * 1024, // 100MB
  maxFiles = 100
}: UseMultiImageDropzoneProps = {}) {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach(({ file, errors }) => {
          errors.forEach(error => {
            let message = '';
            switch (error.code) {
              case 'file-too-large':
                message = `File ${file.name} is too large. Max size is ${maxSize / (1024 * 1024)}MB`;
                break;
              case 'file-invalid-type':
                message = `File ${file.name} has an invalid type. Only images are allowed`;
                break;
              case 'too-many-files':
                message = `Too many files. Maximum is ${maxFiles}`;
                break;
              default:
                message = `Error uploading ${file.name}: ${error.message}`;
            }
            toast.error(message);
          });
        });
      }

      if (acceptedFiles.length > 0) {
        const newFiles = [...files, ...acceptedFiles];
        setFiles(newFiles);
        
        if (onDrop) {
          onDrop(newFiles);
        }
      }
    },
    [files, maxSize, maxFiles, onDrop]
  );

  const removeFile = useCallback((indexToRemove: number) => {
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(newFiles);
    
    if (onDrop) {
      onDrop(newFiles);
    }
  }, [files, onDrop]);

  const clearFiles = useCallback(() => {
    setFiles([]);
    
    if (onDrop) {
      onDrop([]);
    }
  }, [onDrop]);

  const dropzoneOptions: DropzoneOptions = {
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.heif', '.heic', '.webp', '.gif', '.ppm']
    },
    multiple: true,
    maxSize,
    maxFiles,
    noClick: false,
    noKeyboard: false,
    noDrag: false,
    noDragEventsBubbling: false
  };

  const { 
    getRootProps, 
    getInputProps, 
    isDragActive, 
    isDragAccept, 
    isDragReject 
  } = useDropzone(dropzoneOptions);

  return {
    files,
    setFiles,
    removeFile,
    clearFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  };
}

export default useMultiImageDropzone;
