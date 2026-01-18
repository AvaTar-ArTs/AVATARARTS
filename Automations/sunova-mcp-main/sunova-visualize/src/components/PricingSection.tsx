import { Check, X, Star, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PricingSection = () => {
  const pricingExamples = [
    {
      duration: "2-3 minutes",
      shots: "15-25 shots",
      priceRange: "$20 - $28",
      description: "Perfect for most popular songs",
      features: [
        "Complete music video generation",
        "Character consistency throughout",
        "Scene-by-scene storyboard",
        "1080p HD resolution output",
        "Real-time creation process",
        "Under 1 hour delivery",
        "Commercial license included"
      ],
      popular: true,
      gradient: "from-primary/20 to-accent/20"
    },
    {
      duration: "3-4 minutes",
      shots: "25-35 shots", 
      priceRange: "$28 - $35",
      description: "Standard length tracks",
      features: [
        "Extended video generation",
        "Advanced character consistency",
        "Detailed scene breakdown",
        "1080p HD output",
        "Live creation monitoring",
        "Under 1 hour delivery",
        "Enhanced commercial license"
      ],
      popular: false,
      gradient: "from-secondary/20 to-primary/20"
    },
    {
      duration: "4+ minutes",
      shots: "35+ shots",
      priceRange: "Custom Quote",
      description: "Epic length productions", 
      features: [
        "Full-scale video production",
        "Complex scene management",
        "Premium storyboarding",
        "1080p HD resolution",
        "Priority processing",
        "Under 1 hour delivery",
        "Extended commercial rights"
      ],
      popular: false,
      gradient: "from-muted/50 to-muted/30"
    }
  ];

  const competitors = [
    {
      name: "Traditional Video Production",
      price: "$10,000 - $50,000",
      timeframe: "4-8 weeks",
      quality: "Variable",
      revisions: "Limited (expensive)"
    },
    {
      name: "Freelance Video Editors", 
      price: "$2,000 - $8,000",
      timeframe: "2-4 weeks",
      quality: "Inconsistent",
      revisions: "2-3 rounds max"
    },
    {
      name: "AI Video Tools (DIY)",
      price: "$50 - $200/month",
      timeframe: "Weeks (learning curve)",
      quality: "Amateur-level",
      revisions: "Self-managed"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full text-accent font-medium mb-6">
            <Star className="h-4 w-4" />
            Pay-Per-Video Pricing
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 gradient-text">
            Professional Videos,
            <br />Affordable Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Pay only for what you create. Pricing varies based on song duration and complexity.
            Watch your video come to life in real-time - delivered in under an hour!
          </p>
        </div>

        {/* Pricing Info */}
        <div className="glass-card p-8 max-w-4xl mx-auto mb-12">
          <div className="text-center">
            <h3 className="text-2xl font-display font-bold mb-4 gradient-text">
              How Pricing Works
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Final price depends on your song's duration and the number of shots required for your video. 
              Our AI analyzes your track and provides an exact quote before you start.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-display font-bold text-primary">📤</div>
                <div className="font-semibold">Upload Track</div>
                <div className="text-sm text-muted-foreground">Upload your track and let Sunova create your masterpiece</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-display font-bold text-accent">⚡</div>
                <div className="font-semibold">Real-Time Creation</div>
                <div className="text-sm text-muted-foreground">Watch it being made live</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-display font-bold text-secondary">✅</div>
                <div className="font-semibold">Instant Download</div>
                <div className="text-sm text-muted-foreground">Complete video in under 1 hour</div>
              </div>
            </div>
          </div>
        </div>

        {/* Competitor Comparison */}
        <div className="glass-card p-8 max-w-6xl mx-auto">
          <h3 className="text-2xl font-display font-bold text-center mb-8 gradient-text">
            Why Choose SuNova Over Alternatives
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-muted/20">
                  <th className="text-left py-4 px-4 font-display font-semibold">Solution</th>
                  <th className="text-left py-4 px-4 font-display font-semibold">Price Range</th>
                  <th className="text-left py-4 px-4 font-display font-semibold">Delivery Time</th>
                  <th className="text-left py-4 px-4 font-display font-semibold">Quality</th>
                  <th className="text-left py-4 px-4 font-display font-semibold">Experience</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-muted/10 bg-gradient-primary/10">
                  <td className="py-4 px-4 font-semibold text-primary">SuNova AI Video</td>
                  <td className="py-4 px-4 text-green-400 font-semibold">$20 - $35</td>
                  <td className="py-4 px-4 text-green-400 font-semibold">Under 1 hour</td>
                  <td className="py-4 px-4 text-green-400 font-semibold">Professional AI</td>
                  <td className="py-4 px-4 text-green-400 font-semibold">Watch it create live</td>
                </tr>
                {competitors.map((competitor, index) => (
                  <tr key={index} className="border-b border-muted/10">
                    <td className="py-4 px-4 text-muted-foreground">{competitor.name}</td>
                    <td className="py-4 px-4 text-muted-foreground">{competitor.price}</td>
                    <td className="py-4 px-4 text-muted-foreground">{competitor.timeframe}</td>
                    <td className="py-4 px-4 text-muted-foreground">{competitor.quality}</td>
                    <td className="py-4 px-4 text-muted-foreground">{competitor.revisions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Ready to see your music come to life? 
            <span className="text-primary ml-2 font-semibold cursor-pointer hover:underline">
              Upload your track and let Sunova create your masterpiece
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;