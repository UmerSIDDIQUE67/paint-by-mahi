"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } =
    useCartStore();

  const total = getTotalPrice();
  const shipping = total >= 5000 ? 0 : 500;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20">
        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-stone-400" />
        </div>
        <h1 className="text-2xl font-bold text-stone-800 mb-2">Your cart is empty</h1>
        <p className="text-stone-500 mb-8 text-center">
          Discover beautiful artworks and add them to your cart
        </p>
        <Button asChild variant="gold" size="lg">
          <Link href="/gallery">
            Browse Gallery <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" /> Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white border border-stone-200 rounded-xl p-4 shadow-sm"
            >
              <div className="relative w-24 h-28 shrink-0 rounded-lg overflow-hidden bg-stone-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Link
                    href={`/artwork/${item.id}`}
                    className="font-semibold text-stone-800 hover:text-amber-800 transition-colors line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-stone-400 hover:text-red-500 transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-stone-500 mb-3">{item.category}</p>

                <div className="flex items-center justify-between">
                  {/* Quantity */}
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1.5 hover:bg-stone-50 transition-colors text-stone-600"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1.5 text-sm font-medium border-x border-stone-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1.5 hover:bg-stone-50 transition-colors text-stone-600"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-bold text-amber-800">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-700" />
              Order Summary
            </h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Subtotal ({items.length} items)</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium"}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-stone-400">
                  Add {formatPrice(5000 - total)} more for free shipping
                </p>
              )}
              <div className="border-t border-stone-200 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-amber-800">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Button asChild variant="gold" size="lg" className="w-full mb-3">
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/gallery">Continue Shopping</Link>
            </Button>

            <div className="mt-5 pt-4 border-t border-stone-100">
              <p className="text-xs text-stone-400 text-center mb-3">
                Secure checkout powered by
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {["Stripe", "EasyPaisa", "JazzCash", "Bank"].map((m) => (
                  <span
                    key={m}
                    className="px-2 py-0.5 bg-stone-100 rounded text-xs text-stone-500"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
