import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { formatCredits } from "@/utils/credits";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface LogoHeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

const LogoHeader = ({ showBackButton = false, onBack, rightContent, className = "" }: LogoHeaderProps) => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [isCreditsDialogOpen, setIsCreditsDialogOpen] = useState(false);
  const [selectedCreditAmount, setSelectedCreditAmount] = useState(25);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  const creditPackages = [10, 25, 50, 100];

  const handlePurchaseCredits = async () => {
    if (!selectedCreditAmount || selectedCreditAmount < 5) {
      toast.error('Please choose a credit amount of at least $5.');
      return;
    }

    if (!user) {
      toast.error('Please sign in to purchase credits.');
      return;
    }

    setIsCreatingCheckout(true);
    try {
      const { data, error } = await supabase.functions.invoke<{ url: string }>('create-checkout-session', {
        body: {
          amount: selectedCreditAmount,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.url) {
        throw new Error('Checkout session could not be created.');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Failed to create Stripe checkout session', error);
      const message = error instanceof Error ? error.message : 'Unable to start checkout';
      toast.error(message);
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  return (
    <>
      <header className={`border-b border-muted/20 sticky top-0 z-50 ${className}`} style={{ backgroundColor: '#1c1c1f' }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#1c1c1f', backgroundImage: 'none' }}>
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center">
              <span className="sunova-logo text-3xl text-white"></span>
            </div>
          </div>

          {/* Right side content */}
          <div className="flex items-center gap-4">
            {user && profile && (
              <button
                onClick={() => setIsCreditsDialogOpen(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <span className="font-medium text-foreground">{formatCredits(profile.credit_balance)}</span> credits
              </button>
            )}
            {rightContent}
          </div>
        </div>
      </header>

      <Dialog open={isCreditsDialogOpen} onOpenChange={setIsCreditsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Credits</DialogTitle>
            <DialogDescription>
              Select a credit package to continue creating amazing content
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            {creditPackages.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedCreditAmount(amount)}
                className={`relative overflow-hidden group rounded-lg p-6 border-2 transition-all ${
                  selectedCreditAmount === amount
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">${amount}</div>
                  <div className="text-sm text-muted-foreground mt-1">{amount} credits</div>
                </div>
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreditsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePurchaseCredits}
              disabled={isCreatingCheckout}
              className="gradient-button relative overflow-hidden group rounded-[35px] hover:opacity-60 transition-opacity duration-300"
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
              <span className="relative z-10 flex items-center justify-center text-sm text-white">
                {isCreatingCheckout ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Purchase $${selectedCreditAmount}`
                )}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoHeader;