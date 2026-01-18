import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Upload, Zap, Sparkles, Music, Wand2 } from "lucide-react";
import heroBackgroundVideo from "@/assets/hero-bg.webm";
import btsVideo1 from "@/assets/bts-music-video-1.jpg";
import hollywoodShot from "@/assets/hollywood-shot-1.jpg";
import productionScene from "@/assets/production-scene-1.jpg";
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const handleAuthNavigate = useCallback(() => navigate("/auth"), [navigate]);
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0">
        <source src={heroBackgroundVideo} type="video/webm" />
      </video>
      
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      {/* Cinematic Overlay */}
      <div className="cinematic-overlay z-20" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{
        animationDelay: '2s'
      }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{
        animationDelay: '4s'
      }}></div>
        
        {/* Cinematic Light Rays */}
        <div className="absolute top-0 left-1/4 w-px h-1/2 bg-gradient-to-b from-primary/30 to-transparent blur-sm" />
        <div className="absolute top-0 right-1/3 w-px h-1/3 bg-gradient-to-b from-accent/20 to-transparent blur-sm" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-20"></div>

      <div className="container mx-auto px-6 relative z-30">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-sans font-bold mb-6 leading-tight text-shadow pt-24">
              <span className="sunova-logo text-white text-6xl md:text-8xl"></span>
            </h1>
            <div className="text-2xl md:text-4xl font-sans font-medium text-foreground/90 mb-4 text-shadow">you bring the track, </div>
            <div className="text-3xl md:text-5xl font-sans font-bold text-white animate-gradient-shift text-shadow">we bring the screen.</div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{
          animationDelay: '0.2s'
        }}>
            Upload your Suno tracks and our advanced AI music video agent will generate a <span className="text-secondary">professional music video</span> that perfectly tells your songs story. 
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in-up" style={{
          animationDelay: '0.4s'
        }}>
            <div className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-300 hover:opacity-60 rounded-full h-10 px-4 py-2 text-white text-xs font-normal" onClick={handleAuthNavigate} style={{
              background: `
                radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                #d0583c`
            }}>
              <Wand2 className="mr-3 h-5 w-5" />
              Create Your Video
            </div>
            
            <div className="relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-10 px-4 py-2 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors text-xs font-normal" onClick={handleAuthNavigate}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
                background: `
                  radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                  radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                  #d0583c`
              }} />
              <span className="relative z-10 flex items-center justify-center">
                <Play className="mr-3 h-5 w-5" />
                Get Started
              </span>
            </div>
          </div>

          {/* Video Preview */}
          <div className="glass-card p-4 max-w-4xl mx-auto hover-lift animate-scale-in" style={{
          animationDelay: '0.6s'
        }}>
            <div className="aspect-video bg-gradient-cosmic rounded-lg relative overflow-hidden group">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/pju49fNM0ek"
                title="SuNova Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto animate-fade-in-up" style={{
          animationDelay: '0.8s'
        }}>
            <div className="text-center">
              <div className="text-3xl font-sans font-bold gradient-text">1000+</div>
              <div className="text-muted-foreground">Videos Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-sans font-bold gradient-text">24hrs</div>
              <div className="text-muted-foreground">Avg. Turnaround</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-sans font-bold gradient-text">99%</div>
              <div className="text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>;
};
export default Hero;
