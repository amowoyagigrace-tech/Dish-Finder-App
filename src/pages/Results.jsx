import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Heart, MapPin, Star, Clock, List, Map, DollarSign, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MapView from "@/components/MapView";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const dish = params.get("dish") || "";
  const radius = parseFloat(params.get("radius")) || 5;
  const latRaw = parseFloat(params.get("lat"));
  const lngRaw = parseFloat(params.get("lng"));
  const lat = isNaN(latRaw) ? null : latRaw;
  const lng = isNaN(lngRaw) ? null : lngRaw;
  const locationName = params.get("location") || "";

  const results = location.state?.results || [];
  const isMock = location.state?.mock;

  const [view, setView] = useState("list");
  const [savedFavs, setSavedFavs] = useState(new Set());

  const withinRadius = results.filter(r => r.within_radius);
  const beyondRadius = results.filter(r => !r.within_radius);

  useEffect(() => {
    base44.entities.Favourite.list().then(favs => {
      setSavedFavs(new Set(favs.map(f => f.place_id)));
    }).catch(() => {});
  }, []);

  const handleBack = () => {
    if (location.key && location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const toggleFavourite = async (restaurant) => {
    if (savedFavs.has(restaurant.place_id)) {
      const allFavs = await base44.entities.Favourite.list();
      const match = allFavs.find(f => f.place_id === restaurant.place_id);
      if (match) await base44.entities.Favourite.delete(match.id);
      setSavedFavs(prev => { const s = new Set(prev); s.delete(restaurant.place_id); return s; });
    } else {
      await base44.entities.Favourite.create({
        place_id: restaurant.place_id,
        name: restaurant.name,
        address: restaurant.address,
        rating: restaurant.rating,
        price_level: restaurant.price_level,
        photo_url: restaurant.photo_url,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        dish_searched: dish,
      });
      setSavedFavs(prev => new Set([...prev, restaurant.place_id]));
    }
  };

  const priceLabel = (level) => {
    if (!level) return null;
    return "£".repeat(level);
  };

  const RestaurantCard = ({ r, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-200"
    >
      {/* Photo placeholder / gradient */}
      <div className="h-36 bg-gradient-to-br from-secondary to-muted relative">
        {r.photo_url ? (
          <img src={r.photo_url} alt={r.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        {/* Fav button */}
        <button
          onClick={() => toggleFavourite(r)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
            savedFavs.has(r.place_id)
              ? "bg-destructive text-white scale-110"
              : "bg-background/80 text-muted-foreground hover:bg-background"
          }`}
        >
          <Heart className="w-4 h-4" fill={savedFavs.has(r.place_id) ? "currentColor" : "none"} />
        </button>
        {/* Distance badge */}
        {r.distance_miles !== null && (
          <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur text-xs font-medium text-foreground px-2 py-1 rounded-lg flex items-center gap-1">
            <Navigation className="w-3 h-3 text-primary" />
            {r.distance_miles} mi
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-base mb-1 leading-tight">{r.name}</h3>
        <div className="flex items-center gap-3 mb-2">
          {r.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-primary" fill="currentColor" />
              <span className="text-sm font-medium text-foreground">{r.rating}</span>
              {r.total_ratings > 0 && (
                <span className="text-xs text-muted-foreground">({r.total_ratings.toLocaleString()})</span>
              )}
            </div>
          )}
          {r.price_level && (
            <span className="text-xs text-primary font-medium">{priceLabel(r.price_level)}</span>
          )}
          {r.open_now != null && (
            <span className={`text-xs font-medium ${r.open_now ? "text-green-400" : "text-muted-foreground"}`}>
              {r.open_now ? "Open now" : "Closed"}
            </span>
          )}
        </div>
        <div className="flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">{r.address}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-5 py-4">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={handleBack} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-foreground text-base truncate capitalize">{dish}</h1>
            <p className="text-xs text-muted-foreground">{results.length} restaurants · {radius} mi radius</p>
          </div>
          {/* View toggle */}
          <div className="flex items-center bg-secondary border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 flex items-center gap-1.5 text-xs font-medium transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
            <button
              onClick={() => setView("map")}
              className={`px-3 py-2 flex items-center gap-1.5 text-xs font-medium transition-colors ${view === "map" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Map className="w-3.5 h-3.5" />
              Map
            </button>
          </div>
        </div>
      </div>

      {isMock && (
        <div className="mx-5 mt-4 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 text-xs text-muted-foreground">
          Showing sample data. Add your Google Places API key to see real restaurants.
        </div>
      )}

      {view === "map" ? (
        <div className="h-[calc(100vh-180px)]">
          <MapView
            restaurants={results}
            userLat={lat}
            userLng={lng}
            dish={dish}
          />
        </div>
      ) : (
        <div className="px-5 py-4 space-y-6 pb-8">
          {/* Within radius */}
          {withinRadius.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                Within {radius} miles ({withinRadius.length})
              </p>
              <div className="space-y-3">
                {withinRadius.map((r, i) => <RestaurantCard key={r.place_id} r={r} index={i} />)}
              </div>
            </div>
          )}

          {/* Beyond radius */}
          {beyondRadius.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Further Away ({beyondRadius.length})
              </p>
              <div className="space-y-3">
                {beyondRadius.map((r, i) => <RestaurantCard key={r.place_id} r={r} index={withinRadius.length + i} />)}
              </div>
            </div>
          )}

          {results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="font-semibold text-foreground mb-2">No restaurants found</h3>
              <p className="text-muted-foreground text-sm">Try a different dish or increase your search radius</p>
              <button
                onClick={() => navigate("/search")}
                className="mt-4 text-primary text-sm font-medium hover:underline"
              >
                ← New Search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}