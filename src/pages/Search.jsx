import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { SearchHistory, UserProfile } from "@/api/entities";
import { Search, MapPin, Loader2, RefreshCw } from "lucide-react";

export default function SearchPage() {
  const navigate = useNavigate();
  const [dish, setDish] = useState("");
  const [radius, setRadius] = useState(5);
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [locating, setLocating] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get("dish");
    if (d) setDish(d);
    UserProfile.list().then(p => setProfile(p[0] || null)).catch(() => {});
    detectLocation();
  }, []);

  const detectLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationName(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
          setLocating(false);
        },
        () => {
          setLocationName("Location unavailable");
          setLocating(false);
        },
        { timeout: 8000 }
      );
    } else {
      setLocationName("Location unavailable");
      setLocating(false);
    }
  };

  const handleSearch = async () => {
    if (!dish.trim()) { setError("Please enter a dish name"); return; }
    const tier = profile?.subscription_tier || "free";
    const searchesUsed = profile?.searches_used || 0;
    if (tier === "free" && searchesUsed >= 3) { navigate("/subscription"); return; }

    setSearching(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        "https://dmttwtuubhadvsqpnncx.supabase.co/functions/v1/searchRestaurants",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            dish,
            latitude: (location?.lat && !isNaN(location.lat)) ? location.lat : null,
            longitude: (location?.lng && !isNaN(location.lng)) ? location.lng : null,
            radius_miles: radius,
          }),
        }
      );

      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      const results = data?.results || [];

      SearchHistory.create({
        dish,
        location_lat: location?.lat || null,
        location_lng: location?.lng || null,
        location_name: locationName,
        radius_miles: radius,
        result_count: results.length
      }).catch(() => {});

      if (profile) {
        UserProfile.update(profile.id, {
          searches_used: (profile.searches_used || 0) + 1
        }).catch(() => {});
      }

      const params = new URLSearchParams({
        dish,
        radius: radius.toString(),
        lat: location?.lat?.toString() || "",
        lng: location?.lng?.toString() || "",
        location: locationName
      });
      navigate(`/results?${params.toString()}`, { state: { results, mock: data?.mock } });

    } catch (err) {
      setError(err.message || "Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="px-5 py-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">Find Your Dish</h1>
      <p className="text-muted-foreground text-sm mb-7">
        Search for restaurants serving your favourite<br />dishes
      </p>
      <div className="mb-2">
        <label className="block text-sm font-medium text-foreground mb-2">
          What dish are you craving?
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={dish}
            onChange={e => { setDish(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="e.g. chicken with creamy mushroom sai..."
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        {error && <p className="text-destructive text-xs mt-1">{error}</p>}
      </div>
      <div className="mb-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground">Search Radius</label>
          <span className="text-sm font-bold text-primary">{radius.toFixed(1)} miles</span>
        </div>
        <input
          type="range" min={1} max={25} step={0.5} value={radius}
          onChange={e => setRadius(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-border"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
          <span>1 mi</span><span>25 mi</span>
        </div>
      </div>
      <div className="mb-7">
        <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3.5">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span className="text-sm text-foreground flex-1 truncate">
            {locating ? "Detecting location..." : locationName || "Location unavailable"}
          </span>
          <button onClick={detectLocation} disabled={locating} className="shrink-0">
            {locating
              ? <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
              : <RefreshCw className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />}
          </button>
        </div>
      </div>
      <button
        onClick={handleSearch}
        disabled={searching || !dish.trim()}
        className="w-full bg-primary text-primary-foreground py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        {searching ? "Searching..." : "Search Restaurants"}
      </button>
      <p className="text-center text-muted-foreground text-xs mt-8">DishFinder © 2025. All Rights Reserved.</p>
    </div>
  );
}