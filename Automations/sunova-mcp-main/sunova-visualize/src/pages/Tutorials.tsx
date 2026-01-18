import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Video } from "lucide-react";

const Tutorials = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6">
            <Video className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-6">
            Tutorial Videos Coming Soon
          </h1>
          <p className="text-muted-foreground text-lg">
            We're preparing comprehensive video tutorials to help you master SuNova. 
            Stay tuned for step-by-step guides and creative tips!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tutorials;
