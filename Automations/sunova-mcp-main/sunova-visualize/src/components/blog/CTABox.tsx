import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

interface CTABoxProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
  variant?: "primary" | "secondary";
}

const CTABox = ({ title, description, buttonText, buttonLink = "/beta-apply", variant = "primary" }: CTABoxProps) => {
  return (
    <div className="glass-card p-8 my-8 text-center hover-lift">
      <h3 className="text-2xl md:text-3xl font-display font-bold gradient-text mb-4">
        {title}
      </h3>
      <p className="text-muted-foreground mb-6 text-lg max-w-2xl mx-auto">
        {description}
      </p>
      <Link to={buttonLink}>
        <div 
          className="inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap font-medium transition-opacity duration-300 hover:opacity-60 rounded-full px-8 py-3 text-white text-lg"
          style={{
            background: `
              radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
              radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
              radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
              radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
              radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
              #d0583c`
          }}
        >
          {variant === "primary" ? <Play className="h-5 w-5" /> : null}
          {buttonText}
          <ArrowRight className="h-5 w-5" />
        </div>
      </Link>
    </div>
  );
};

export default CTABox;
