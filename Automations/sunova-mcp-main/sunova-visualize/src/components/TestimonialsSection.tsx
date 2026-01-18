import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      quote: "SuNova transformed my Suno tracks into professional music videos in under an hour. The quality is absolutely mind-blowing and my YouTube engagement has tripled!",
      author: "Marcus Chen",
      role: "Independent Artist",
      company: "@MarcusBeats",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      rating: 5,
      result: "250K+ Views"
    },
    {
      id: 2,
      quote: "As a music producer, I've tried everything. SuNova's AI agent creates videos that look like they cost $50k, but at a fraction of the price. Game changer!",
      author: "Sarah Rodriguez",
      role: "Music Producer",
      company: "Beats & Dreams Studio",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5,
      result: "12 Videos Created"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useScrollAnimation(0.2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div 
          ref={sectionRef.ref as any}
          className={`text-center mb-16 transition-all duration-1200 ${
            sectionRef.isVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-20 scale-90'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-medium mb-6">
            <Star className="h-4 w-4" />
            Testimonials
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 gradient-text">
            What Artists Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of creators who are bringing their music to life with SuNova
          </p>
        </div>

        {/* Featured Testimonial */}
        <div 
          className={`max-w-4xl mx-auto transition-all duration-1000 delay-300 ${
            sectionRef.isVisible 
              ? 'opacity-100 translate-x-0 scale-100 rotate-0' 
              : 'opacity-0 translate-x-full scale-75 rotate-12'
          }`}
        >
          <Card className="glass-card p-8 md:p-12 hover-lift relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 opacity-10">
              <Quote className="h-24 w-24 text-primary" />
            </div>

            <div className="relative z-10">
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-6 w-6 fill-primary text-primary transition-all duration-300"
                    style={{ 
                      animationDelay: `${i * 100}ms`,
                      animation: 'scale-in 0.3s ease-out'
                    }}
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote 
                key={currentTestimonial.id}
                className="text-xl md:text-2xl text-foreground text-center mb-8 leading-relaxed font-medium animate-fade-in"
              >
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col items-center gap-4 animate-fade-in">
                <Avatar className="h-16 w-16 border-2 border-primary/50">
                  <AvatarImage src={currentTestimonial.avatar} />
                  <AvatarFallback>{currentTestimonial.author.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="text-center">
                  <div className="font-display font-bold text-lg text-foreground">
                    {currentTestimonial.author}
                  </div>
                  <div className="text-muted-foreground">
                    {currentTestimonial.role}
                  </div>
                  <div className="text-sm text-primary">
                    {currentTestimonial.company}
                  </div>
                </div>

                {/* Result Badge */}
                <div className="px-4 py-2 rounded-full" style={{
                  background: `
                    radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                    radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                    radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                    radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                    radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                    #d0583c`
                }}>
                  <span className="text-sm font-semibold text-white">
                    {currentTestimonial.result}
                  </span>
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'w-8 bg-primary' 
                        : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16 transition-all duration-1000 delay-500 ${
            sectionRef.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-12'
          }`}
        >
          {[
            { label: "Videos Created", value: "5,000+" },
            { label: "Happy Artists", value: "2,500+" },
            { label: "Total Views", value: "50M+" },
            { label: "Avg Rating", value: "4.9/5" }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="glass-card p-6 text-center hover-lift transition-all duration-500"
              style={{ transitionDelay: `${600 + index * 100}ms` }}
            >
              <div className="text-3xl font-display font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
