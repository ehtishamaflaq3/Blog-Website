import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "./redux/authSlice.js";
import authimg from "../assets/auth.jpg";
import logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { Eye, EyeOff, Loader2, Lock, Mail, Sparkles } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginUser.email || !loginUser.password) {
      toast.add({
        title: "Required fields missing",
        description: "Please enter your email and password.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/login",
        loginUser,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.add({
          title: "Welcome back!",
          description: `Logged in as ${res.data.user?.firstName || "user"}.`,
          type: "success",
        });
        dispatch(setUser(res.data.user));
        navigate("/");
      }
    } catch (error) {
      toast.add({
        title: "Login Failed",
        description:
          error.response?.data?.message ||
          "Invalid email or password. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 overflow-hidden bg-background text-foreground transition-colors lg:grid-cols-2">
      {/* Left Column: Visual Showcase */}
      <div className="relative hidden min-h-0 items-center justify-center overflow-hidden bg-muted p-12 lg:flex">
        <img
          src={authimg}
          alt="Creative Workspace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 from-slate-950/80 via-slate-950/45 to-indigo-950/30" />

        <div className="relative z-10 max-w-lg space-y-5 text-center text-white lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-xs">
            <span>Join 10,000+ Tech Enthusiasts</span>
          </div>
          <h2 className="text-3xl backdrop-blur-xs font-extrabold leading-tight tracking-tight xl:text-4xl">
            "Words have the power to transform code into shared wisdom."
          </h2>
          <p className="max-w-md text-sm leading-6 text-white/75 backdrop-blur-xs">
            Sign in to publish tutorials, track comments on your stories, and
            connect with like-minded developers worldwide.
          </p>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="flex min-h-0 items-center justify-center overflow-hidden px-4 py-3 sm:px-6 sm:py-5 lg:px-10 lg:py-8">
        <div className="w-full max-w-md space-y-5 rounded-3xl border border-border/70 bg-card/70 p-5 shadow-xl shadow-black/5 sm:p-7">
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="mb-3 flex items-center justify-center gap-2.5 lg:justify-start">
              <img
                src={logo}
                alt="DevPulse Logo"
                className="size-8 object-contain dark:invert"
              />
              <span className="font-extrabold text-lg tracking-tight">
                DevPulse
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Address</Label>
              <div className="relative">
                <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={loginUser.email}
                  onChange={handleChange}
                  placeholder="you@domain.com"
                  required
                  className="h-10 w-full rounded-xl border border-border bg-background/80 pl-9 pr-3 text-sm text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Password</Label>
              <div className="relative">
                <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginUser.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="h-10 w-full rounded-xl border border-border bg-background/80 pl-9 pr-10 text-sm text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="mt-1 h-10 w-full gap-2 rounded-xl font-semibold shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </Button>
          </form>

          {/* Footer note */}
          <p className="pt-1 text-center text-xs text-muted-foreground">
            Don't have an account yet?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
