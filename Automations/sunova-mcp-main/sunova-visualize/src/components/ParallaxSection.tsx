import cinematicCloseup from "@/assets/cinematic-closeup.jpg";
import hollywoodShot from "@/assets/hollywood-shot-1.jpg";

const ParallaxSection = () => {
  return (
    <section className="h-screen relative parallax-container film-grain overflow-hidden">
      {/* Parallax Background Layers */}
      <div className="parallax-element parallax-slow">
        <img 
          src={cinematicCloseup} 
          alt="Professional cinematography"
          className="parallax-bg opacity-40"
        />
      </div>
      
      <div className="parallax-element parallax-fast" style={{ transform: 'translateX(-20%)' }}>
        <img 
          src={hollywoodShot} 
          alt="Hollywood style production"
          className="parallax-bg opacity-25"
        />
      </div>

      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/80" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 gradient-text">
            Hollywood-Quality
            <br />
            Music Videos
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-shadow">
            Experience the magic of professional cinematography powered by AI
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">4K</div>
              <div className="text-sm text-muted-foreground">Ultra HD Quality</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">&lt;1hr</div>
              <div className="text-sm text-muted-foreground">Delivery Time</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">AI</div>
              <div className="text-sm text-muted-foreground">Powered</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-background/40 pointer-events-none" />
    </section>
  );
};

export default ParallaxSection;