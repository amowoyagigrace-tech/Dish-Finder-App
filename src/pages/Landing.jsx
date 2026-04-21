import { Link } from "react-router-dom";
const LANDING_BG = "";

// Logo icon — stylised "D" with fork
function DishFinderLogo({ size = 72 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-2xl bg-secondary border border-border flex items-center justify-center overflow-hidden"
    >
      {/* Custom D + fork SVG matching the screenshot */}
      <svg viewBox="0 0 60 60" width={size * 0.7} height={size * 0.7} fill="none">
        {/* Fork */}
        <line x1="14" y1="10" x2="14" y2="50" stroke="#D6C5AB" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="10" y1="10" x2="10" y2="22" stroke="#D6C5AB" strokeWidth="2" strokeLinecap="round"/>
        <line x1="14" y1="10" x2="14" y2="22" stroke="#D6C5AB" strokeWidth="2" strokeLinecap="round"/>
        <line x1="18" y1="10" x2="18" y2="22" stroke="#D6C5AB" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 22 Q14 28 18 22" stroke="#D6C5AB" strokeWidth="2" fill="none"/>
        {/* D letter */}
        <text x="24" y="43" fontFamily="serif" fontWeight="700" fontSize="32" fill="#D6C5AB">D</text>
      </svg>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-between overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LANDING_BG})` }}
      />
      {/* Dark overlay — heavy, matching screenshot */}
      <div className="absolute inset-0 bg-background/75" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-8 py-16 w-full max-w-sm mx-auto">
        <p className="text-foreground text-base mb-2 font-normal">Welcome to</p>

        <h1 className="text-5xl font-bold text-primary mb-8 leading-tight" style={{ fontFamily: "serif" }}>
          DishFinder
        </h1>

        <DishFinderLogo size={88} />

        <p className="text-foreground text-lg mt-8 mb-10 leading-snug">
          Discover the Dishes You<br />Crave
        </p>

        <Link
          to="/home"
          className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-lg text-center hover:bg-primary/90 transition-all"
        >
          Begin
        </Link>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8 text-center">
        <p className="text-muted-foreground text-xs">DishFinder © 2025. All Rights Reserved.</p>
      </div>
    </div>
  );
}