import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, Tractor } from "lucide-react";
import { useState } from "react";

interface AdminLoginProps {
  onLogin: (password: string) => boolean;
  onBack?: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setPassword("");
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Back button */}
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Back to App
          </Button>
        )}

        {/* App branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto shadow-lg">
            <Tractor className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">AgriManage Pro</h1>
          <p className="text-sm text-muted-foreground">
            Farm Management System
          </p>
        </div>

        {/* Login card */}
        <Card className="shadow-lg border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                data-ocid="login.input"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>

            {error && (
              <div
                data-ocid="login.error_state"
                className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                Incorrect password. Please try again.
              </div>
            )}

            <Button
              data-ocid="login.submit_button"
              type="button"
              className="w-full"
              onClick={handleSubmit}
              disabled={loading || !password}
            >
              Login
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
