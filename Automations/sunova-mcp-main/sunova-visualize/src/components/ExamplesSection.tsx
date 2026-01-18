import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Eye, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import thePaintedChoice from "@/assets/the-painted-choice.jpg";
import frameByFrame from "@/assets/frame-by-frame.jpg";
import shadowsOfDivision from "@/assets/shadows-of-division.jpg";
import upsideDown from "@/assets/304-im-upside-down.jpg";

const ExamplesSection = () => {
  const examples = [
    {
      id: 1,
      youtubeId: "wK5NGmpg740",
      title: "The Painted Choice",
      artist: "Magic Rush",
      genre: "Alternative",
      duration: "6:09",
      views: "2.3K",
      likes: "124",
      thumbnail: thePaintedChoice,
      description: "A visually stunning journey through artistic choices and creative freedom",
      tags: ["Alternative", "Artistic", "Cinematic"]
    },
    {
      id: 2,
      youtubeId: "drj_pUx2hlk",
      title: "Frame by Frame",
      artist: "Cloud Museum",
      genre: "Indie Folk",
      duration: "2:01",
      views: "1.8K",
      likes: "98",
      thumbnail: frameByFrame,
      description: "Capturing moments of beauty in a vibrant natural landscape",
      tags: ["Indie Folk", "Nature", "Dreamy"]
    },
    {
      id: 3,
      youtubeId: "60v9iuzTzdA",
      title: "Shadows of Division",
      artist: "Magic Rush",
      genre: "Rock",
      duration: "6:42",
      views: "3.1K",
      likes: "156",
      thumbnail: shadowsOfDivision,
      description: "An intense exploration of inner conflict and duality",
      tags: ["Rock", "Drama", "Intense"]
    },
    {
      id: 4,
      youtubeId: "QveMdEPgSR8",
      title: "3:04 (I'm Upside Down)",
      artist: "Treaux Silan",
      genre: "Electronic",
      duration: "2:50",
      views: "4.2K",
      likes: "203",
      thumbnail: upsideDown,
      description: "A cosmic journey through space and perspective",
      tags: ["Electronic", "Space", "Experimental"]
    }
  ];

  const [activeVideo, setActiveVideo] = useState(examples[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVideoId, setModalVideoId] = useState("");

  const headerRef = useScrollAnimation(0.2);
  const featuredRef = useScrollAnimation(0.2);
  const galleryRef = useScrollAnimation(0.2);

  const handleWatchFullVideo = (youtubeId: string) => {
    setModalVideoId(youtubeId);
    setIsModalOpen(true);
  };

  return (
    <section className="pt-12 pb-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div 
          ref={headerRef.ref as any}
          className={`text-center mb-20 transition-all duration-1000 ${
            headerRef.isVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-full'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full text-accent font-medium mb-6">
            <Eye className="h-4 w-4" />
            Example Videos
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 gradient-text">
            Hollywood-Quality
            <br />Music Videos
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what's possible with AI-powered video generation. Each video is crafted with precision to match the mood and energy of the music.
          </p>
        </div>

        {/* Featured Video */}
        <div 
          ref={featuredRef.ref as any}
          className={`glass-card p-8 mb-16 max-w-6xl mx-auto transition-all duration-1000 delay-300 ${
            featuredRef.isVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-24 scale-75'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative group">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Video Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-display font-bold gradient-text mb-2">
                  {activeVideo.title}
                </h3>
                <p className="text-muted-foreground mb-4">{activeVideo.artist}</p>
                <p className="text-sm text-foreground/80 mb-4">{activeVideo.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeVideo.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-muted/50 text-primary text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-display font-bold text-primary">{activeVideo.duration}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-secondary">{activeVideo.views}</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-accent">{activeVideo.likes}</div>
                  <div className="text-xs text-muted-foreground">Likes</div>
                </div>
              </div>

              <div 
                className="w-full cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-300 hover:opacity-60 rounded-full px-4 py-2 text-white"
                onClick={() => handleWatchFullVideo(activeVideo.youtubeId)}
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
                <Play className="mr-2 h-4 w-4" />
                Watch Full Video
              </div>
            </div>
          </div>
        </div>

        {/* Video Gallery */}
        <div 
          ref={galleryRef.ref as any}
          className={`max-w-6xl mx-auto transition-all duration-1000 delay-500 ${
            galleryRef.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
          <h3 className="text-2xl font-display font-bold text-center mb-8 gradient-text">
            More Examples
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {examples.map((example, index) => (
              <Card
                key={example.id}
                className={`glass-card hover-lift cursor-pointer group transition-all duration-700 ${
                  galleryRef.isVisible 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-16 scale-95'
                }`}
                style={{ 
                  transitionDelay: `${600 + index * 200}ms`
                }}
                onClick={() => setActiveVideo(example)}
              >
                <CardContent className="p-0">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img 
                      src={example.thumbnail}
                      alt={example.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center">
                        <Play className="h-6 w-6 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                      {example.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {example.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">{example.artist}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{example.views} views</span>
                      <span className="px-2 py-1 bg-muted/50 rounded">{example.genre}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-xl text-muted-foreground mb-6">
            Ready to create your own masterpiece?
          </p>
          <div className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-300 hover:opacity-60 rounded-full px-8 py-3 text-white text-lg" style={{
            background: `
              radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
              radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
              radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
              radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
              radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
              #d0583c`
          }}>
            <Play className="mr-2 h-5 w-5" />
            Start Creating Now
          </div>
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl w-[95vw] h-[90vh] p-0 bg-black border-none">
          <div className="relative w-full h-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            {isModalOpen && (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${modalVideoId}?autoplay=1`}
                title="Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ExamplesSection;
