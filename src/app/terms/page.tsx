import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Paint by Mahi website and purchasing artworks.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-4xl font-bold text-stone-800 mb-2">Terms of Service</h1>
      <p className="text-stone-500 mb-10">Last updated: January 2025</p>
      <div className="space-y-8 text-stone-600 leading-relaxed">
        {[
          { title: "1. Acceptance of Terms", content: "By accessing and using paintbymahi.com, you accept and agree to these terms. If you do not agree, please do not use our services." },
          { title: "2. Products and Authenticity", content: "All artworks are original handmade pieces. Each sold work comes with a certificate of authenticity signed by the artist. We do not sell reproductions or prints unless explicitly stated." },
          { title: "3. Ordering and Payment", content: "Orders are binding once payment is confirmed. Prices are listed in PKR. International orders may incur currency conversion fees. Payment must be completed before artwork is shipped." },
          { title: "4. Custom Commissions", content: "Custom artwork commissions require a 50% non-refundable deposit before work begins. The balance is due upon completion and before shipping. Revisions are included as agreed upon during consultation." },
          { title: "5. Returns and Refunds", content: "We accept returns within 7 days of delivery for damaged items only. The artwork must be in original packaging and undamaged. Custom commissioned works are non-refundable once creation has begun." },
          { title: "6. Intellectual Property", content: "All artwork, photographs, and content on this website are the intellectual property of Paint by Mahi. Reproduction or commercial use without written permission is prohibited." },
          { title: "7. Limitation of Liability", content: "Paint by Mahi is not liable for delays or damage caused by courier services. We are not responsible for customs delays for international orders." },
          { title: "8. Governing Law", content: "These terms are governed by the laws of Pakistan. Any disputes shall be resolved under Pakistani jurisdiction." },
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
