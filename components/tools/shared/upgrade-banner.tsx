import Link from "next/link";

interface FeatureItem {
  text: string;
}

interface UpgradeBannerProps {
  title: string;
  description: string;
  features: FeatureItem[];
  ctaText?: string;
  ctaLink?: string;
}

const UpgradeBanner = ({ 
  title, 
  description, 
  features, 
  ctaText = "View Pricing", 
  ctaLink = "/pricing" 
}: UpgradeBannerProps) => {
  return (
    <div className="bg-card/50 p-6 rounded-lg border border-white/10 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-2/3 mb-4 md:mb-0 md:pr-8">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4">{description}</p>
          <Link 
            href={ctaLink} 
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 inline-block"
          >
            {ctaText}
          </Link>
        </div>
        <div className="md:w-1/3">
          <div className="bg-background/80 p-4 rounded-lg border border-white/10 shadow-lg">
            <h4 className="font-bold mb-2">Pro Features</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-2 text-emerald-500">✓</span> {feature.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeBanner;
