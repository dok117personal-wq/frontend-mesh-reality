import React from "react";

export interface ProcessingStep {
  id: number;
  name: string;
  status: "waiting" | "in-progress" | "completed" | "pending" | "error";
  progress?: number; // 0-100
}

interface ProcessingStatusProps {
  steps: ProcessingStep[];
}

const ProcessingStatus = ({ steps }: ProcessingStatusProps) => {
  const getStatusColor = (status: ProcessingStep["status"]) => {
    switch (status) {
      case "waiting":
        return "bg-gray-600";
      case "in-progress":
        return "bg-indigo-500";
      case "completed":
        return "bg-emerald-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusText = (status: ProcessingStep["status"]) => {
    switch (status) {
      case "waiting":
        return "Waiting for input";
      case "in-progress":
        return "In progress";
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "error":
        return "Error";
      default:
        return "Pending";
    }
  };

  return (
    <div className="bg-card/50 p-4 rounded-lg border border-white/10 shadow-lg backdrop-blur-sm">
      <h3 className="font-medium mb-4">Processing Status</h3>
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full ${
                step.status === "completed" 
                  ? "bg-emerald-500 text-white" 
                  : step.status === "in-progress" 
                    ? "bg-indigo-500 text-white" 
                    : step.status === "error" 
                      ? "bg-red-500 text-white" 
                      : "bg-gray-600 text-white"
              } flex items-center justify-center mr-3`}
            >
              {step.status === "completed" ? "✓" : step.id}
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="font-medium">{step.name}</span>
                <span className="text-muted-foreground text-sm">
                  {step.status === "in-progress" && typeof step.progress === "number"
                    ? `${step.progress}%`
                    : getStatusText(step.status)}
                </span>
              </div>
              <div className="w-full bg-background/80 rounded-full h-2">
                <div 
                  className={`${getStatusColor(step.status)} h-2 rounded-full transition-all duration-300 ${step.status === "in-progress" ? "animate-pulse" : ""}`} 
                  style={{ width: `${step.progress ?? (step.status === "completed" ? 100 : 0)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessingStatus;
