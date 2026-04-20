import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Search, Star, Heart, ChevronRight } from "lucide-react";

export default function Home() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    base44.entities.UserProfile.list("-created_date", 1).then(p => setProfile(p[0] || null)).catch(() => {});
  }, []);

  const tier = profile?.subscription_tier || "free";
  const searchesUsed = profile?.searches_used || 0;
  const searchesLeft = Math.max(0, 3 - searchesUsed);

  return (
    <div className="px-5 py-6 max-w-lg mx-auto">
      {/* Title */}
      <h1 className="text-2xl font-bold text-foreground mb-1">Welcome to DishFinder</h1>
      <p className="text-muted-foreground text-sm mb-6">Find your favourite dishes nearby</p>

      {/* Search CTA button */}
      <Link to="/search">
        <div className="w-full bg-primary text-primary-foreground py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2 mb-6 hover:bg-primary/90 transition-all">
          <Search className="w-5 h-5" />
          Start Searching
        </div>
      </Link>

      {/* Subscription status card */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-5 h-5 text-primary" fill="currentColor" />
          <span className="font-semibold text-foreground">
            {tier === "free" ? "Free Plan" : tier === "monthly" ? "Monthly Plan" : "Annual Plan"}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          {tier === "free"
            ? `Searches remaining: ${searchesLeft}`
            : "Unlimited searches"}
        </p>
        {tier === "free" && (
          <Link to="/subscription">
            <div className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold text-sm text-center hover:bg-primary/90 transition-all">
              Upgrade Now
            </div>
          </Link>
        )}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold text-foreground mb-3">Quick Actions</h2>
      <div className="space-y-0 rounded-2xl border border-border overflow-hidden">
        <Link
          to="/search"
          className="flex items-center gap-3 bg-card px-4 py-4 border-b border-border hover:bg-muted transition-colors"
        >
          <Search className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm">Start a Search</p>
            <p className="text-xs text-muted-foreground">Find restaurants near you</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>
        <Link
          to="/favourites"
          className="flex items-center gap-3 bg-card px-4 py-4 hover:bg-muted transition-colors"
        >
          <Heart className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-medium text-foreground text-sm">Favourites</p>
            <p className="text-xs text-muted-foreground">View saved restaurants</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}