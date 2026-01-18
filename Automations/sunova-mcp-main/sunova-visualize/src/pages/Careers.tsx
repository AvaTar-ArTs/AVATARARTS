import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Careers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-6">
              Join Our Team
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              We're looking for like-minded developers who are passionate about AI and music generation using AI. 
              As we grow, we'll be needing some help to push the boundaries of creative technology.
            </p>
          </div>

          <div className="glass-card p-8 text-center">
            <h2 className="font-display text-2xl font-semibold mb-4">
              Interested in joining us?
            </h2>
            <p className="text-muted-foreground mb-6">
              While we're not actively hiring at the moment, we'd love to connect with talented developers 
              who share our vision. Apply to be a beta tester to get early access and stay in the loop!
            </p>
            <Link to="/beta/apply">
              <Button size="lg" className="gap-2">
                Apply as Beta Tester
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
