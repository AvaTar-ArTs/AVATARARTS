import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const BetaInfo = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1c1c1f' }}>
      <Header />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Join the Beta Creator Program
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help build the future of AI-powered music video creation
            </p>
          </div>

          <div className="prose prose-invert max-w-none mb-12">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Something Almost Too Good to Be Real</h2>
              <p className="text-lg text-muted-foreground mb-4">
                I built <span className="text-primary font-semibold">SuNovà</span> — a one-click app that turns your Suno song into a cinematic music video.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                No editing. No timeline. You upload the track — it does the rest.
              </p>
              <p className="text-lg text-muted-foreground">
                AI handles everything: visuals, beat-matching, transitions, storyboards, styles.
                You just… watch.
              </p>
            </section>

            <section className="mb-12 p-8 rounded-lg bg-destructive/10 border border-destructive/20">
              <h2 className="text-3xl font-bold mb-4">But Here's the Catch</h2>
              <p className="text-lg text-muted-foreground mb-4">
                I'm a solo dev/artist, and this thing runs on multiple AI engines — text-to-image, image-to-video, 
                interpolation, beat analysis, etc.
              </p>
              <p className="text-lg text-muted-foreground">
                That means every generation costs money, and I can't afford to front the wave of users I know are coming.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">The Beta Program</h2>
              <p className="text-lg text-muted-foreground mb-6">
                I'm opening a beta tester tier — but instead of free testers, I need a small group of creators who can:
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg text-muted-foreground">Chip in a bit of $$ now to build an API credit cushion</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg text-muted-foreground">Help test, break, and refine the app</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-lg text-muted-foreground">Get your money back + extra rewards once the platform fully launches</p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">How It Works</h2>
              <div className="space-y-4">
                <div className="p-6 rounded-lg bg-card border border-border">
                  <p className="text-lg">💰 You contribute any amount you want</p>
                </div>
                <div className="p-6 rounded-lg bg-card border border-border">
                  <p className="text-lg">🧾 I keep track of the % of the total beta pool you funded</p>
                </div>
                <div className="p-6 rounded-lg bg-card border border-border">
                  <p className="text-lg">📈 Once SuNovà launches and new users start buying credits, 10% of total monthly credit income goes back to the beta tester pool</p>
                </div>
                <div className="p-6 rounded-lg bg-card border border-border">
                  <p className="text-lg">You get your % of that 10% every month — either in cash or free credits, your call</p>
                </div>
                <div className="p-6 rounded-lg bg-card border border-border">
                  <p className="text-lg">Once you've earned back your original contribution, you keep getting rewards anyway, as long as you're active</p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground mt-6">
                Think of it like a creator DAO for launch costs. You're not donating — you're backing the engine you'll use and own a share of the cushion.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">What You Get</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                  <Check className="w-8 h-8 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Immediate Beta Access</h3>
                  <p className="text-muted-foreground">Start creating AI music videos right away</p>
                </div>
                <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                  <Check className="w-8 h-8 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Full Refund + More</h3>
                  <p className="text-muted-foreground">Your funds returned over time plus extra credits</p>
                </div>
                <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                  <Check className="w-8 h-8 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Priority Support</h3>
                  <p className="text-muted-foreground">Direct input on features and roadmap</p>
                </div>
                <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
                  <Check className="w-8 h-8 text-primary mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Founding Creator Wall</h3>
                  <p className="text-muted-foreground">Your name etched in SuNovà history (optional)</p>
                </div>
              </div>
            </section>
          </div>

          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/beta/apply">
                <Button size="lg" variant="hero" className="text-xl px-12 py-6">
                  Become a Beta Tester
                </Button>
              </Link>
              <Link to="/blog/5">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Read: The Underdog's Tax
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Let's make music visible together.
              <br />
              — Justin / The Synth Alchemist
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BetaInfo;
