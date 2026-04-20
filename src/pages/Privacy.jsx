import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background px-5 py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/" className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
      </div>

      <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
        <p className="text-xs text-muted-foreground">Last updated: January 2026</p>

        {[
          { title: "1. Information We Collect", body: "We collect your location (latitude/longitude) to power restaurant searches, your search history (dish names, radius, results), and saved favourites. We also store your account email and subscription status." },
          { title: "2. How We Use Your Information", body: "Your location is used solely to find restaurants near you and is never stored permanently. Search history helps us improve results and show your recent searches. We do not use your data for advertising." },
          { title: "3. Location Data", body: "DishFinder requests location permission to search for nearby restaurants. You may decline location access, but search results will be less relevant. Location data is not shared with third parties." },
          { title: "4. Third-Party Services", body: "We use Google Places API to retrieve restaurant data. Your search queries are transmitted to Google's servers subject to Google's Privacy Policy. We use RevenueCat for subscription management." },
          { title: "5. Data Retention", body: "Search history is stored until you delete it. Favourite restaurants are stored until removed. Account data is retained while your account is active. You may request deletion at any time." },
          { title: "6. Data Security", body: "We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction." },
          { title: "7. Your Rights", body: "You have the right to access, correct, or delete your personal data. You may also request data portability or object to processing. Contact us through the app to exercise these rights." },
          { title: "8. Children's Privacy", body: "DishFinder is not directed to children under 13. We do not knowingly collect personal information from children under 13." },
          { title: "9. Changes to This Policy", body: "We may update this Privacy Policy from time to time. We will notify you of significant changes via the app." },
        ].map(({ title, body }) => (
          <div key={title}>
            <h2 className="text-base font-semibold text-foreground mb-2">{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}