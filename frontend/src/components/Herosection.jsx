import { Link, useNavigate } from "react-router-dom";
import heroimg from "../assets/blog2.png";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Sparkles, TrendingUp, Users, PenTool } from "lucide-react";

const Herosection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-8 md:py-12 lg:py-5">
      {/* Subtle ambient gradient glow in the background */}
      <div className="absolute left-1/2 w-112.5 h-75 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.18]">
              Where passionate minds share{" "}
              <span className="bg-linear-to-r from-blue-500 via-indigo-800 to-purple-900 bg-clip-text text-transparent">
                cutting-edge
              </span>{" "}
              stories.
            </h1>

            {/* Lead Paragraph */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Stay ahead with curated tutorials, deep-dives into modern web
              frameworks, digital marketing insights, and practical engineering
              guides written by creators like you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1">
              <Button
                size="default"
                onClick={() => navigate("/blogs")}
                className="h-13 px-5 gap-3 text-xs sm:text-sm font-semibold shadow-md shadow-primary/20"
              >
                <BookOpen className="size-4" />
                <span>Explore Articles</span>
                <ArrowRight className="size-4" />
              </Button>

              <Button
                variant="outline"
                size="default"
                onClick={() => navigate("/dashboard/create-blog")}
                className="h-13 px-5 gap-4 text-xs sm:text-sm font-semibold hover:border-primary/50"
              >
                <PenTool className="size-4 text-primary" />
                <span>Start Writing</span>
              </Button>
            </div>
          </div>
          {/* Right Column: Hero Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-85 sm:max-w-95 lg:max-w-100">
              <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-blue-500/15 to-purple-500/15 blur-xl opacity-70 group-hover:opacity-100 transition duration-600 -z-10" />
              <div className="relative rounded-2xl border border-border/80 bg-card p-3 shadow-xl overflow-hidden">
                <img
                  src={heroimg}
                  alt="Tech & Web illustration"
                  className="w-full h-auto object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Herosection;