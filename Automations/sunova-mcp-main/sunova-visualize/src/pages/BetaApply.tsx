import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const BetaApply = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest in becoming a beta tester.",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#1c1c1f' }}>
        <Header />
        <main className="pt-24 pb-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Thank You for Your Application!
              </h1>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  We've received your beta tester application and are genuinely grateful for your interest in joining our founding creator community.
                </p>
                <p>
                  The response has been larger than we anticipated, and we're carefully reviewing each application by hand to ensure we build the best possible beta community.
                </p>
                <p className="font-semibold text-foreground">
                  You'll receive an email within one week regarding your application status.
                </p>
                <p>
                  In the meantime, feel free to explore SuNovà and learn more about what we're building.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/")}
              size="lg"
              variant="hero"
              className="mt-8"
            >
              Return to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1c1c1f' }}>
      <Header />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Beta Tester Application
            </h1>
            <p className="text-lg text-muted-foreground">
              Join our founding creator community and help shape the future
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
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
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contributionAmount">
                Contribution Amount (USD) *
              </Label>
              <Input
                id="contributionAmount"
                type="number"
                min="1"
                step="0.01"
                required
                value={formData.contributionAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contributionAmount: e.target.value,
                  })
                }
                placeholder="50.00"
              />
              <p className="text-sm text-muted-foreground">
                Any amount helps build the credit cushion. Remember, you'll get this back plus rewards!
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whyPerfectTester">
                Why do you think you would be the perfect beta tester? *
              </Label>
              <Textarea
                id="whyPerfectTester"
                required
                value={formData.whyPerfectTester}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whyPerfectTester: e.target.value,
                  })
                }
                placeholder="Tell us about your experience with music creation, your technical background, or why you're excited about SuNovà..."
                rows={6}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              variant="hero"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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

export default BetaApply;
