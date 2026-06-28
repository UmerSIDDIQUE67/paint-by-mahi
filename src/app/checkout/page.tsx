"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CreditCard, CheckCircle, Lock } from "lucide-react";
import { useCartStore, useOrdersStore } from "@/lib/store";
import { useSettingsStore } from "@/lib/siteSettings";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PAYMENT_METHODS } from "@/lib/data";
import toast from "react-hot-toast";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
};

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const addOrder = useOrdersStore((s) => s.addOrder);
  const settings = useSettingsStore((s) => s.settings);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [paymentProof, setPaymentProof] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
    notes: "",
  });

  const total = getTotalPrice();
  const shipping = total >= 5000 ? 0 : 500;
  const grandTotal = total + shipping;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.fullName || !form.email || !form.phone || !form.address || !form.city) {
      toast.error("Please fill all required fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Require transaction ID for manual payment methods
    const manualMethods = ["easypaisa", "jazzcash", "bank"];
    if (manualMethods.includes(paymentMethod) && !paymentProof.trim()) {
      toast.error("Please enter your transaction / reference number to confirm payment");
      return;
    }

    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      const newOrderId = `PBM-${Date.now().toString().slice(-8)}`;
      // Save order to shared store so admin can see it
      addOrder({
        id: newOrderId,
        customer: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        country: form.country,
        items: items.reduce((sum, i) => sum + i.quantity, 0),
        total: grandTotal,
        paymentMethod,
        paymentProof: paymentProof.trim() || undefined,
        paymentCleared: paymentMethod === "stripe" ? true : undefined,
        status: "Pending",
        date: new Date().toISOString().split("T")[0],
        notes: form.notes,
      });
      setOrderId(newOrderId);
      clearCart();
      setOrderPlaced(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    // Payment instructions to show AFTER order is placed
    const paymentInfo: Record<string, React.ReactNode> = {
      easypaisa: (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-sm text-green-800">
          <p className="font-bold text-base mb-3 flex items-center gap-2">💚 Send EasyPaisa Payment</p>
          <div className="space-y-1.5">
            <p>Account Number: <strong>{settings.easypaisaNumber}</strong></p>
            <p>Account Name: <strong>{settings.easypaisaName}</strong></p>
            <p className="text-green-700 mt-2 text-xs">After sending payment, take a screenshot and send it to us via WhatsApp at <strong>{settings.contactPhone}</strong> with your Order ID.</p>
          </div>
        </div>
      ),
      jazzcash: (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-sm text-red-800">
          <p className="font-bold text-base mb-3 flex items-center gap-2">❤️ Send JazzCash Payment</p>
          <div className="space-y-1.5">
            <p>Mobile Account: <strong>{settings.jazzcashNumber}</strong></p>
            <p>Account Name: <strong>{settings.jazzcashName}</strong></p>
            <p className="text-red-700 mt-2 text-xs">After sending payment, take a screenshot and send it to us via WhatsApp at <strong>{settings.contactPhone}</strong> with your Order ID.</p>
          </div>
        </div>
      ),
      bank: (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
          <p className="font-bold text-base mb-3 flex items-center gap-2">🏦 Bank Transfer Details</p>
          <div className="space-y-1.5">
            <p>Bank: <strong>{settings.bankName}</strong></p>
            <p>Account Number: <strong>{settings.bankAccount}</strong></p>
            <p>Account Title: <strong>{settings.bankTitle}</strong></p>
            <p>IBAN: <strong>{settings.bankIban}</strong></p>
            <p className="text-blue-700 mt-2 text-xs">After transfer, send proof to <strong>{settings.contactEmail}</strong> with your Order ID.</p>
          </div>
        </div>
      ),
      stripe: null,
      cod: (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
          <p className="font-bold text-base mb-3 flex items-center gap-2">📦 Cash on Delivery</p>
          <p>Pay <strong>PKR {formatPrice(grandTotal)}</strong> in cash when your order arrives at your door.</p>
          {settings.codFee && settings.codFee !== "0" && <p className="mt-1 text-xs">COD handling fee of <strong>PKR {settings.codFee}</strong> included.</p>}
        </div>
      ),
    };

    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 mx-auto">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Order Placed!</h1>
        <p className="text-stone-500 mb-1">Your Order ID:</p>
        <p className="text-2xl font-bold text-amber-800 mb-1 font-mono">{orderId}</p>
        <p className="text-xs text-stone-400 mb-6">Save this ID — quote it when contacting us about your order</p>

        {/* Payment instructions */}
        {paymentMethod !== "stripe" && (
          <div className="mb-6 text-left">
            <p className="text-sm font-semibold text-stone-700 mb-3">Complete your payment:</p>
            {paymentInfo[paymentMethod]}
          </div>
        )}

        {paymentMethod === "stripe" && (
          <p className="text-stone-500 text-sm mb-6">
            Payment has been processed. A confirmation will be sent to <strong>{form.email}</strong>.
          </p>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <Button asChild variant="gold" size="lg"><Link href="/gallery">Continue Shopping</Link></Button>
          <Button asChild variant="outline" size="lg"><Link href="/contact">Contact Artist</Link></Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-stone-800 mb-4">Your cart is empty</h1>
        <Button asChild variant="gold">
          <Link href="/gallery">Browse Gallery</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-amber-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-stone-800">Checkout</h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-stone-500">
          <Lock className="w-3.5 h-3.5 text-green-600" />
          Secure & encrypted checkout
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: Shipping + Payment ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping info */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-stone-800 mb-5">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
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
                    Email <span className="text-red-500">*</span>
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
                    Phone Number <span className="text-red-500">*</span>
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
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House #, Street, Area"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Lahore"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Postal Code
                  </label>
                  <Input
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="54000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Country
                  </label>
                  <Input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Pakistan"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">
                    Order Notes (optional)
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Any special instructions for your order..."
                    className="w-full px-3 py-2 text-sm rounded-md border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-700 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment methods */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-700" />
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-amber-700 bg-amber-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="text-amber-700 focus:ring-amber-700"
                    />
                    <span className="font-medium text-sm text-stone-700">
                      {method.name}
                    </span>
                  </label>
                ))}
              </div>

              {paymentMethod === "easypaisa" && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 space-y-3">
                  <p className="font-medium">EasyPaisa Account</p>
                  <p>Number: <strong>{settings.easypaisaNumber}</strong></p>
                  <p>Name: <strong>{settings.easypaisaName}</strong></p>
                  <p className="text-xs">Send the exact amount, then enter your transaction ID below.</p>
                  <div>
                    <label className="block text-xs font-semibold text-green-800 mb-1">Transaction ID / Reference Number <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={paymentProof}
                      onChange={e => setPaymentProof(e.target.value)}
                      placeholder="e.g. EP123456789"
                      className="w-full h-9 px-3 rounded-md border border-green-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-stone-800"
                    />
                  </div>
                </div>
              )}
              {paymentMethod === "jazzcash" && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 space-y-3">
                  <p className="font-medium">JazzCash Account</p>
                  <p>Number: <strong>{settings.jazzcashNumber}</strong></p>
                  <p>Name: <strong>{settings.jazzcashName}</strong></p>
                  <p className="text-xs">Send the exact amount, then enter your transaction ID below.</p>
                  <div>
                    <label className="block text-xs font-semibold text-red-800 mb-1">Transaction ID / Reference Number <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={paymentProof}
                      onChange={e => setPaymentProof(e.target.value)}
                      placeholder="e.g. JC987654321"
                      className="w-full h-9 px-3 rounded-md border border-red-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-stone-800"
                    />
                  </div>
                </div>
              )}
              {paymentMethod === "bank" && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 space-y-3">
                  <p className="font-medium">Bank Transfer Details</p>
                  <p>Bank: <strong>{settings.bankName}</strong></p>
                  <p>Account: <strong>{settings.bankAccount}</strong></p>
                  <p>Title: <strong>{settings.bankTitle}</strong></p>
                  <p>IBAN: <strong>{settings.bankIban}</strong></p>
                  <p className="text-xs">Transfer the exact amount, then enter your transaction reference below.</p>
                  <div>
                    <label className="block text-xs font-semibold text-blue-800 mb-1">Transaction Reference / TRN <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={paymentProof}
                      onChange={e => setPaymentProof(e.target.value)}
                      placeholder="e.g. TRN20240001234"
                      className="w-full h-9 px-3 rounded-md border border-blue-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-stone-800"
                    />
                  </div>
                </div>
              )}
              {paymentMethod === "cod" && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                  <p className="font-medium mb-1">Cash on Delivery</p>
                  <p>Pay in cash when your order arrives. Pakistan only.</p>
                  {settings.codFee && settings.codFee !== "0" && (
                    <p className="mt-1">COD handling fee: <strong>PKR {settings.codFee}</strong></p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-stone-800 mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-stone-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-800 line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-amber-800 shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-stone-200 pt-4 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-stone-100">
                  <span>Total</span>
                  <span className="text-amber-800">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Place Order – {formatPrice(grandTotal)}
                  </>
                )}
              </Button>

              <p className="text-xs text-stone-400 text-center mt-3">
                By placing this order, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-amber-700">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-amber-700">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
