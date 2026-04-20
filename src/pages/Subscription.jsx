import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Check, Crown, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "£0",
    period: "forever",
    features: ["3 searches per month", "List view of results", "Basic restaurant info"],
    highlight: false,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "£3.99",
    period: "per month",
    features: ["Unlimited searches", "Map & list view", "Save favourites", "Search history", "Full restaurant details"],
    highlight: false,
  },
  {
    id: "annual",
    name: "Annual",
    price: "£23.99",
    period: "per year",
    badge: "Best Value — Save 50%",
    features: ["Everything in Monthly", "Priority support", "Offline access", "Early feature access"],
    highlight: true,
  },
];

export default function Subscription() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("annual");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (selected === "free") {
      navigate("/home");
      return;
    }
    setLoading(true);
    // Placeholder — RevenueCat integration pending
    setTimeout(() => {
      setLoading(false);
      navigate("/profile");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-5 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Choose a Plan</h1>
            <p className="text-sm text-muted-foreground">Unlock unlimited restaurant searches</p>
          </div>
        </div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 border border-primary/20 rounded-2xl p-5 mb-7 text-center"
        >
          <Crown className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="font-semibold text-foreground">Upgrade DishFinder</p>
          <p className="text-sm text-muted-foreground mt-1">Search any dish, anywhere, anytime</p>
        </motion.div>

        {/* Plans */}
        <div className="space-y-3 mb-7">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(plan.id)}
              className={`relative rounded-2xl border p-5 cursor-pointer transition-all duration-200 ${
                selected === plan.id
                  ? plan.highlight
                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                    : "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-foreground text-base">{plan.name}</p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold text-primary">{plan.price}</span>
                    <span className="text-xs text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === plan.id ? "border-primary bg-primary" : "border-border"
                }`}>
                  {selected === plan.id && <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />}
                </div>
              </div>
              <div className="space-y-1.5">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={2.5} />
                    <span className="text-xs text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 mb-4"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
          ) : selected === "free" ? (
            "Continue with Free"
          ) : (
            <><Sparkles className="w-4 h-4" /> Get {PLANS.find(p => p.id === selected)?.name} Plan</>
          )}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Payments processed securely. Cancel anytime.{" "}
          <Link to="/terms" className="text-primary hover:underline">Terms apply.</Link>
        </p>
      </div>
    </div>
  );
}