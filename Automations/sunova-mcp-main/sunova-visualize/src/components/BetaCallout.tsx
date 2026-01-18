import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BetaCallout = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-block px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
          <span className="text-sm font-semibold text-primary">Limited Opportunity</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Beta Testers Needed!
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join our founding creator community and help shape the future of music video generation
        </p>
        <Link to="/beta">
          <div className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-300 hover:opacity-60 rounded-full px-8 py-3 text-white text-lg" style={{
            background: `
              radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
              radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
              radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
              radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
              radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
              #d0583c`
          }}>
            Learn More About Beta Access
          </div>
        </Link>
      </div>
    </section>
  );
};

export default BetaCallout;
