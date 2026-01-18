import { Lightbulb, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InfoBoxProps {
  type?: "tip" | "warning" | "success" | "highlight";
  title?: string;
  children: React.ReactNode;
}

const InfoBox = ({ type = "tip", title, children }: InfoBoxProps) => {
  const icons = {
    tip: Lightbulb,
    warning: AlertCircle,
    success: CheckCircle2,
    highlight: Sparkles
  };

  const Icon = icons[type];
  
  const styles = {
    tip: "border-accent/30 bg-accent/5",
    warning: "border-secondary/30 bg-secondary/5",
    success: "border-primary/30 bg-primary/5",
    highlight: "border-purple-500/30 bg-purple-500/5"
  };

  return (
    <Card className={`${styles[type]} border-2 my-6`}>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Icon className="h-6 w-6 flex-shrink-0 mt-1" />
          <div>
            {title && (
              <h4 className="font-display font-semibold text-lg mb-2">{title}</h4>
            )}
            <div className="text-muted-foreground">{children}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
