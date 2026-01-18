import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, CheckCircle2 } from "lucide-react";

const BetaApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contributionAmount: "",
    whyPerfectTester: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("beta_applications").insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        contribution_amount: parseFloat(formData.contributionAmount),
        why_perfect_tester: formData.whyPerfectTester,
      });

      if (error) throw error;

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#1c1c1f' }}>
        <Header />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-12">
              <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
              <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Thank You for Your Interest!
              </h1>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  We've received your beta tester application and are genuinely grateful for your willingness to help shape SuNovà.
                </p>
                <p>
                  The response has been larger than we anticipated, which is incredibly exciting! We're carefully reviewing each application by hand to ensure we build the perfect founding creator community.
                </p>
                <p className="font-semibold text-foreground">
                  You'll receive an email within one week regarding your application status.
                </p>
                <p className="pt-6">
                  In the meantime, feel free to explore the platform and reach out if you have any questions.
                </p>
              </div>
              <Button
                onClick={() => navigate("/")}
                className="mt-8"
                size="lg"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1c1c1f' }}>
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Beta Tester Application
            </h1>
            <p className="text-lg text-muted-foreground">
              Join the founding creators of SuNovà
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contributionAmount">Contribution Amount (USD) *</Label>
              <Input
                id="contributionAmount"
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.contributionAmount}
                onChange={(e) => setFormData({ ...formData, contributionAmount: e.target.value })}
                placeholder="50.00"
              />
              <p className="text-sm text-muted-foreground">
                Any amount helps! This goes directly to API credits and will be returned to you over time.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whyPerfectTester">Why would you be the perfect beta tester? *</Label>
              <Textarea
                id="whyPerfectTester"
                required
                value={formData.whyPerfectTester}
                onChange={(e) => setFormData({ ...formData, whyPerfectTester: e.target.value })}
                placeholder="Tell us about your background, your creative projects, why you're excited about SuNovà, and how you'd contribute to making it better..."
                className="min-h-[150px]"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BetaApplication;
