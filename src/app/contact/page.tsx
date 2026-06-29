"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, Share2, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSettingsStore } from "@/lib/siteSettings";
import toast from "react-hot-toast";

export default function ContactPage() {
  const { contactPhone, contactEmail, contactAddress, instagramUrl, facebookUrl } =
    useSettingsStore((s) => s.settings);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1200));
    setSent(true);
    setLoading(false);
  };

  const resetForm = () => {
    setSent(false);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div suppressHydrationWarning>{/* Hero */}
      <div className="relative bg-stone-900 py-14 overflow-hidden" suppressHydrationWarning>
        <div suppressHydrationWarning className="absolute inset-0">
          <Image
            src="/background-section-main.webp"
            alt="Art background"
            fill
            className="object-cover opacity-45"
          />
          <div suppressHydrationWarning className="absolute inset-0 bg-stone-900/20" />
        </div>
        <div suppressHydrationWarning className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-widest">
            Reach Out
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-2 mb-3">
            Get in Touch
          </h1>
          <p className="text-stone-400 max-w-md mx-auto">
            Questions about artwork, custom orders, shipping, or anything else?
            Mahi is happy to help.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: contact info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="aspect-4/3 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80"
                alt="Artist studio"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-5">
              {[
                { icon: Phone,  label: "Phone / WhatsApp", value: contactPhone,   href: `tel:${contactPhone}` },
                { icon: Mail,   label: "Email",             value: contactEmail,   href: `mailto:${contactEmail}` },
                { icon: MapPin, label: "Location",          value: contactAddress, href: null },
                { icon: Clock,  label: "Response Time",     value: "Usually within 24-48 hours", href: null },
              ].map((item) => (
                <div key={item.label} className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 font-medium uppercase tracking-wide">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a href={item.href} className="text-stone-800 font-medium hover:text-amber-700 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-stone-800 font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium text-stone-700 mb-3 uppercase tracking-wide">
                Follow on Social Media
              </p>
              <div className="flex gap-3 flex-wrap">
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-amber-100 rounded-lg text-sm text-stone-700 transition-colors">
                  <Share2 className="w-4 h-4" /> Instagram
                </a>
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-amber-100 rounded-lg text-sm text-stone-700 transition-colors">
                  <Users className="w-4 h-4" /> Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 bg-white border border-stone-200 rounded-2xl">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-stone-800 mb-2">Message Sent!</h2>
                <p className="text-stone-500 mb-6 max-w-sm">
                  Thank you, {form.name}. Mahi will reply to{" "}
                  <strong>{form.email}</strong> within 24-48 hours.
                </p>
                <Button onClick={resetForm} variant="outline">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-stone-800 mb-2">Send a Message</h2>
                <p className="text-stone-500 text-sm mb-6">
                  Whether it&apos;s a question about an artwork, a custom commission
                  inquiry, or just to say hello — fill out the form below.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <Input name="name" value={form.name} onChange={handleChange}
                        placeholder="Full name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input name="email" type="email" value={form.email}
                        onChange={handleChange} placeholder="email@example.com" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">
                        Phone (optional)
                      </label>
                      <Input name="phone" type="tel" value={form.phone}
                        onChange={handleChange} placeholder="+92 300 000 0000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1.5">
                        Subject
                      </label>
                      <Input name="subject" value={form.subject}
                        onChange={handleChange} placeholder="e.g. Custom order inquiry" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea name="message" value={form.message} onChange={handleChange}
                      placeholder="Write your message here..." rows={6} required />
                  </div>
                  <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </span>
                    ) : "Send Message"}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
