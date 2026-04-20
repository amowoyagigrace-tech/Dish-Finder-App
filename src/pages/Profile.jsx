import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Star, ChevronRight, FileText, Shield, Loader2, User, Check } from "lucide-react";

const CUISINES = ["Italian", "Chinese", "Indian", "Japanese", "Mexican", "Thai", "British", "Mediterranean", "American", "French"];
const DIETARY_OPTIONS = ["none", "vegetarian", "vegan", "halal", "gluten-free"];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({ preferred_cuisines: [], dietary_preference: "none", default_radius: 5 });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.auth.me().catch(() => null),
      base44.entities.UserProfile.list("-created_date", 1).catch(() => []),
    ]).then(([u, profiles]) => {
      setUser(u);
      const p = profiles[0] || null;
      setProfile(p);
      if (p) {
        setPrefs({
          preferred_cuisines: p.preferred_cuisines || [],
          dietary_preference: p.dietary_preference || "none",
          default_radius: p.default_radius || 5,
        });
      }
      setLoading(false);
    });
  }, []);

  const toggleCuisine = (c) => {
    setPrefs(prev => ({
      ...prev,
      preferred_cuisines: prev.preferred_cuisines.includes(c)
        ? prev.preferred_cuisines.filter(x => x !== c)
        : [...prev.preferred_cuisines, c],
    }));
  };

  const savePreferences = async () => {
    setSaving(true);
    if (profile) {
      await base44.entities.UserProfile.update(profile.id, prefs);
    } else {
      const created = await base44.entities.UserProfile.create({ ...prefs, subscription_tier: "free", searches_used: 0 });
      setProfile(created);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tier = profile?.subscription_tier || "free";
  const tierLabel = tier === "free" ? "Free (3 searches)" : tier === "monthly" ? "Monthly" : "Annual";
  const searchesUsed = profile?.searches_used || 0;
  const searchesLeft = tier === "free" ? Math.max(0, 3 - searchesUsed) : "∞";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-5 py-6 max-w-lg mx-auto pb-10">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-3">
          <User className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <p className="text-muted-foreground text-sm">{user?.email || "user@dishfinder.app"}</p>
      </div>

      {/* Subscription section */}
      <h2 className="text-lg font-bold text-foreground mb-3">Subscription</h2>
      <div className="bg-card border border-border rounded-2xl p-4 mb-6">
        {/* Current plan row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Current Plan</p>
            <p className="font-semibold text-foreground">{tierLabel}</p>
          </div>
          <Star className="w-5 h-5 text-primary" fill="currentColor" />
        </div>

        {/* Stats row */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">Searches Used</p>
            <p className="font-bold text-foreground text-lg">{searchesUsed}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">Searches Remaining</p>
            <p className="font-bold text-foreground text-lg">{searchesLeft}</p>
          </div>
        </div>

        {/* Upgrade button */}
        <Link to="/subscription">
          <div className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold text-sm text-center hover:bg-primary/90 transition-all">
            Upgrade Plan →
          </div>
        </Link>
      </div>

      {/* Preferences section */}
      <h2 className="text-lg font-bold text-foreground mb-3">Preferences</h2>
      <div className="bg-card border border-border rounded-2xl p-4 mb-6 space-y-5">

        {/* Dietary */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Dietary Preference</p>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => setPrefs(prev => ({ ...prev, dietary_preference: opt }))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  prefs.dietary_preference === opt
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Cuisines */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Favourite Cuisines</p>
          <div className="flex flex-wrap gap-2">
            {CUISINES.map(c => (
              <button
                key={c}
                onClick={() => toggleCuisine(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  prefs.preferred_cuisines.includes(c)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Default radius */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">Default Search Radius</p>
            <span className="text-xs font-bold text-primary">{prefs.default_radius} mi</span>
          </div>
          <input
            type="range"
            min={1} max={25} step={0.5}
            value={prefs.default_radius}
            onChange={e => setPrefs(prev => ({ ...prev, default_radius: Number(e.target.value) }))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-border"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1 mi</span><span>25 mi</span>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={savePreferences}
          disabled={saving}
          className="w-full bg-primary text-primary-foreground py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Preferences"}
        </button>
      </div>

      {/* Settings section */}
      <h2 className="text-lg font-bold text-foreground mb-3">Settings</h2>
      <div className="rounded-2xl border border-border overflow-hidden mb-6">
        <Link
          to="/terms"
          className="flex items-center gap-3 bg-card px-4 py-4 border-b border-border hover:bg-muted transition-colors"
        >
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-sm text-foreground">Terms of Service</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>
        <Link
          to="/privacy"
          className="flex items-center gap-3 bg-card px-4 py-4 hover:bg-muted transition-colors"
        >
          <Shield className="w-4 h-4 text-muted-foreground" />
          <span className="flex-1 text-sm text-foreground">Privacy Policy</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>

      {/* About section */}
      <h2 className="text-lg font-bold text-foreground mb-3">About</h2>
      <div className="bg-card border border-border rounded-2xl p-4 text-center">
        <p className="font-semibold text-foreground text-sm mb-1">DishFinder v1.0.0</p>
        <p className="text-muted-foreground text-xs">Find restaurants serving your favourite dishes</p>
      </div>

      <p className="text-center text-muted-foreground text-xs mt-8">DishFinder © 2025. All Rights Reserved.</p>
    </div>
  );
}