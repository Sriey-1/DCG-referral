
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderCheck, Shield } from "lucide-react";
import { authService } from "@/services/api";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email, password });
      
      // Call login API endpoint
      const response = await authService.login(email, password);
      console.log("Login response:", response);
      
      // Save token and user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("isAuthenticated", "true");
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // More detailed error handling
      let errorMessage = "Please check your credentials and try again.";
      if (error.response) {
        console.log("Error response:", error.response);
        errorMessage = error.response.data?.message || errorMessage;
      }
      
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <FolderCheck className="h-12 w-12 text-dubai-gold" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">Dubai Referral Nexus</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="/forgot-password" className="text-sm text-dubai-teal hover:underline">
                Forgot password?
              </a>
            </div>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              autoComplete="current-password"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-dubai-navy hover:bg-dubai-navy/90 text-white" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="loader-sm mr-2"></span>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Sign In
              </span>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/register" className="text-dubai-teal hover:underline">
            Create account
          </a>
        </p>
        {/* Demo login info */}
        <div className="absolute bottom-[-65px] text-xs text-gray-500 text-center w-full">
          <p>Available accounts:</p>
          <p>1. demo@example.com / password123</p>
          <p>2. john@example.com / manager2023</p>
        </div>
      </CardFooter>
    </Card>
  );
}
