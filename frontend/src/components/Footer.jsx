import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";
import { Heart, Sparkles, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-card/50 backdrop-blur-sm text-foreground transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-11 md:py-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="DevPulse Logo"
                className="size-11 object-contain dark:invert"
              />
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
                DevPulse
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              A modern digital space dedicated to web development, technology
              innovations, creative tutorials, and insightful tech trends. Built
              for developers and curious minds.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="size-9 rounded-lg border-2 border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <FaGithub className="size-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="size-9 border-2 rounded-lg border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <FaTwitter className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="size-9 border-2 dark:shadow-2xl dark:shadow-gray-500 rounded-lg border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <FaLinkedin className="size-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="size-9 border-2 rounded-lg border-border/70 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <FaFacebook className="size-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
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

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Stay in the loop
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Get the latest weekly digests, curated technical articles, and
              updates straight to your inbox.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
                <input
                  type="email"
                  placeholder="Your email address..."
                  className="w-full text-xs h-9 pl-9 pr-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button size="sm" className="h-9 px-3 gap-1">
                <span>Join</span>
                <ArrowRight className="size-3" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} DevPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
