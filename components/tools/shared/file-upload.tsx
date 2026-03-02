"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface FileUploadProps {
  title: string;
  description: string;
  icon: string;
  acceptedFormats: string[];
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  className?: string;
  selectedFiles?: File[]; // New prop to allow parent to control selected files
}

const FileUpload = ({
  title,
  description,
  icon,
  acceptedFormats,
  onFilesSelected,
  multiple = false,
  className = "",
  selectedFiles: externalSelectedFiles,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Sync with external selected files if provided
  useEffect(() => {
    if (externalSelectedFiles) {
      setSelectedFiles(externalSelectedFiles);
    }
  }, [externalSelectedFiles]);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const newFiles = multiple ? [...selectedFiles, ...files] : files;
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles = multiple ? [...selectedFiles, ...files] : files;
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };
  
  const renderFilePreview = (file: File, index: number) => {
    const isImage = file.type.startsWith('image/');
    
    return (
      <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-gray-800/50 p-2 rounded-md mb-2">
        <div className="flex items-center">
          {isImage ? (
            <div className="w-10 h-10 relative mr-2 overflow-hidden rounded">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-full object-cover"
                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center mr-2">
              <span className="text-xl">📄</span>
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => removeFile(index)}
          className="ml-2 text-red-400 hover:text-red-300 p-1"
        >
          ✕
        </button>
      </div>
    );
  };
  
  return (
    <div className={`bg-card/50 backdrop-blur-sm shadow-lg rounded-lg p-6 ${className}`}>
      <div 
        className={`border-2 ${isDragging ? 'border-purple-400 bg-purple-900/20' : 'border-dashed border-white/20'} rounded-lg p-6 text-center ${selectedFiles.length > 0 ? 'mb-4' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-secondary/50 border border-white/10 rounded-full flex items-center justify-center">
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        
        {selectedFiles.length === 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {description}
            </p>
            {acceptedFormats.length > 0 && (
              <p className="text-xs text-muted-foreground/70 mb-4">
                Supported formats: {acceptedFormats.join(", ")}
              </p>
            )}
            <label className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded cursor-pointer inline-block hover:from-indigo-600 hover:to-purple-700 transition-all duration-200">
              Select {multiple ? "Files" : "File"}
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileSelect} 
                multiple={multiple}
                accept={acceptedFormats.map(format => `.${format}`).join(",")}
              />
            </label>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              {multiple ? `${selectedFiles.length} files selected` : "File selected"}
            </p>
            <label className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded cursor-pointer inline-block hover:from-indigo-600 hover:to-purple-700 transition-all duration-200">
              Change {multiple ? "Files" : "File"}
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileSelect} 
                multiple={multiple}
                accept={acceptedFormats.map(format => `.${format}`).join(",")}
              />
            </label>
          </>
        )}
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">
            {multiple ? "Selected Files" : "Selected File"}
          </h4>
          <div className="max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => renderFilePreview(file, index))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
