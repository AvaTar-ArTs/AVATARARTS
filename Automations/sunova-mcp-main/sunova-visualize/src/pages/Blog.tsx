import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-6">
            Blog Coming Soon
          </h1>
          <p className="text-muted-foreground text-lg">
            We're working on creating valuable content about AI music video generation, 
            creative workflows, and industry insights. Check back soon for updates!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
