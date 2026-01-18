import { Sparkles, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "How It Works", href: "/#process" },
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Examples", href: "/#examples" },
  ];

  const resources = [
    { name: "Blog", href: "/blog" },
    { name: "Tutorial Videos", href: "/tutorials" },
    { name: "Best Practices", href: "/best-practices" },
    { name: "Music Video Trends", href: "/trends" },
  ];

  const company = [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
    { name: "Press Kit", href: "/press" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Commercial License", href: "/license" },
    { name: "Refund Policy", href: "/refunds" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-primary/20" style={{ background: 'radial-gradient(circle at center, #2a2a2d, #1c1c1f)' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(42, 42, 45, 0.3)' }}></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(42, 42, 45, 0.2)' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold gradient-text">
                SuNova
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Transform your Suno.com music tracks into professional AI-generated music videos 
              with consistent characters and cinematic quality.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="https://www.youtube.com/@OfficialJustinTylerMoore" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:opacity-80" style={{
                background: `
                  radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                  radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                  #d0583c`
              }}>
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/treauxsilan" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:opacity-80" style={{
                background: `
                  radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                  radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                  #d0583c`
              }}>
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="py-6 border-t border-primary/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6">
              {legal.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 SuNova. All rights reserved.
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="py-8 border-t border-primary/10">
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold text-foreground mb-4 text-center">
              Ready to Create Your Music Video?
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <a href="mailto:hello@sunova.ai" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" />
                hello@sunova.ai
              </a>
              <a href="tel:+1-555-SUNOVA" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="h-4 w-4" />
                +1 (555) SUNOVA
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Los Angeles, CA
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;