import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import authimg from "../assets/auth.jpg";
import logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !user.firstName.trim() ||
      !user.lastName.trim() ||
      !user.email.trim() ||
      !user.password
    ) {
      toast.add({
        title: "Required fields missing",
        description: "Please complete all fields to sign up.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        user,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        toast.add({
          title: "Account Created!",
          description: "Your account has been created. Please log in.",
          type: "success",
        });
        navigate("/login");
      }
    } catch (error) {
      toast.add({
        title: "Signup Failed",
        description:
          error.response?.data?.message ||
          "Could not create your account. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid h-full min-h-0 w-full grid-cols-1 overflow-hidden bg-background text-foreground transition-colors lg:grid-cols-2">
      {/* Left Column: Visual Showcase */}
      <div className="relative hidden min-h-0 items-center justify-center overflow-hidden bg-muted lg:flex">
        <img
          src={authimg}
          alt="Creative Workspace"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 from-slate-950/80 via-slate-950/45 to-indigo-950/30" />
        <div className="relative z-10 max-w-lg space-y-5 p-12 text-center text-white lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-md">
            <span>Start Your Writing Journey</span>
          </div>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight xl:text-4xl">
            "Your perspective might be the exact answer another developer is
            searching for."
          </h2>
          <p className="max-w-md text-sm leading-6 text-white/75">
            Publish your stories, build your personal brand, and become a
            recognized voice in modern web engineering.
          </p>
        </div>
      </div>

      {/* Right Column: Signup Form */}
      <div className="flex min-h-0 items-center justify-center overflow-hidden px-4 py-3 max-[700px]:py-1 sm:px-6 sm:py-5 lg:px-10 lg:py-8">
        <div className="w-full max-w-md space-y-4 rounded-3xl border border-border/70 bg-card/70 p-5 shadow-xl shadow-black/5 max-[700px]:space-y-3 max-[700px]:p-3 sm:space-y-5 sm:p-7">
          {/* Header */}
          <div className="space-y-2 text-center max-[700px]:space-y-1 lg:text-left">
            <div className="mb-3 flex items-center justify-center gap-2.5 max-[700px]:mb-1 lg:justify-start">
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
              Create an account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Enter your details below to get started for free.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 max-[700px]:space-y-2">
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 max-[700px]:space-y-1">
                <Label className="text-xs font-semibold">First Name</Label>
                <div className="relative">
                  <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                    placeholder="Alex"
                    required
                    className="h-10 w-full rounded-xl border border-border bg-background/80 pl-9 pr-3 text-sm text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary/40 max-[700px]:h-9"
                  />
                </div>
              </div>
              <div className="space-y-1.5 max-[700px]:space-y-1">
                <Label className="text-xs font-semibold">Last Name</Label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  placeholder="Morgan"
                  required
                  className="h-10 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary/40 max-[700px]:h-9"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5 max-[700px]:space-y-1">
              <Label className="text-xs font-semibold">Email Address</Label>
              <div className="relative">
                <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="you@domain.com"
                  required
                  className="h-10 w-full rounded-xl border border-border bg-background/80 pl-9 pr-3 text-sm text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary/40 max-[700px]:h-9"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 max-[700px]:space-y-1">
              <Label className="text-xs font-semibold">Password</Label>
              <div className="relative">
                <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters..."
                  required
                  className="h-10 w-full rounded-xl border border-border bg-background/80 pl-9 pr-10 text-sm text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary/40 max-[700px]:h-9"
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
              className="mt-1 h-10 w-full gap-2 rounded-xl font-semibold shadow-xs max-[700px]:h-9"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Get Started</span>
              )}
            </Button>
          </form>

          {/* Footer note */}
          <p className="pt-1 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
