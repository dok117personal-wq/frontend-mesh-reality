import React from "react";
import ExampleCard from "./example-card";

export interface Example {
  id: string;
  title: string;
  description: string;
  image: string;
  author?: string;
  link: string;
  tags?: string[];
}

interface ExampleGalleryProps {
  title?: string;
  examples: Example[];
  className?: string;
  columns?: 2 | 3 | 4;
}

const ExampleGallery = ({
  title = "Examples",
  examples,
  className = "",
  columns = 3,
}: ExampleGalleryProps) => {
  const getColumnsClass = () => {
    switch (columns) {
      case 2:
        return "md:grid-cols-2";
      case 3:
        return "md:grid-cols-3";
      case 4:
        return "md:grid-cols-4";
      default:
        return "md:grid-cols-3";
    }
  };

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className={`grid grid-cols-1 ${getColumnsClass()} gap-8`}>
        {examples.map((example) => (
          <ExampleCard
            key={example.id}
            title={example.title}
            description={example.description}
            image={example.image}
            author={example.author}
            link={example.link}
            tags={example.tags}
          />
        ))}
      </div>
    </div>
  );
};

export default ExampleGallery;
