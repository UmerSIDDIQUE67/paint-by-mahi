import React from "react";
import type { Metadata } from "next";
import { Truck, Package, Clock, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping information for Paint by Mahi orders. Domestic and international shipping details.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-4xl font-bold text-stone-800 mb-2">Shipping Policy</h1>
      <p className="text-stone-500 mb-10">Last updated: January 2025</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { icon: Truck, title: "Free Shipping", desc: "On orders over PKR 5,000 within Pakistan" },
          { icon: Package, title: "Careful Packing", desc: "All artworks bubble-wrapped and tube-rolled or flat-packed" },
          { icon: Clock, title: "Processing Time", desc: "2-3 business days for in-stock items" },
          { icon: Globe, title: "International", desc: "We ship worldwide via courier services" },
        ].map((item) => (
          <div key={item.title} className="bg-amber-50 rounded-xl p-4 text-center">
            <item.icon className="w-6 h-6 text-amber-700 mx-auto mb-2" />
            <h3 className="font-semibold text-stone-800 text-sm mb-1">{item.title}</h3>
            <p className="text-xs text-stone-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-stone max-w-none space-y-6">
        {[
          {
            title: "Domestic Shipping (Pakistan)",
            content: `Orders within Pakistan are shipped via TCS, Leopard, or Pakistan Post depending on your location and package size. Standard delivery takes 3-7 business days. Express delivery options are available at checkout for an additional fee. Free shipping is applied automatically on all orders over PKR 5,000.`,
          },
          {
            title: "International Shipping",
            content: `We ship internationally via DHL, FedEx, and EMS. Delivery times vary by destination (typically 7-21 business days). International shipping charges are calculated at checkout based on weight and destination. Import duties and taxes are the responsibility of the buyer.`,
          },
          {
            title: "Packaging & Care",
            content: `Every artwork is carefully wrapped in acid-free tissue paper, then bubble-wrapped for protection. Smaller works are sent flat in rigid cardboard mailers. Larger canvases are either flat-packed with foam corner protectors or rolled in archival tubes. We take great care to ensure your artwork arrives in perfect condition.`,
          },
          {
            title: "Processing Time",
            content: `In-stock artworks ship within 2-3 business days. Custom commissioned artworks require additional time for creation (typically 2-6 weeks depending on complexity and size), plus shipping time. You will receive tracking information via email once your order has shipped.`,
          },
          {
            title: "Tracking",
            content: `Once your order ships, you will receive an email with a tracking number. You can use this to monitor your shipment's progress. If you have any questions about your shipment, please contact us at mahi@paintbymahi.com.`,
          },
        ].map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-bold text-stone-800 mb-2">{section.title}</h2>
            <p className="text-stone-600 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
