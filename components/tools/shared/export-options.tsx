"use client";

import React, { useState } from "react";

export interface ExportFormat {
  id: string;
  name: string;
  description: string;
  disabled?: boolean;
  proOnly?: boolean;
}

interface ExportOptionsProps {
  formats: ExportFormat[];
  onExport: (formatId: string) => void;
  isProcessing?: boolean;
  isDisabled?: boolean;
  className?: string;
}

const ExportOptions = ({
  formats,
  onExport,
  isProcessing = false,
  isDisabled = false,
  className = "",
}: ExportOptionsProps) => {
  const [selectedFormat, setSelectedFormat] = useState<string>(
    formats.length > 0 ? formats[0].id : ""
  );

  const handleExport = () => {
    if (!isDisabled && !isProcessing) {
      onExport(selectedFormat);
    }
  };

  return (
    <div className={`bg-card/50 p-4 rounded-lg border border-white/10 shadow-lg backdrop-blur-sm ${className}`}>
      <h3 className="font-bold text-lg mb-4">Export Options</h3>
      <div className="space-y-2 mb-4">
        {formats.map((format) => (
          <div key={format.id} className="flex items-center">
            <input
              type="radio"
              id={format.id}
              name="format"
              className="mr-2 accent-indigo-500"
              checked={selectedFormat === format.id}
              onChange={() => setSelectedFormat(format.id)}
              disabled={format.disabled || isDisabled}
            />
            <label htmlFor={format.id} className={format.disabled ? "text-muted-foreground/50" : ""}>
              {format.name}
              {format.description && (
                <span className="text-xs text-muted-foreground ml-2">({format.description})</span>
              )}
              {format.proOnly && (
                <span className="text-xs text-indigo-400 ml-2 font-medium">PRO</span>
              )}
            </label>
          </div>
        ))}
      </div>
      <button
        className={`w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded transition-all duration-200 ${
          isDisabled || isProcessing
            ? "opacity-50 cursor-not-allowed"
            : "hover:from-indigo-600 hover:to-purple-700"
        }`}
        onClick={handleExport}
        disabled={isDisabled || isProcessing}
      >
        {isProcessing ? "Processing..." : "Export"}
      </button>
    </div>
  );
};

export default ExportOptions;
