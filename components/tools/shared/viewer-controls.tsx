import React from "react";

export interface ControlButton {
  id: string;
  icon: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface ViewerControlsProps {
  controls: ControlButton[];
  className?: string;
}

const ViewerControls = ({ controls, className = "" }: ViewerControlsProps) => {
  return (
    <div className={`bg-card/50 p-4 rounded-lg border border-white/10 shadow-lg backdrop-blur-sm ${className}`}>
      <div className="flex flex-wrap gap-4">
        {controls.map((control) => (
          <button 
            key={control.id}
            onClick={control.onClick}
            className={`px-4 py-2 rounded border flex items-center transition-colors ${
              control.active 
                ? "bg-indigo-900/50 border-indigo-500/50 text-indigo-300" 
                : "bg-background/80 border-white/10 hover:border-white/20"
            }`}
          >
            <span className="mr-2">{control.icon}</span> {control.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewerControls;
