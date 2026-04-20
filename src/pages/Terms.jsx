import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background px-5 py-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/" className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Terms of Service</h1>
      </div>

      <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground text-sm leading-relaxed">
        <p className="text-xs text-muted-foreground">Last updated: January 2026</p>

        {[
          { title: "1. Acceptance of Terms", body: "By accessing or using DishFinder, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service." },
          { title: "2. Use of Service", body: "DishFinder provides a restaurant search service. You agree to use this service only for lawful purposes and in a manner that does not infringe the rights of others." },
          { title: "3. Subscriptions", body: "DishFinder offers Free, Monthly (£3.99/mo), and Annual (£23.99/yr) plans. Paid plans provide unlimited searches. Subscriptions auto-renew unless cancelled. You may cancel at any time from your profile." },
          { title: "4. Data & Privacy", body: "We collect location data to provide search functionality. We do not sell your personal data to third parties. See our Privacy Policy for full details." },
          { title: "5. Intellectual Property", body: "The DishFinder service and its original content, features and functionality are owned by DishFinder and are protected by international copyright, trademark, and other intellectual property laws." },
          { title: "6. Limitation of Liability", body: "DishFinder shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service." },
          { title: "7. Changes to Terms", body: "We reserve the right to modify these terms at any time. We will notify users of significant changes. Continued use of the service after changes constitutes acceptance." },
          { title: "8. Contact", body: "For questions about these terms, please contact us through the app's feedback system." },
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