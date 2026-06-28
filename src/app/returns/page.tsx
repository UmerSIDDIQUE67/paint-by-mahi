import React from "react";
import type { Metadata } from "next";
import { AlertCircle, CheckCircle, Phone } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Refunds Policy",
  description: "Return and refund policy for Paint by Mahi artwork purchases.",
};

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <h1 className="text-4xl font-bold text-stone-800 mb-2">Returns & Refunds</h1>
      <p className="text-stone-500 mb-10">Last updated: January 2025</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: CheckCircle, color: "text-green-600 bg-green-50", title: "7-Day Returns", desc: "For damaged items only" },
          { icon: AlertCircle, color: "text-amber-600 bg-amber-50", title: "Custom Art", desc: "Non-refundable once started" },
          { icon: Phone, color: "text-blue-600 bg-blue-50", title: "Contact First", desc: "Always reach out before returning" },
        ].map((item) => (
          <div key={item.title} className={`rounded-xl p-5 text-center ${item.color.split(" ")[1]}`}>
            <item.icon className={`w-7 h-7 mx-auto mb-2 ${item.color.split(" ")[0]}`} />
            <h3 className="font-bold text-stone-800">{item.title}</h3>
            <p className="text-sm text-stone-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8 text-stone-600 leading-relaxed">
        {[
          { title: "Return Eligibility", content: "We accept returns only for items that arrived damaged or defective. Returns must be initiated within 7 days of delivery. The artwork must be in its original packaging and undamaged (except for the shipping damage). To initiate a return, contact us at mahi@paintbymahi.com with photos of the damage." },
          { title: "Non-Returnable Items", content: "Custom commissioned artworks are non-refundable once work has begun. Sale items and digital downloads are also non-refundable. If an order is cancelled before work begins, the 50% deposit may be refunded at our discretion." },
          { title: "Refund Process", content: "Once your return is approved, we will process a refund to your original payment method within 7-10 business days. Shipping costs are non-refundable unless the error was ours." },
          { title: "Damaged in Shipping", content: "If your artwork arrives damaged, please photograph the damage immediately (including packaging) and contact us within 48 hours. We will arrange a replacement or full refund." },
          { title: "Exchange Policy", content: "We do not offer direct exchanges. If you wish to exchange an artwork, please return the eligible item for a refund and place a new order." },
          { title: "How to Return", content: "1. Email mahi@paintbymahi.com with your order number and photos of damage\n2. Wait for return authorization\n3. Pack the artwork carefully in original packaging\n4. Ship to the address provided\n5. Refund processed after we receive and inspect the item" },
        ].map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-bold text-stone-800 mb-2">{section.title}</h2>
            <p className="whitespace-pre-line">{section.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-amber-50 rounded-xl">
        <h3 className="font-bold text-stone-800 mb-2">Questions About Your Order?</h3>
        <p className="text-stone-600 text-sm mb-3">
          We&apos;re here to help. Reach out before initiating a return.
        </p>
        <div className="flex gap-4">
          <Link href="/contact" className="text-amber-800 font-medium text-sm hover:underline">
            Contact Us →
          </Link>
          <a href="mailto:mahi@paintbymahi.com" className="text-amber-800 font-medium text-sm hover:underline">
            mahi@paintbymahi.com
          </a>
        </div>
      </div>
    </div>
  );
}
