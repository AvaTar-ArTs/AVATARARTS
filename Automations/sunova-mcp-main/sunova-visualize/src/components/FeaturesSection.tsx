import { Sparkles, Zap, Target, Clock, Shield, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const FeaturesSection = () => {
  const headerRef = useScrollAnimation(0.2);
  const cardsRef = useScrollAnimation(0.1);
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your music's genre, energy patterns, and emotional tone to create perfect visual matches",
      highlight: "Smart Recognition"
    },
    {
      icon: Target,
      title: "Character Consistency",
      description: "Maintain the same characters, objects, and locations throughout your entire video for professional storytelling",
      highlight: "Visual Continuity"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate professional music videos in under 24 hours with our optimized AI pipeline and cloud infrastructure",
      highlight: "24hr Delivery"
    },
    {
      icon: Clock,
      title: "Detailed Storyboarding",
      description: "Get comprehensive scene breakdowns with shot-by-shot planning before video generation begins",
      highlight: "Pre-Visualization"
    },
    {
      icon: Shield,
      title: "Commercial Rights",
      description: "Full commercial licensing included - use your videos on any platform, monetize freely without restrictions",
      highlight: "Full Rights"
    },
    {
      icon: Award,
      title: "4K Quality Output",
      description: "Ultra-high definition videos optimized for any platform from TikTok to YouTube to streaming services",
      highlight: "Professional Grade"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div 
          ref={headerRef.ref as any}
          className={`text-center mb-20 transition-all duration-1200 ${
            headerRef.isVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 -translate-y-24 scale-90'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full text-secondary font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Features
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 gradient-text">
            Why Choose SuNova?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of music video creation with our cutting-edge AI technology 
            and professional-grade output quality
          </p>
        </div>

        {/* Features Grid */}
        <div 
          ref={cardsRef.ref as any}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className={`bg-[#1c1c1f] border border-[#6a6a71] hover-lift group relative overflow-hidden transition-all duration-800 ${
                cardsRef.isVisible 
                  ? 'opacity-100 translate-x-0 translate-y-0 rotate-0 scale-100' 
                  : 'opacity-0 -translate-x-24 translate-y-24 -rotate-12 scale-75'
              }`}
              style={{ transitionDelay: `${300 + index * 200}ms` }}
            >
              <CardContent className="p-8 relative z-10">
                {/* Highlight Badge */}
                <div className="absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium text-white" style={{
                  background: `
                    radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                    radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                    radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                    radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                    radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                    #d0583c`
                }}>
                  {feature.highlight}
                </div>

                {/* Icon */}
                <div className="mb-6">
                  <feature.icon className="h-8 w-8 text-[#c4577e]" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-semibold mb-4 text-foreground group-hover:text-[#2d6ab1] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Animated Border */}
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </CardContent>

              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="glass-card p-8 max-w-2xl mx-auto hover-lift">
            <h3 className="text-2xl font-display font-bold mb-4 gradient-text">
              Ready to Transform Your Music?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of artists who've already created stunning music videos with SuNova
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-300 hover:opacity-60 px-6 py-3 rounded-full text-white text-base" style={{
                background: `
                  radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                  radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                  #d0583c`
              }}>
                Start Creating Now
              </div>
              <div className="relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-[35px] px-6 py-3 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors font-semibold">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[35px]" style={{
                  background: `
                    radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                    radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                    radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                    radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                    radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                    #d0583c`
                }} />
                <span className="relative z-10">
                  View Examples
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;