import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Music, Sparkles, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const inviteCodeSchema = z.string().trim().min(1, "Invite code is required");

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inviteCodeStep, setInviteCodeStep] = useState(true);
  const [inviteCode, setInviteCode] = useState("");
  const [validatedInviteCode, setValidatedInviteCode] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);
  const validateInviteCode = async () => {
    try {
      inviteCodeSchema.parse(inviteCode);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors({ inviteCode: error.issues[0].message });
        return;
      }
    }

    setLoading(true);
    setErrors({});

    try {
      const { data, error } = await supabase.functions.invoke('validate-invite-code', {
        body: { inviteCode: inviteCode.trim(), checkEmailMatch: false }
      });

      if (error) throw error;

      if (data.valid) {
        setValidatedInviteCode(inviteCode.trim());
        setInviteCodeStep(false);
        toast.success("Invite code accepted! Please complete your registration.");
      } else {
        setErrors({ inviteCode: data.error || "Invalid invite code" });
        toast.error(data.error || "Invalid invite code");
      }
    } catch (error: any) {
      console.error('Invite code validation error:', error);
      toast.error("Error validating invite code");
      setErrors({ inviteCode: "Error validating invite code" });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (isSignUp: boolean) => {
    const newErrors: Record<string, string> = {};
    try {
      emailSchema.parse(formData.email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.email = error.issues[0].message;
      }
    }
    try {
      passwordSchema.parse(formData.password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.password = error.issues[0].message;
      }
    }
    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm(true)) return;
    setLoading(true);

    try {
      // Validate invite code with email match
      const { data: validationData, error: validationError } = await supabase.functions.invoke('validate-invite-code', {
        body: { 
          inviteCode: validatedInviteCode, 
          email: formData.email,
          checkEmailMatch: true 
        }
      });

      if (validationError) throw validationError;

      if (!validationData.valid) {
        toast.error(validationData.error);
        setLoading(false);
        return;
      }

      // Proceed with signup
      const redirectUrl = `${window.location.origin}/dashboard`;
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("This email is already registered. Please sign in instead.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Account created! Check your email for the confirmation link.");
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  const handleSignIn = async () => {
    if (!validateForm(false)) return;
    setLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else {
          toast.error(error.message);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };
  return <div className="min-h-screen flex items-center justify-center parallax-container film-grain" style={{
    backgroundColor: '#1c1c1f'
  }}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '2s'
      }}></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{
        animationDelay: '4s'
      }}></div>
      </div>

      <div className="cinematic-overlay" />

      <div className="container mx-auto px-6 relative z-10 max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-4">
            <div className="sunova-logo gradient-text text-4xl cursor-pointer hover:opacity-80 transition-opacity"></div>
          </Link>
          <p className="text-muted-foreground">
            You bring the track, Sunova brings the frame.
          </p>
        </div>

        <Card className="glass-card" style={{
        backgroundColor: '#1c1c1f',
        outline: '1px solid #6a6a71'
      }}>
          <CardContent style={{
          backgroundColor: '#1c1c1f'
        }}>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 my-[5px] py-[5px] mx-0 px-0">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup" disabled={inviteCodeStep}>Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" type="email" placeholder="your@email.com" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className={errors.email ? "border-destructive" : ""} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input id="signin-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className={errors.password ? "border-destructive pr-10" : "pr-10"} />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-8 w-8 cursor-pointer inline-flex items-center justify-center transition-colors" onClick={() => setShowPassword(!showPassword)}>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
                      background: `
                          radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                          radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                          radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                          radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                          radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                          #d0583c`
                    }} />
                      <span className="relative z-10">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </span>
                    </div>
                  </div>
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div onClick={() => !loading && handleSignIn()} className="relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-10 px-4 py-2 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors text-xs font-normal w-full" style={loading ? {
                opacity: 0.5,
                pointerEvents: 'none'
              } : {}}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
                  background: `
                      radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                      radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                      radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                      radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                      radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                      #d0583c`
                }} />
                  <span className="relative z-10">
                    {loading ? "Signing In..." : "Sign In"}
                  </span>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                {inviteCodeStep ? (
                  // Invite Code Entry Step
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          <KeyRound className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Enter Your Invite Code
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Sunova is currently in beta. Please enter the invite code from your beta application approval email.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="invite-code">Invite Code</Label>
                      <Input 
                        id="invite-code" 
                        type="text" 
                        placeholder="Enter your invite code" 
                        value={inviteCode} 
                        onChange={(e) => {
                          setInviteCode(e.target.value);
                          if (errors.inviteCode) {
                            setErrors({});
                          }
                        }}
                        className={errors.inviteCode ? "border-destructive" : ""} 
                      />
                      {errors.inviteCode && <p className="text-sm text-destructive">{errors.inviteCode}</p>}
                    </div>

                    <div onClick={() => !loading && validateInviteCode()} className="relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-10 px-4 py-2 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors text-xs font-normal w-full" style={loading ? {
                      opacity: 0.5,
                      pointerEvents: 'none'
                    } : {}}>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
                        background: `
                            radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                            radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                            radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                            radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                            radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                            #d0583c`
                      }} />
                      <span className="relative z-10">
                        {loading ? "Validating..." : "Continue"}
                      </span>
                    </div>

                    <Alert style={{
                      backgroundColor: '#1c1c1f',
                      border: '1px solid #6a6a71'
                    }}>
                      <AlertDescription className="text-sm">
                        Don't have an invite code? <Link to="/beta" className="text-primary hover:underline">Apply for beta access</Link>
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  // Sign Up Form (shown after valid invite code)
                  <>
                    <Alert style={{
                      backgroundColor: '#1c1c1f',
                      border: '1px solid #6a6a71'
                    }} className="mb-4">
                      <AlertDescription className="text-sm text-green-400">
                        ✓ Invite code accepted! Please complete your registration.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" placeholder="Use the same email from your beta application" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className={errors.email ? "border-destructive" : ""} />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className={errors.password ? "border-destructive pr-10" : "pr-10"} />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-8 w-8 cursor-pointer inline-flex items-center justify-center transition-colors" onClick={() => setShowPassword(!showPassword)}>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
                          background: `
                              radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                              radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                              radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                              radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                              radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                              #d0583c`
                        }} />
                          <span className="relative z-10">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </span>
                        </div>
                      </div>
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={e => handleInputChange('confirmPassword', e.target.value)} className={errors.confirmPassword ? "border-destructive" : ""} />
                      {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                    </div>

                    <div onClick={() => !loading && handleSignUp()} className="relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-10 px-4 py-2 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors text-xs font-normal w-full" style={loading ? {
                    opacity: 0.5,
                    pointerEvents: 'none'
                  } : {}}>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
                      background: `
                          radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                          radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                          radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                          radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                          radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                          #d0583c`
                    }} />
                      <span className="relative z-10">
                        {loading ? "Creating Account..." : "Create Account"}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setInviteCodeStep(true);
                        setValidatedInviteCode("");
                        setInviteCode("");
                      }}
                      className="w-full text-xs"
                    >
                      ← Use a different invite code
                    </Button>

                    <Alert style={{
                    backgroundColor: '#1c1c1f',
                    border: '1px solid #6a6a71'
                  }}>
                      <AlertDescription className="text-sm">
                        You'll receive a confirmation email to verify your account.
                      </AlertDescription>
                    </Alert>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Auth;