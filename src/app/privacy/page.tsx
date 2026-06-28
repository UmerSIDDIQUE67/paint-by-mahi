import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Paint by Mahi. How we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-4xl font-bold text-stone-800 mb-2">Privacy Policy</h1>
      <p className="text-stone-500 mb-10">Last updated: January 2025</p>
      <div className="space-y-8 text-stone-600 leading-relaxed">
        {[
          { title: "1. Information We Collect", content: "We collect information you provide when placing orders or contacting us: name, email address, phone number, shipping address, and order details. We may also collect device and browser information for analytics purposes." },
          { title: "2. How We Use Your Information", content: "Your information is used to process orders, communicate about your purchase, send order updates, and respond to inquiries. We do not sell your personal data to third parties." },
          { title: "3. Payment Information", content: "Payment processing is handled by Stripe (for card payments) and local payment gateways. We do not store your payment card information on our servers." },
          { title: "4. Cookies", content: "We use essential cookies to maintain your shopping cart and preferences. Analytics cookies help us understand how visitors use our site. You can disable cookies in your browser settings." },
          { title: "5. Data Security", content: "We implement appropriate security measures to protect your personal information. Our website uses SSL/TLS encryption for all data transmission." },
          { title: "6. Third-Party Services", content: "We use trusted third-party services including Stripe (payments), Cloudinary (image hosting), and Vercel (hosting). Each maintains their own privacy practices." },
          { title: "7. Your Rights", content: "You may request access to, correction of, or deletion of your personal data by contacting us at mahi@paintbymahi.com. We will respond within 30 days." },
          { title: "8. Contact Us", content: "For privacy-related questions, contact us at mahi@paintbymahi.com or by calling +92 300 123 4567." },
        ].map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-bold text-stone-800 mb-2">{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
