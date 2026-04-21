import { useState, useEffect } from "react";
import { Favourite } from "@/api/entities";
import { Heart, MapPin, Star, Trash2, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Favourite.list()
      .then(favs => setFavourites(favs))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id) => {
    await Favourite.delete(id);
    setFavourites(prev => prev.filter(f => f.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (favourites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-8 text-center">
        <Heart className="w-16 h-16 text-muted-foreground/40 mb-5" strokeWidth={1.5} />
        <h2 className="text-xl font-bold text-foreground mb-2">No Favourites Yet</h2>
        <p className="text-muted-foreground text-sm">
          Save your favourite restaurants from search<br />results to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">Favourites</h1>
      <p className="text-muted-foreground text-sm mb-6">
        {favourites.length} saved restaurant{favourites.length !== 1 ? "s" : ""}
      </p>
      <AnimatePresence>
        <div className="space-y-3">
          {favourites.map((fav, i) => (
            <motion.div
              key={fav.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                {fav.photo_url
                  ? <img src={fav.photo_url} alt={fav.name} className="w-full h-full object-cover" />
                  : <span className="text-xl">🍽️</span>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm leading-tight mb-1 truncate">{fav.name}</h3>
                {fav.rating && (
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-3 h-3 text-primary" fill="currentColor" />
                    <span className="text-xs font-medium text-foreground">{fav.rating}</span>
                  </div>
                )}
                {fav.address && (
                  <div className="flex items-start gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground truncate">{fav.address}</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => remove(fav.id)}
                className="shrink-0 w-7 h-7 rounded-lg bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}