import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Clock, User, ArrowLeft, BookOpen, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import InfoBox from "@/components/blog/InfoBox";
import QuoteBlock from "@/components/blog/QuoteBlock";
import SectionHeader from "@/components/blog/SectionHeader";
import CTABox from "@/components/blog/CTABox";
import { Card, CardContent } from "@/components/ui/card";

// Import the blog post content components
import BlogPost1 from "@/components/blog/posts/BlogPost1";
import BlogPost2 from "@/components/blog/posts/BlogPost2";
import BlogPost3 from "@/components/blog/posts/BlogPost3";
import BlogPost4 from "@/components/blog/posts/BlogPost4";
import BlogPost5 from "@/components/blog/posts/BlogPost5";
import BlogPost6 from "@/components/blog/posts/BlogPost6";

const BlogPost = () => {
  const { id } = useParams();

  const blogPostsMeta: Record<string, any> = {
    "1": {
      title: "The Future of AI Music Videos: Trends to Watch in 2025",
      author: "Sarah Chen",
      date: "Dec 15, 2024",
      readTime: "8 min read",
      category: "Industry Trends",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop",
      component: BlogPost1
    },
    "2": {
      title: "5 Tips for Creating Engaging Music Video Storyboards",
      author: "Mike Rodriguez",
      date: "Dec 12, 2024",
      readTime: "6 min read",
      category: "Tutorial",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=600&fit=crop",
      component: BlogPost2
    },
    "3": {
      title: "Character Consistency in AI Video Generation: Best Practices",
      author: "Emma Thompson",
      date: "Dec 10, 2024",
      readTime: "10 min read",
      category: "Technical Guide",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop",
      component: BlogPost3
    },
    "4": {
      title: "From Suno to Screen: The Complete Music Video Journey",
      author: "David Park",
      date: "Dec 8, 2024",
      readTime: "12 min read",
      category: "How-To Guide",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=600&fit=crop",
      component: BlogPost4
    },
    "5": {
      title: "The Underdog's Tax: Why Every Line of AI Code Has a Running Meter",
      author: "Justin / The Synth Alchemist",
      date: "Dec 18, 2024",
      readTime: "7 min read",
      category: "Industry Insights",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
      component: BlogPost5
    },
    "6": {
      title: "Behind the Scenes: AI Video Generation Process",
      author: "Tech Team",
      date: "Dec 20, 2024",
      readTime: "15 min read",
      category: "Technical Deep Dive",
      image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1200&h=600&fit=crop",
      component: BlogPost6
    }
  };

  const post = blogPostsMeta[id || "1"];

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Post Not Found</h1>
          <Link to="/">
            <Button>Go Back Home</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const ContentComponent = post.component;
  const relatedPosts = Object.entries(blogPostsMeta)
    .filter(([postId, _]) => postId !== id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 pt-12 pb-24 relative z-10">
          {/* Back Button */}
          <Link to="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          {/* Article Header */}
          <article className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                  {post.category}
                </span>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold gradient-text mb-8 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-display font-bold">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="ml-auto">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-video rounded-xl overflow-hidden mb-12 shadow-2xl">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </article>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <article className="max-w-4xl mx-auto">
          {/* Table of Contents */}
          <Card className="glass-card mb-12">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-lg">Table of Contents</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Jump to any section of this article to learn more about {post.title.toLowerCase()}.</p>
              </div>
            </CardContent>
          </Card>

          {/* Blog Post Content */}
          <div className="prose-custom">
            <ContentComponent />
          </div>

          {/* Bottom CTA */}
          <div className="mt-16">
            <CTABox 
              title="Ready to Create Your Own AI Music Video?"
              description="Join thousands of artists who are already using SuNova to bring their music to life with stunning AI-generated visuals."
              buttonText="Start Creating Now"
              buttonLink="/beta-apply"
            />
          </div>

          {/* Newsletter CTA */}
          <div className="glass-card p-8 mt-12 text-center">
            <h3 className="text-2xl font-display font-bold gradient-text mb-4">
              Never Miss an Update
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get the latest tips, tutorials, and insights about AI music video creation delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
              <div 
                className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-300 hover:opacity-60 rounded-full px-6 py-3 text-white"
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
                Subscribe
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-display font-bold gradient-text mb-8">
                Related Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(([postId, relatedPost]) => (
                  <Link key={postId} to={`/blog/${postId}`}>
                    <Card className="glass-card hover-lift cursor-pointer group h-full">
                      <CardContent className="p-0">
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          <img 
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <span className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-white text-xs rounded-full">
                            {relatedPost.category}
                          </span>
                        </div>
                        <div className="p-5">
                          <h4 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{relatedPost.author}</span>
                            <span>•</span>
                            <span>{relatedPost.readTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
