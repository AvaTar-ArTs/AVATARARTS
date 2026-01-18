import { Calendar, Clock, User, ArrowRight, BookOpen, Video, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI Music Videos: Trends to Watch in 2025",
      excerpt: "Explore the latest developments in AI-generated music videos and how they're revolutionizing the music industry.",
      author: "Sarah Chen",
      date: "Dec 15, 2024",
      readTime: "8 min read",
      category: "Industry Trends",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "5 Tips for Creating Engaging Music Video Storyboards",
      excerpt: "Learn how to craft compelling visual narratives that perfectly complement your music and engage your audience.",
      author: "Mike Rodriguez",
      date: "Dec 12, 2024",
      readTime: "6 min read",
      category: "Tutorial",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=250&fit=crop",
      featured: false
    },
    {
      id: 3,
      title: "Character Consistency in AI Video Generation: Best Practices",
      excerpt: "Discover advanced techniques for maintaining character continuity throughout your AI-generated music videos.",
      author: "Emma Thompson",
      date: "Dec 10, 2024",
      readTime: "10 min read",
      category: "Technical Guide",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
      featured: false
    },
    {
      id: 4,
      title: "From Suno to Screen: The Complete Music Video Journey",
      excerpt: "A comprehensive guide to transforming your Suno.com tracks into professional music videos using AI technology.",
      author: "David Park",
      date: "Dec 8, 2024",
      readTime: "12 min read",
      category: "How-To Guide",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=250&fit=crop",
      featured: false
    },
    {
      id: 5,
      title: "The Underdog's Tax: Why Every Line of AI Code Has a Running Meter",
      excerpt: "Understanding the hidden costs of AI development and what it means for indie innovation. Every 'Whoa!' has a price tag.",
      author: "Justin / The Synth Alchemist",
      date: "Dec 18, 2024",
      readTime: "7 min read",
      category: "Industry Insights",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      featured: false
    },
    {
      id: 6,
      title: "Behind the Scenes: AI Video Generation Process",
      excerpt: "Discover the fascinating process behind AI-generated music videos and how SuNova creates cinematic magic on autopilot.",
      author: "Tech Team",
      date: "Dec 20, 2024",
      readTime: "15 min read",
      category: "Technical Deep Dive",
      image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&h=250&fit=crop",
      featured: false
    }
  ];

  const youtubeVideos = [
    {
      title: "SuNova Demo: Creating Your First AI Music Video",
      views: "127K views",
      duration: "15:23",
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop"
    },
    {
      title: "Behind the Scenes: AI Video Generation Process",
      views: "89K views",
      duration: "22:15",
      thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=225&fit=crop"
    },
    {
      title: "Artist Spotlight: Success Stories with SuNova",
      views: "156K views",
      duration: "18:47",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full text-secondary font-medium mb-6">
            <BookOpen className="h-4 w-4" />
            Resources
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 gradient-text">
            Learn & Create Better
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover expert insights, tutorials, and inspiration to maximize your music video creation potential
          </p>
        </div>

        {/* Featured Blog Post */}
        {blogPosts.filter(post => post.featured).map((post) => (
          <div key={post.id} className="glass-card p-8 mb-16 hover-lift">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                    Featured
                  </span>
                  <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-3xl font-display font-bold gradient-text mb-4">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {post.readTime}
                  </div>
                </div>
                <Link to={`/blog/${post.id}`}>
                  <div className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-300 hover:opacity-60 rounded-full px-6 py-3 text-white" style={{
                    background: `
                      radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                      radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                      radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                      radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                      radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                      #d0583c`
                  }}>
                    Read Full Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </Link>
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Blog Posts */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="text-2xl font-display font-bold text-foreground">Latest Articles</h3>
            </div>
            
            <div className="space-y-6">
              {blogPosts.filter(post => !post.featured).map((post, index) => (
                <Link key={post.id} to={`/blog/${post.id}`}>
                  <Card 
                    className="glass-card hover-lift group cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="px-2 py-1 bg-muted/50 text-primary text-xs rounded">
                            {post.category}
                          </span>
                        </div>
                        <h4 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                          {post.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{post.author}</span>
                          <span>{post.date}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* YouTube Videos */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <Video className="h-5 w-5 text-secondary" />
              <h3 className="text-2xl font-display font-bold text-foreground">Tutorial Videos</h3>
            </div>
            
            <div className="space-y-6">
              {youtubeVideos.map((video, index) => (
                <Card 
                  key={video.title}
                  className="glass-card hover-lift group cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                >
                  <CardContent className="p-0">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors duration-300">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-display font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors duration-300">
                        {video.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {video.views}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline">
                <Video className="mr-2 h-4 w-4" />
                Visit Our YouTube Channel
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Newsletter CTA */}
        <div className="glass-card p-8 max-w-2xl mx-auto mt-16 text-center hover-lift">
          <Lightbulb className="h-12 w-12 mx-auto mb-4 text-accent" />
          <h3 className="text-2xl font-display font-bold gradient-text mb-4">
            Stay Updated
          </h3>
          <p className="text-muted-foreground mb-6">
            Get the latest tips, tutorials, and insights delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
            />
            <div className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-300 hover:opacity-60 rounded-full px-6 py-2 text-white" style={{
              background: `
                radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                #d0583c`
            }}>
              Subscribe
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;