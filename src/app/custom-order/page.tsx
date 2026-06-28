"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle, Upload, Palette, Clock, Star, ArrowRight, FileText, Handshake, Brush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

type Step = 1 | 2 | 3;

export default function CustomOrderPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    artworkType: "",
    canvasSize: "",
    colorPreference: "",
    deadline: "",
    budget: "",
    description: "",
    referenceUrl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    if (step === 1 && (!form.fullName || !form.email || !form.phone)) {
      toast.error("Please fill all required fields");
      return;
    }
    if (step === 2 && (!form.artworkType || !form.description)) {
      toast.error("Please describe your artwork");
      return;
    }
    setStep((prev) => (prev < 3 ? ((prev + 1) as Step) : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Request Submitted!</h1>
        <p className="text-stone-500 mb-2 max-w-md">
          Thank you, {form.fullName}! Your custom artwork request has been received.
          Mahi will review your details and get back to you within 24-48 hours.
        </p>
        <p className="text-stone-500 mb-8">
          Confirmation sent to: <strong>{form.email}</strong>
        </p>
        <Button
          onClick={() => {
            setSubmitted(false);
            setStep(1);
            setForm({
              fullName: "", email: "", phone: "", artworkType: "",
              canvasSize: "", colorPreference: "", deadline: "",
              budget: "", description: "", referenceUrl: "",
            });
          }}
          variant="gold"
          size="lg"
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning>{/* Hero */}
      <div className="relative bg-stone-900 py-16 overflow-hidden" suppressHydrationWarning>
        <div suppressHydrationWarning className="absolute inset-0">
          <Image
            src="/background-section-main.webp"
            alt="Custom art background"
            fill
            className="object-cover opacity-30"
          />
          <div suppressHydrationWarning className="absolute inset-0 bg-stone-900/70" />
        </div>
        <div suppressHydrationWarning className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-widest">
            Bespoke Commissions
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-2 mb-4">
            Custom Artwork
          </h1>
          <p className="text-stone-400 max-w-xl mx-auto text-lg">
            Describe your dream piece and Mahi will bring it to life — 
            portraits, calligraphy, landscapes, or anything you envision.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-amber-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { Icon: FileText,  title: "1. Describe Your Vision", desc: "Fill out the form with your artwork details, size preferences, and reference images." },
              { Icon: Handshake, title: "2. Get a Quote",           desc: "Mahi reviews your request and sends a custom quote within 24-48 hours." },
              { Icon: Brush,     title: "3. Art is Created",        desc: "After approval, your piece is crafted with care and delivered to your door." },
            ].map((step) => (
              <div key={step.title} className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <step.Icon className="w-6 h-6 text-amber-700" />
                </div>
                <h3 className="font-bold text-stone-800 mb-1.5">{step.title}</h3>
                <p className="text-stone-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          {([1, 2, 3] as Step[]).map((s) => (
            <React.Fragment key={s}>
              <div
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  step >= s ? "text-amber-800" : "text-stone-400"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step > s
                      ? "bg-green-500 text-white"
                      : step === s
                      ? "bg-amber-800 text-white"
                      : "bg-stone-200 text-stone-500"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                <span className="hidden sm:inline">
                  {s === 1 ? "Your Info" : s === 2 ? "Artwork Details" : "Review"}
                </span>
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-0.5 transition-colors ${
                    step > s ? "bg-amber-700" : "bg-stone-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-stone-800 mb-1">Your Information</h2>
              <p className="text-stone-500 text-sm mb-5">
                We need your contact details to follow up about your commission.
              </p>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Phone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+92 300 000 0000"
                  required
                />
              </div>
              <Button
                type="button"
                onClick={handleNext}
                variant="gold"
                size="lg"
                className="w-full"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-stone-800 mb-1">Artwork Details</h2>
              <p className="text-stone-500 text-sm mb-5">
                The more details you provide, the better Mahi can bring your vision to life.
              </p>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Artwork Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="artworkType"
                  value={form.artworkType}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 bg-white"
                >
                  <option value="">Select type...</option>
                  <option>Portrait (Person/Family)</option>
                  <option>Islamic Calligraphy</option>
                  <option>Landscape / Scenery</option>
                  <option>Abstract</option>
                  <option>Floral / Nature</option>
                  <option>Animal / Wildlife</option>
                  <option>Architecture</option>
                  <option>Custom / Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Canvas Size
                  </label>
                  <select
                    name="canvasSize"
                    value={form.canvasSize}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 bg-white"
                  >
                    <option value="">Select size...</option>
                    <option>Small (12&quot;×16&quot;)</option>
                    <option>Medium (18&quot;×24&quot;)</option>
                    <option>Large (24&quot;×36&quot;)</option>
                    <option>Extra Large (30&quot;×40&quot;)</option>
                    <option>Custom Size</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Budget (PKR)
                  </label>
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 bg-white"
                  >
                    <option value="">Select range...</option>
                    <option>5,000 – 10,000</option>
                    <option>10,000 – 20,000</option>
                    <option>20,000 – 40,000</option>
                    <option>40,000+</option>
                    <option>Flexible</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Color Preference
                  </label>
                  <Input
                    name="colorPreference"
                    value={form.colorPreference}
                    onChange={handleChange}
                    placeholder="e.g. warm tones, navy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Deadline (if any)
                  </label>
                  <Input
                    name="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Description & Vision <span className="text-red-500">*</span>
                </label>
                <Textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe exactly what you want... subjects, style, mood, any text (for calligraphy), special instructions, occasion etc."
                  rows={5}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Reference Image URL (optional)
                </label>
                <Input
                  name="referenceUrl"
                  value={form.referenceUrl}
                  onChange={handleChange}
                  placeholder="https://... (link to a reference image)"
                />
                <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  You can also share images via WhatsApp after submitting
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  variant="gold"
                  size="lg"
                  className="flex-1"
                >
                  Review Order <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-stone-800 mb-1">Review Your Request</h2>
              <p className="text-stone-500 text-sm mb-6">
                Please review your details before submitting.
              </p>

              <div className="bg-stone-50 rounded-xl p-5 space-y-3 mb-6 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-stone-500">Name</span>
                    <p className="font-medium text-stone-800">{form.fullName}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Email</span>
                    <p className="font-medium text-stone-800">{form.email}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Phone</span>
                    <p className="font-medium text-stone-800">{form.phone}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Artwork Type</span>
                    <p className="font-medium text-stone-800">{form.artworkType}</p>
                  </div>
                  {form.canvasSize && (
                    <div>
                      <span className="text-stone-500">Canvas Size</span>
                      <p className="font-medium text-stone-800">{form.canvasSize}</p>
                    </div>
                  )}
                  {form.budget && (
                    <div>
                      <span className="text-stone-500">Budget</span>
                      <p className="font-medium text-stone-800">{form.budget} PKR</p>
                    </div>
                  )}
                  {form.deadline && (
                    <div>
                      <span className="text-stone-500">Deadline</span>
                      <p className="font-medium text-stone-800">{form.deadline}</p>
                    </div>
                  )}
                </div>
                <div className="pt-2 border-t border-stone-200">
                  <span className="text-stone-500">Description</span>
                  <p className="font-medium text-stone-800 mt-0.5">{form.description}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[
            { icon: Clock, title: "24-48h Response", desc: "Mahi replies to all inquiries quickly" },
            { icon: Palette, title: "All Mediums", desc: "Oil, watercolor, acrylic, charcoal, ink" },
            { icon: Star, title: "100% Satisfaction", desc: "Revisions included until you love it" },
          ].map((item) => (
            <div key={item.title} className="bg-amber-50 rounded-xl p-4 text-center">
              <item.icon className="w-6 h-6 text-amber-700 mx-auto mb-2" />
              <h4 className="font-semibold text-stone-800 text-sm">{item.title}</h4>
              <p className="text-xs text-stone-500 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
