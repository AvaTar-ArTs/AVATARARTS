import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Play, Sparkles } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "How It Works", href: "#process" },
    { name: "Features", href: "#features" },
    { name: "Examples", href: "#examples" },
    { name: "Pricing", href: "#pricing" },
    { name: "Resources", href: "#blog" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <span className="sunova-logo text-3xl text-white"></span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="https://youtu.be/pju49fNM0ek" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-9 px-3 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors text-xs font-normal">
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
                <Play className="h-4 w-4 mr-2" />
                Watch Demo
              </span>
            </a>
            <div className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-300 hover:opacity-60 rounded-[35px] h-9 px-3 text-white text-xs font-medium" style={{
              background: `
                radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                #d0583c`
            }}>
              Create Video
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 animate-fade-in-up">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground/80 hover:text-primary transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                <a href="https://youtu.be/pju49fNM0ek" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-9 px-3 cursor-pointer inline-flex items-center justify-start gap-2 whitespace-nowrap font-medium transition-colors text-xs font-normal">
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
                    <Play className="h-4 w-4 mr-2" />
                    Watch Demo
                  </span>
                </a>
                <div className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-opacity duration-300 hover:opacity-60 rounded-[35px] h-9 px-3 text-white text-xs font-medium" style={{
                  background: `
                    radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                    radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                    radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                    radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                    radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                    #d0583c`
                }}>
                  Create Video
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;