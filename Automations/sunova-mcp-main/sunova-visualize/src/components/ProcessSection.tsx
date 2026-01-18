import { Upload, Brain, Video, Download, Music, Palette, Film, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FaYoutube, FaTiktok, FaTwitter, FaFacebookF, FaInstagram, FaSnapchatGhost, FaSpotify } from "react-icons/fa";
import { SiThreads } from "react-icons/si";
import cinematicCloseup from "@/assets/cinematic-closeup.jpg";
import directorSetup from "@/assets/director-setup.jpg";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ProcessSection = () => {
  const headerRef = useScrollAnimation(0.2);
  const stepsRef = useScrollAnimation(0.1);
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Track",
      description: "Drop your Suno.com music file and let our AI begin the magic",
      color: "text-[#cb8145]"
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Advanced algorithms analyze genre, energy, beats, and lyrics",
      color: "text-[#c4577e]"
    },
    {
      icon: Palette,
      title: "Concept Creation",
      description: "Generate unique visual concepts that match your music's vibe",
      color: "text-[#67aa60]"
    },
    {
      icon: Film,
      title: "Storyboard Planning",
      description: "Create detailed scene breakdowns and shot compositions",
      color: "text-[#2d6ab1]"
    },
    {
      icon: Video,
      title: "AI Generation",
      description: "Produce consistent characters and cinematic scenes using Segmind & Replicate",
      color: "text-[#cdbd55]"
    },
    {
      icon: Download,
      title: "Final Delivery",
      description: "Download your professional 4K music video ready for any platform",
      color: "text-[#bc4075]"
    }
  ];

  return (
    <section className="py-24 relative parallax-container film-grain">
      {/* Cinematic Background Layers */}
      <div className="absolute inset-0">
        <div className="parallax-element parallax-slow opacity-8">
          <img 
            src={cinematicCloseup} 
            alt="Cinematic video production"
            className="parallax-bg"
          />
        </div>
        
        <div className="parallax-element parallax-medium opacity-6" style={{ transform: 'translateX(25%)' }}>
          <img 
            src={directorSetup} 
            alt="Director and film crew setup"
            className="parallax-bg"
          />
        </div>
      </div>
      
      {/* Cinematic Overlay */}
      <div className="cinematic-overlay" />
      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        
        {/* Cinematic Light Streaks */}
        <div className="absolute top-0 left-1/2 w-px h-1/3 bg-gradient-to-b from-accent/20 to-transparent blur-sm" />
        <div className="absolute bottom-0 right-1/4 w-px h-1/4 bg-gradient-to-t from-primary/15 to-transparent blur-sm" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div 
          ref={headerRef.ref as any}
          className={`text-center mb-20 transition-all duration-1200 ${
            headerRef.isVisible 
              ? 'opacity-100 translate-y-0 rotate-0' 
              : 'opacity-0 translate-y-32 rotate-3'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-medium mb-6">
            <Zap className="h-4 w-4" />
            How It Works
          </div>
          <h2 className="text-4xl md:text-6xl font-sans font-bold mb-6 gradient-text">
            From Audio to Awesome
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our cutting-edge AI pipeline transforms your music into professional music videos 
            with consistent storytelling and cinematic quality
          </p>
        </div>

        {/* Process Steps */}
        <div 
          ref={stepsRef.ref as any}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {steps.map((step, index) => (
            <Card 
              key={step.title}
              className={`bg-[#1c1c1f] border border-[#6a6a71] hover-lift group relative overflow-hidden transition-all duration-900 ${
                stepsRef.isVisible 
                  ? 'opacity-100 translate-y-0 translate-x-0 scale-100 rotate-0' 
                  : 'opacity-0 translate-y-32 -translate-x-16 scale-75 -rotate-6'
              }`}
              style={{ transitionDelay: `${300 + index * 180}ms` }}
            >
              <CardContent className="p-8 text-center relative z-10">
                {/* Step Number */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-6">
                  <step.icon className={`h-8 w-8 mx-auto ${step.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-sans font-semibold mb-4 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Animated Connection Line */}
                {index < steps.length - 1 && index % 3 !== 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
                )}
              </CardContent>

              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>
          ))}
        </div>

        {/* Social Media Platforms */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-sans font-semibold mb-8 text-foreground">
            Perfect for Every Platform
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-muted/50">
              <FaYoutube className="h-6 w-6 text-red-500" />
            </div>
            <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-muted/50">
              <FaTiktok className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-muted/50">
              <FaTwitter className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-muted/50">
              <FaFacebookF className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-muted/50">
              <FaInstagram className="h-6 w-6 text-pink-500" />
            </div>
            <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-muted/50">
              <SiThreads className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-muted/50">
              <FaSpotify className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-muted/50">
              <FaSnapchatGhost className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;