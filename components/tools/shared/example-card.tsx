import Link from "next/link";
import Image from "next/image";

interface ExampleCardProps {
  title: string;
  description: string;
  image: string;
  author?: string;
  link: string;
  tags?: string[];
}

const ExampleCard = ({ title, description, image, author, link, tags }: ExampleCardProps) => {
  return (
    <Link href={link} className="block rounded-lg overflow-hidden bg-card/50 border border-white/10 hover:shadow-lg hover:border-white/20 transition-all">
      <div className="aspect-video relative">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover" 
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 text-xs bg-secondary/50 text-foreground rounded border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {author && (
          <p className="text-sm text-muted-foreground/70">By {author}</p>
        )}
      </div>
    </Link>
  );
};

export default ExampleCard;
