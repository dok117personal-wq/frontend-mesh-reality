import React from "react";

export interface Step {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

interface HowItWorksProps {
  title?: string;
  steps: Step[];
  className?: string;
}

const HowItWorks = ({
  title = "How It Works",
  steps,
  className = "",
}: HowItWorksProps) => {
  return (
    <div className={`bg-gradient-to-r from-indigo-950/30 to-purple-950/30 rounded-xl p-8 md:p-12 border border-white/10 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text text-transparent">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.id} className="bg-card/50 p-6 rounded-lg border border-white/10 shadow-lg backdrop-blur-sm">
            <div className="w-12 h-12 bg-secondary/50 border border-white/10 rounded-full flex items-center justify-center mb-4">
              {step.icon ? (
                <span className="text-xl">{step.icon}</span>
              ) : (
                <span className="text-xl">{step.id}</span>
              )}
            </div>
            <h3 className="font-bold mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
