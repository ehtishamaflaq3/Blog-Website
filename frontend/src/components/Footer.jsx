import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/logo.png";
import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const socialLinks = [
  { field: "github", label: "GitHub", icon: FaGithub },
  { field: "instagram", label: "Instagram", icon: FaInstagram },
  { field: "linkedin", label: "LinkedIn", icon: FaLinkedin },
  { field: "facebook", label: "Facebook", icon: FaFacebook },
];

const getSafeSocialUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return "";

  const urlValue = /^https?:\/\//i.test(value.trim())
    ? value.trim()
    : `https://${value.trim().replace(/^\/\//, "")}`;

  try {
    const url = new URL(urlValue);
    return ["http:", "https:"].includes(url.protocol) && url.hostname.includes(".")
      ? url.href
      : "";
  } catch {
    return "";
  }
};

const Footer = () => {
  const { user } = useSelector((store) => store.auth);

  const handleFeedbackSubmit = (event) => {
    event.preventDefault();
    const response = new FormData(event.currentTarget).get("response");
    if (typeof response !== "string" || !response.trim()) return;
    const feedbackEmail = import.meta.env.VITE_FEEDBACK_EMAIL?.trim();
    if (!feedbackEmail) {
      toast.add({
        title: "Feedback email unavailable",
        description: "Feedback email is not configured for this deployment.",
        type: "error",
      });
      return;
    }
    const subject = encodeURIComponent("Feedback for DevPulse");
    const body = encodeURIComponent(response.trim());
    window.location.href = `mailto:${feedbackEmail}?subject=${subject}&body=${body}`;
  };
  return (
    <footer className="border-t border-border/60 bg-card/50 backdrop-blur-sm text-foreground transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="DevPulse Logo"
                className="size-9 object-contain dark:invert"
              />
              <span className="font-extrabold text-xl tracking-tight from-primary to-muted-foreground bg-clip-text text-transparent">
                DevPulse
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              A modern digital space dedicated to web development, technology
              innovations, creative tutorials, and insightful tech trends. Built
              for developers and curious minds.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map(({ field, label, icon: Icon }) => {
                const profileUrl = getSafeSocialUrl(user?.[field]);
                const className =
                  "size-8 rounded-lg border border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors";

                if (!profileUrl) {
                  return (
                    <button
                      key={field}
                      type="button"
                      aria-label={label}
                      title={label}
                      onClick={() =>
                        toast.add({
                          title: "Profile link missing",
                          description:
                            "Please add profile link in your profile section.",
                          type: "info",
                        })
                      }
                      className={className}
                    >
                      <Icon className="size-4" />
                    </button>
                  );
                }

                return (
                  <a
                    key={field}
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className={className}
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>
          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-primary transition-colors hover:underline">
                  Explore Blogs
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors hover:underline">
                  About Platform
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/create-blog"
                  className="hover:text-primary transition-colors inline-flex items-center gap-1 hover:underline"
                >
                  Write an Article
                </Link>
              </li>
            </ul>
          </div>
          {/* Feedback Column */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Share your feedback
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Have a question or suggestion? Write a message and send it directly to us.
            </p>
            <form onSubmit={handleFeedbackSubmit} className="space-y-2 pt-1">
              <label htmlFor="footer-feedback" className="sr-only">
                Your feedback
              </label>
              <div className="relative">
                <Mail className="size-4 absolute left-3 top-3 text-muted-foreground" />
                <textarea
                  id="footer-feedback"
                  name="response"
                  required
                  rows={2}
                  placeholder="Write your response..."
                  className="w-full resize-y rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button type="submit" size="sm" className="h-8 px-3 gap-2">
                <span>Send response</span>
                <Send className="size-3" />
              </Button>
              <p className="text-xs text-muted-foreground">
                Your email app will open with your message ready to send.
              </p>
            </form>
          </div>
        </div>
        <div className="mt-5 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} DevPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;