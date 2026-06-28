"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart2,
  Plus, Eye, Edit, Trash2, CheckCircle, Clock,
  ArrowUpRight, X, Save, ImagePlus, AlertCircle, LogOut,
  Lock, Settings, Phone, Mail, MapPin, CreditCard,
  FileText, TrendingUp, ShoppingCart, ExternalLink,
  Hash, Calendar, Truck, MessageSquare,
} from "lucide-react";
import { ARTWORKS as INITIAL_ARTWORKS, ORDER_STATUSES, type Artwork } from "@/lib/data";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSettingsStore, DEFAULT_SETTINGS, type SiteSettings } from "@/lib/siteSettings";
import { useOrdersStore, type Order } from "@/lib/store";
import { sendEmail } from "@/lib/email";

const ADMIN_EMAIL    = "paintbymahi@gmail.com";
const ADMIN_PASSWORD = "paintbymahi2024";
const ADMIN_SESSION_KEY = "pbm_admin_auth";

type AdminTab = "dashboard" | "artworks" | "orders" | "customers" | "settings";

const STATUS_COLORS: Record<string, "warning"|"info"|"secondary"|"success"|"default"> = {
  Pending: "warning", Confirmed: "info", "In Progress": "secondary",
  Completed: "success", Shipped: "default", Delivered: "success",
};

const EMPTY: Omit<Artwork,"id"|"createdAt"> = {
  title:"", category:"Oil Painting", description:"",
  price:0, dimensions:"", medium:"", stock:1,
  images:[""], featured:false, tags:[],
};
const CATS = ["Oil Painting","Watercolor","Calligraphy","Portrait","Sketch","Acrylic","Abstract"];

/* ─── Site pages linked from admin ─────────────────────────────────────────── */
const SITE_LINKS = [
  { href:"/",             label:"Home" },
  { href:"/gallery",      label:"Gallery" },
  { href:"/categories",   label:"Categories" },
  { href:"/custom-order", label:"Custom Orders" },
  { href:"/about",        label:"About" },
  { href:"/contact",      label:"Contact" },
];

/* ─── Login ──────────────────────────────────────────────────────────────── */
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail]   = useState("");
  const [pass,  setPass]    = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow]     = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 500));
    if (email.trim().toLowerCase() === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "1"); onLogin();
    } else { setError("Invalid email or password."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 shadow-lg border-2 border-amber-700">
            <Image src="/logo.jpeg" alt="Paint by Mahi" width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-white">Paint by Mahi</h1>
          <p className="text-stone-400 text-sm mt-1">Admin Dashboard</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-amber-700" />
            <h2 className="text-lg font-bold text-stone-800">Admin Login</h2>
          </div>
          {error && <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="paintbymahi@gmail.com" required autoFocus />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Password</label>
              <div className="relative">
                <Input type={show?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" required />
                <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600">{show?"Hide":"Show"}</button>
              </div>
            </div>
            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>{loading?"Verifying...":"Login to Dashboard"}</Button>
          </form>
          <div className="mt-6 pt-4 border-t border-stone-100 text-center">
            <Link href="/" className="text-xs text-stone-400 hover:text-amber-700">← Back to main site</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Order Detail Modal ─────────────────────────────────────────────────── */
function OrderDetailModal({ order, onClose, onStatusChange, onPaymentClearedChange }: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onPaymentClearedChange: (id: string, cleared: boolean) => void;
}) {
  const manualMethod = ["easypaisa","jazzcash","bank"].includes(order.paymentMethod);
  const isCleared    = order.paymentCleared === true;
  const isRejected   = order.paymentCleared === false;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Hash className="w-4 h-4 text-amber-700" />
              <span className="font-mono font-bold text-stone-800">{order.id}</span>
              <Badge variant={STATUS_COLORS[order.status]||"default"}>{order.status}</Badge>
            </div>
            <p className="text-xs text-stone-400">
              Order ID is the tracking reference — customers use this to enquire about their order
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-stone-100"><X className="w-5 h-5 text-stone-500" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-stone-50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-stone-700 text-sm uppercase tracking-wide">Customer</h3>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium text-stone-800">{order.customer}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <a href={`mailto:${order.email}`} className="text-amber-700 hover:underline truncate">{order.email}</a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <a href={`tel:${order.phone}`} className="text-stone-700">{order.phone}</a>
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-stone-700 text-sm uppercase tracking-wide">Delivery Address</h3>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-stone-700">{order.address}, {order.city}, {order.country}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-stone-700 capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-stone-700">{formatDate(order.date)}</span>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="font-semibold text-stone-700 text-sm uppercase tracking-wide mb-3">Order Summary</h3>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-stone-600 flex items-center gap-1.5"><ShoppingCart className="w-4 h-4" /> Items ordered</span>
              <span className="font-medium">{order.items} item{order.items !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-amber-200">
              <span className="text-stone-800">Total Paid</span>
              <span className="text-amber-800">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Payment proof / cleared status */}
          {manualMethod && (
            <div className={`rounded-xl p-4 border ${isCleared ? "bg-green-50 border-green-200" : isRejected ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}>
              <h3 className="font-semibold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                <CreditCard className={`w-4 h-4 ${isCleared ? "text-green-600" : isRejected ? "text-red-600" : "text-yellow-600"}`} />
                <span className={isCleared ? "text-green-700" : isRejected ? "text-red-700" : "text-yellow-700"}>
                  Payment Status —{" "}
                  {isCleared ? "✅ Cleared" : isRejected ? "❌ Not Cleared" : "⏳ Awaiting Verification"}
                </span>
              </h3>
              {order.paymentProof ? (
                <div className="mb-3">
                  <p className="text-xs text-stone-500 mb-1">Transaction ID / Reference provided by buyer:</p>
                  <p className="font-mono font-bold text-stone-800 bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm select-all">
                    {order.paymentProof}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-stone-500 mb-3">No transaction ID submitted by buyer.</p>
              )}
              <p className="text-xs text-stone-500 mb-3">Verify the payment in your {order.paymentMethod} account, then mark below:</p>
              <div className="flex gap-3">
                <button
                  onClick={() => onPaymentClearedChange(order.id, true)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${isCleared ? "bg-green-600 text-white border-green-600" : "bg-white text-green-700 border-green-300 hover:bg-green-50"}`}
                >
                  ✅ Mark as Cleared
                </button>
                <button
                  onClick={() => onPaymentClearedChange(order.id, false)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${isRejected ? "bg-red-600 text-white border-red-600" : "bg-white text-red-700 border-red-300 hover:bg-red-50"}`}
                >
                  ❌ Not Cleared
                </button>
              </div>
            </div>
          )}

          {/* COD / Stripe payment note */}
          {!manualMethod && (
            <div className={`rounded-xl p-4 border ${order.paymentMethod === "cod" ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
              <p className="text-sm font-semibold flex items-center gap-2">
                {order.paymentMethod === "cod" ? "📦 Cash on Delivery — collect payment on arrival" : "✅ Stripe — payment processed automatically"}
              </p>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-700 text-sm uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Customer Notes
              </h3>
              <p className="text-sm text-blue-800">{order.notes}</p>
            </div>
          )}

          {/* Status update */}
          <div className="border border-stone-200 rounded-xl p-4">
            <h3 className="font-semibold text-stone-700 text-sm uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-700" /> Update Order Status
            </h3>
            <p className="text-xs text-stone-500 mb-3">
              Changing the status will send an automatic email notification to the admin inbox.
            </p>
            <div className="flex flex-wrap gap-2">
              {ORDER_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => onStatusChange(order.id, s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    order.status === s
                      ? "bg-amber-700 text-white border-amber-700"
                      : "bg-white text-stone-600 border-stone-300 hover:border-amber-400 hover:text-amber-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-stone-200">
          <a href={`mailto:${order.email}?subject=Your Order ${order.id} - Paint by Mahi`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-700 hover:bg-stone-50 transition-colors">
            <Mail className="w-4 h-4" /> Email Customer
          </a>
          <Button variant="gold" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Artwork Form Modal ─────────────────────────────────────────────────── */
function ArtworkForm({ initial, onSave, onClose }: {
  initial: Partial<Artwork>|null; onSave: (a: Artwork)=>void; onClose: ()=>void;
}) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({ ...EMPTY, ...(initial??{}), images: initial?.images?.length ? initial.images : [""], tags: initial?.tags??[] });
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  const set = (k: keyof typeof form, v: unknown) => setForm(p=>({...p,[k]:v}));
  const updateImg = (i: number, v: string) => { const a=[...form.images]; a[i]=v; set("images",a); };
  const addTag = () => { const t=tagInput.trim().toLowerCase(); if(t&&!form.tags.includes(t)) set("tags",[...form.tags,t]); setTagInput(""); };

  const save = () => {
    if (!form.title.trim()) return setError("Title is required");
    if (!form.price||Number(form.price)<=0) return setError("Valid price is required");
    if (!form.images[0]?.trim()) return setError("At least one image URL is required");
    setError("");
    onSave({...form, id:initial?.id??String(Date.now()), createdAt:initial?.createdAt??new Date().toISOString().split("T")[0], images:form.images.filter(Boolean), price:Number(form.price), stock:Number(form.stock)});
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <h2 className="text-xl font-bold text-stone-800">{isEdit?"Edit Artwork":"Add New Artwork"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-stone-100"><X className="w-5 h-5 text-stone-500" /></button>
        </div>
        <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {error && <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Title *</label>
            <Input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Artwork title" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Category</label>
              <select value={form.category} onChange={e=>set("category",e.target.value)} className="w-full h-10 px-3 rounded-md border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-700">
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Medium</label>
              <Input value={form.medium} onChange={e=>set("medium",e.target.value)} placeholder="Oil on Canvas" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Price (PKR) *</label>
              <Input type="number" min={0} value={form.price||""} onChange={e=>set("price",e.target.value)} placeholder="15000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Stock</label>
              <Input type="number" min={0} value={form.stock} onChange={e=>set("stock",e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Dimensions</label>
              <Input value={form.dimensions} onChange={e=>set("dimensions",e.target.value)} placeholder='24" × 36"' />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
            <Textarea value={form.description} onChange={e=>set("description",e.target.value)} rows={3} placeholder="Describe the artwork..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Image URLs *</label>
            <div className="space-y-2">
              {form.images.map((img,i)=>(
                <div key={i} className="flex gap-2 items-center">
                  <Input value={img} onChange={e=>updateImg(i,e.target.value)} placeholder="https://..." className="flex-1" />
                  {img && <div className="w-10 h-10 rounded border border-stone-200 overflow-hidden shrink-0"><Image src={img} alt="" width={40} height={40} className="w-full h-full object-cover" onError={e=>{(e.target as HTMLImageElement).style.display="none";}} /></div>}
                  {form.images.length>1 && <button onClick={()=>set("images",form.images.filter((_,j)=>j!==i))} className="p-1.5 text-red-400 hover:text-red-600 shrink-0"><X className="w-4 h-4" /></button>}
                </div>
              ))}
              <button onClick={()=>set("images",[...form.images,""])} className="flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900"><ImagePlus className="w-4 h-4" />Add image</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),addTag())} placeholder="Add tag, press Enter" className="flex-1" />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map(tag=>(
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-800">
                  #{tag}<button onClick={()=>set("tags",form.tags.filter(t=>t!==tag))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div onClick={()=>set("featured",!form.featured)} className={`w-10 h-6 rounded-full transition-colors relative ${form.featured?"bg-amber-700":"bg-stone-300"}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.featured?"left-5":"left-1"}`} />
            </div>
            <span className="text-sm font-medium text-stone-700">Mark as Featured</span>
          </label>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-stone-200">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="gold" onClick={save} className="gap-2"><Save className="w-4 h-4" />{isEdit?"Save Changes":"Add Artwork"}</Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Admin Page ────────────────────────────────────────────────────── */
export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed]         = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [tab, setTab]               = useState<AdminTab>("dashboard");
  const [artworks, setArtworks]     = useState(INITIAL_ARTWORKS);
  const [formTarget, setFormTarget] = useState<Partial<Artwork>|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Artwork|null>(null);
  const [artSearch, setArtSearch]   = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order|null>(null);

  const { settings, update: updateSettings, hydrate: hydrateSettings } = useSettingsStore();
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const { orders, updateStatus, updatePaymentCleared, hydrate: hydrateOrders } = useOrdersStore();

  useEffect(() => {
    const ok = sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
    setAuthed(ok);
    hydrateSettings();
    hydrateOrders();
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { setSettingsForm(settings); }, [settings]);

  const saveSettings = () => {
    updateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(()=>setSettingsSaved(false), 2500);
  };
  const setF = (key: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setSettingsForm(p=>({...p,[key]:e.target.value}));

  const handleStatusChange = async (id: string, newStatus: string) => {
    updateStatus(id, newStatus);
    if (selectedOrder?.id === id) setSelectedOrder(o => o ? {...o, status: newStatus} : o);
    const emailMap: Record<string,string> = {
      "Confirmed":"order_confirmed", "In Progress":"order_in_progress",
      "Completed":"order_completed", "Shipped":"order_shipped", "Delivered":"order_delivered",
    };
    const emailType = emailMap[newStatus];
    const o = orders.find(x => x.id === id);
    if (emailType && o) {
      await sendEmail({ type: emailType as never, to: o.email, name: o.customer,
        orderId: o.id, items: o.items, total: formatPrice(o.total) });
    }
  };

  const logout = () => { sessionStorage.removeItem(ADMIN_SESSION_KEY); router.push("/"); };

  // Revenue = only Delivered orders (payment confirmed)
  const deliveredRevenue = orders.filter(o=>o.status==="Delivered").reduce((s,o)=>s+o.total,0);
  const totalRevenue     = orders.reduce((s,o)=>s+o.total,0);
  const pending  = orders.filter(o=>o.status==="Pending"||o.status==="Confirmed").length;
  const filtered = artworks.filter(a=>
    a.title.toLowerCase().includes(artSearch.toLowerCase()) ||
    a.category.toLowerCase().includes(artSearch.toLowerCase())
  );

  if (!mounted) return null;
  if (!authed)  return <AdminLogin onLogin={()=>setAuthed(true)} />;

  const NAV = [
    { id:"dashboard", label:"Dashboard", icon:LayoutDashboard },
    { id:"artworks",  label:"Artworks",  icon:Package },
    { id:"orders",    label:"Orders",    icon:ShoppingBag },
    { id:"customers", label:"Customers", icon:Users },
    { id:"settings",  label:"Settings",  icon:Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Order detail modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={()=>setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          onPaymentClearedChange={(id, cleared) => {
            updatePaymentCleared(id, cleared);
            setSelectedOrder(o => o ? {...o, paymentCleared: cleared} : o);
          }}
        />
      )}

      {/* Artwork form modal */}
      {formTarget !== null && (
        <ArtworkForm initial={formTarget} onClose={()=>setFormTarget(null)}
          onSave={a=>{ setArtworks(p=>formTarget?.id?p.map(x=>x.id===a.id?a:x):[a,...p]); setFormTarget(null); }} />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3"><Trash2 className="w-6 h-6 text-red-600" /></div>
            <h3 className="text-lg font-bold text-stone-800 mb-2">Delete Artwork?</h3>
            <p className="text-stone-500 text-sm mb-5">&ldquo;{deleteTarget.title}&rdquo; will be permanently removed.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={()=>setDeleteTarget(null)}>Cancel</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={()=>{setArtworks(p=>p.filter(a=>a.id!==deleteTarget.id));setDeleteTarget(null);}}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className="w-56 bg-stone-900 text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-700 shrink-0">
              <Image src="/logo.jpeg" alt="Logo" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <div><p className="font-bold text-white text-sm leading-tight">Paint by Mahi</p><p className="text-xs text-amber-400">Admin Panel</p></div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] text-stone-500 uppercase tracking-widest px-3 pt-1 pb-2">Admin</p>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id as AdminTab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab===n.id?"bg-amber-700 text-white":"text-stone-400 hover:bg-stone-800 hover:text-white"}`}>
              <n.icon className="w-4 h-4" />{n.label}
              {n.id==="orders" && pending>0 && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{pending}</span>}
            </button>
          ))}
          <p className="text-[10px] text-stone-500 uppercase tracking-widest px-3 pt-4 pb-2">Website</p>
          {SITE_LINKS.map(l=>(
            <Link key={l.href} href={l.href} target="_blank"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-400 hover:bg-stone-800 hover:text-white transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />{l.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-stone-800 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"><Eye className="w-4 h-4" />View Site</Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors"><LogOut className="w-4 h-4" />Logout</button>
        </div>
      </aside>


      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto p-6">

        {/* DASHBOARD */}
        {tab==="dashboard" && (
          <div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">Dashboard</h1>
            <p className="text-stone-500 text-sm mb-6">Overview of your store activity</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label:"Confirmed Revenue", value:formatPrice(deliveredRevenue), sub:"From delivered orders", icon:TrendingUp, color:"text-green-600", bg:"bg-green-50" },
                { label:"Total Orders", value:String(orders.length), sub:`${pending} pending`, icon:ShoppingBag, color:"text-blue-600", bg:"bg-blue-50" },
                { label:"Artworks Listed", value:String(artworks.length), sub:"In gallery", icon:Package, color:"text-amber-600", bg:"bg-amber-50" },
                { label:"Pending / New", value:String(pending), sub:"Need attention", icon:Clock, color:"text-red-600", bg:"bg-red-50" },
              ].map(s=>(
                <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-stone-500 text-xs font-medium uppercase tracking-wide">{s.label}</p>
                      <p className="text-2xl font-bold text-stone-800 mt-1">{s.value}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{s.sub}</p>
                    </div>
                    <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-2"><ArrowUpRight className="w-3 h-3" />Live data</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 mb-6">
              <h2 className="font-bold text-stone-800 mb-3 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-amber-700" />Revenue Breakdown</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 rounded-xl p-4"><p className="text-xs text-stone-500 mb-1">Delivered</p><p className="text-xl font-bold text-green-700">{formatPrice(deliveredRevenue)}</p></div>
                <div className="bg-blue-50 rounded-xl p-4"><p className="text-xs text-stone-500 mb-1">In Progress / Shipped</p><p className="text-xl font-bold text-blue-700">{formatPrice(orders.filter(o=>["In Progress","Completed","Shipped"].includes(o.status)).reduce((s,o)=>s+o.total,0))}</p></div>
                <div className="bg-amber-50 rounded-xl p-4"><p className="text-xs text-stone-500 mb-1">All Orders</p><p className="text-xl font-bold text-amber-700">{formatPrice(totalRevenue)}</p></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-stone-800">Recent Orders</h2>
                  <button onClick={()=>setTab("orders")} className="text-sm text-amber-700 hover:underline">View all</button>
                </div>
                {orders.length===0 ? <p className="text-stone-400 text-sm text-center py-8">No orders yet</p> : (
                  <div className="space-y-3">
                    {orders.slice(0,5).map(o=>(
                      <button key={o.id} onClick={()=>setSelectedOrder(o)} className="w-full flex items-center justify-between py-2 border-b border-stone-50 last:border-0 hover:bg-amber-50 rounded px-2 -mx-2 transition-colors text-left">
                        <div><p className="font-medium text-stone-800 text-sm">{o.customer}</p><p className="text-xs text-stone-400 font-mono">{o.id}</p></div>
                        <div className="text-right"><p className="font-bold text-amber-800 text-sm">{formatPrice(o.total)}</p><Badge variant={STATUS_COLORS[o.status]||"default"} className="text-[10px]">{o.status}</Badge></div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-stone-800">Featured Artworks</h2>
                  <button onClick={()=>setTab("artworks")} className="text-sm text-amber-700 hover:underline">Manage all</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {artworks.filter(a=>a.featured).slice(0,4).map(a=>(
                    <div key={a.id} className="relative rounded-lg overflow-hidden aspect-square bg-stone-100">
                      <Image src={a.images[0]} alt={a.title} fill className="object-cover" sizes="120px" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5">
                        <p className="text-white text-xs font-medium truncate">{a.title}</p>
                        <p className="text-amber-300 text-xs">{formatPrice(a.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ARTWORKS */}
        {tab==="artworks" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-stone-800">Artworks <span className="text-stone-400 text-lg font-normal">({filtered.length})</span></h1>
              <Button variant="gold" className="gap-2" onClick={()=>setFormTarget({})}><Plus className="w-4 h-4" />Add Artwork</Button>
            </div>
            <div className="mb-4"><input value={artSearch} onChange={e=>setArtSearch(e.target.value)} placeholder="Search by title or category..." className="w-full max-w-sm h-10 px-4 rounded-md border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 bg-white" /></div>
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr className="text-stone-500 text-xs uppercase tracking-wide">
                      <th className="text-left p-4">Artwork</th><th className="text-left p-4">Category</th><th className="text-left p-4">Price</th><th className="text-left p-4">Stock</th><th className="text-left p-4">Featured</th><th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filtered.map(a=>(
                      <tr key={a.id} className="hover:bg-stone-50">
                        <td className="p-4"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0"><Image src={a.images[0]} alt={a.title} width={48} height={48} className="w-full h-full object-cover" /></div><div><p className="font-medium text-stone-800 text-sm">{a.title}</p><p className="text-xs text-stone-400">{a.dimensions}</p></div></div></td>
                        <td className="p-4 text-stone-600 text-sm">{a.category}</td>
                        <td className="p-4 font-bold text-amber-800">{formatPrice(a.price)}</td>
                        <td className="p-4">{a.stock===0?<Badge variant="destructive">Sold Out</Badge>:<Badge variant="success">{a.stock} left</Badge>}</td>
                        <td className="p-4">{a.featured?<CheckCircle className="w-5 h-5 text-green-500" />:<X className="w-5 h-5 text-stone-300" />}</td>
                        <td className="p-4"><div className="flex items-center gap-1"><Link href={`/artwork/${a.id}`} target="_blank"><button className="p-1.5 rounded hover:bg-stone-100 text-stone-500 hover:text-amber-700"><Eye className="w-4 h-4" /></button></Link><button onClick={()=>setFormTarget(a)} className="p-1.5 rounded hover:bg-stone-100 text-stone-500 hover:text-amber-700"><Edit className="w-4 h-4" /></button><button onClick={()=>setDeleteTarget(a)} className="p-1.5 rounded hover:bg-red-50 text-stone-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div></td>
                      </tr>
                    ))}
                    {filtered.length===0 && <tr><td colSpan={6} className="p-8 text-center text-stone-400">No artworks found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab==="orders" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-stone-800">Orders</h1>
              {pending>0 && <Badge variant="warning">{pending} pending</Badge>}
            </div>
            <p className="text-stone-500 text-sm mb-6">Click any row to see full order details. The <strong>Order ID</strong> is a unique tracking reference customers use when contacting you.</p>
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 border-b border-stone-200">
                    <tr className="text-stone-500 text-xs uppercase tracking-wide">
                      <th className="text-left p-4">Order ID</th><th className="text-left p-4">Customer</th><th className="text-left p-4">Contact</th><th className="text-left p-4">Items</th><th className="text-left p-4">Total</th><th className="text-left p-4">Payment</th><th className="text-left p-4">Status</th><th className="text-left p-4">Date</th><th className="text-left p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.length===0 && (
                      <tr><td colSpan={9} className="p-12 text-center text-stone-400">
                        <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-stone-300" />
                        <p className="font-medium">No orders yet</p>
                        <p className="text-xs mt-1">Orders placed at checkout will appear here automatically</p>
                      </td></tr>
                    )}
                    {orders.map(o=>(
                      <tr key={o.id} className="hover:bg-amber-50 cursor-pointer" onClick={()=>setSelectedOrder(o)}>
                        <td className="p-4 font-mono text-xs font-bold text-amber-800">{o.id}</td>
                        <td className="p-4"><p className="font-medium text-stone-800">{o.customer}</p><p className="text-xs text-stone-400">{o.city}, {o.country}</p></td>
                        <td className="p-4"><p className="text-xs text-stone-600">{o.email}</p><p className="text-xs text-stone-400">{o.phone}</p></td>
                        <td className="p-4 text-stone-600">{o.items}</td>
                        <td className="p-4 font-bold text-amber-800">{formatPrice(o.total)}</td>
                        <td className="p-4 text-xs text-stone-500 capitalize">{o.paymentMethod}
                          {["easypaisa","jazzcash","bank"].includes(o.paymentMethod) && (
                            <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${o.paymentCleared===true?"bg-green-100 text-green-700":o.paymentCleared===false?"bg-red-100 text-red-700":"bg-yellow-100 text-yellow-700"}`}>
                              {o.paymentCleared===true?"✓ Cleared":o.paymentCleared===false?"✗ Rejected":"⏳ Pending"}
                            </span>
                          )}
                        </td>
                        <td className="p-4"><select value={o.status} onClick={e=>e.stopPropagation()} onChange={async e=>{e.stopPropagation();await handleStatusChange(o.id,e.target.value);}} className="text-xs border border-stone-200 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-amber-700">{ORDER_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></td>
                        <td className="p-4 text-stone-400 text-xs">{formatDate(o.date)}</td>
                        <td className="p-4"><button onClick={e=>{e.stopPropagation();setSelectedOrder(o);}} className="flex items-center gap-1 text-xs text-amber-700 hover:underline"><FileText className="w-3.5 h-3.5" />Details</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMERS */}
        {tab==="customers" && (
          <div>
            <h1 className="text-2xl font-bold text-stone-800 mb-2">Customers</h1>
            <p className="text-stone-500 text-sm mb-6">All customers who have placed orders</p>
            {orders.length===0 ? (
              <div className="text-center py-24 text-stone-400">
                <Users className="w-12 h-12 mx-auto mb-3 text-stone-300" />
                <p className="font-medium">No customers yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map(o=>(
                  <div key={o.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-full bg-amber-700 text-white text-sm font-bold flex items-center justify-center shrink-0">{o.customer.split(" ").map((n:string)=>n[0]).join("").slice(0,2).toUpperCase()}</div>
                      <div className="min-w-0"><p className="font-semibold text-stone-800 text-sm truncate">{o.customer}</p><p className="text-xs text-stone-400 truncate">{o.email}</p></div>
                    </div>
                    <div className="space-y-2 text-xs mb-4">
                      <div className="flex items-center gap-2 text-stone-600"><Phone className="w-3.5 h-3.5 text-amber-600" />{o.phone}</div>
                      <div className="flex items-center gap-2 text-stone-600"><MapPin className="w-3.5 h-3.5 text-amber-600" />{o.address}, {o.city}</div>
                      <div className="flex items-center gap-2 text-stone-600"><CreditCard className="w-3.5 h-3.5 text-amber-600" /><span className="capitalize">{o.paymentMethod}</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="bg-amber-50 rounded-lg p-2.5"><p className="text-stone-400 mb-0.5">Order Total</p><p className="font-bold text-amber-800">{formatPrice(o.total)}</p></div>
                      <div className="bg-stone-50 rounded-lg p-2.5"><p className="text-stone-400 mb-0.5">Status</p><Badge variant={STATUS_COLORS[o.status]||"default"} className="text-[10px]">{o.status}</Badge></div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <p className="text-xs text-stone-400 font-mono">{o.id}</p>
                      <button onClick={()=>setSelectedOrder(o)} className="text-xs text-amber-700 hover:underline flex items-center gap-1"><Eye className="w-3.5 h-3.5" />View Order</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {tab==="settings" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div><h1 className="text-2xl font-bold text-stone-800">Settings</h1><p className="text-stone-500 text-sm mt-1">Changes apply across the whole website instantly</p></div>
              {settingsSaved && <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-sm"><CheckCircle className="w-4 h-4" />Saved!</div>}
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
                <h2 className="font-bold text-stone-800 mb-1">Announcement Bar</h2>
                <p className="text-xs text-stone-400 mb-4">Top strip shown on every page</p>
                <div className="space-y-3">
                  <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Text</label><Input value={settingsForm.announcementText} onChange={setF("announcementText")} /></div>
                  <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Phone</label><Input value={settingsForm.announcementPhone} onChange={setF("announcementPhone")} /></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
                <h2 className="font-bold text-stone-800 mb-1">Social Media</h2>
                <p className="text-xs text-stone-400 mb-4">Footer social links</p>
                <div className="space-y-3">
                  <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Instagram URL</label><Input value={settingsForm.instagramUrl} onChange={setF("instagramUrl")} /></div>
                  <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Facebook URL</label><Input value={settingsForm.facebookUrl} onChange={setF("facebookUrl")} /></div>
                  <div><label className="block text-sm font-medium text-stone-700 mb-1.5">YouTube URL</label><Input value={settingsForm.youtubeUrl} onChange={setF("youtubeUrl")} /></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
                <h2 className="font-bold text-stone-800 mb-1">Contact Info</h2>
                <p className="text-xs text-stone-400 mb-4">Footer and contact page</p>
                <div className="space-y-3">
                  <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Phone / WhatsApp</label><Input value={settingsForm.contactPhone} onChange={setF("contactPhone")} /></div>
                  <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label><Input value={settingsForm.contactEmail} onChange={setF("contactEmail")} /></div>
                  <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Address</label><Input value={settingsForm.contactAddress} onChange={setF("contactAddress")} /></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
                <h2 className="font-bold text-stone-800 mb-1">Payment Account Details</h2>
                <p className="text-xs text-stone-400 mb-4">Shown to buyers at checkout — update whenever your account details change</p>
                <div className="space-y-5">
                  <div className="border border-green-200 rounded-xl p-4 bg-green-50/40">
                    <h3 className="font-semibold text-green-800 text-sm mb-3">💚 EasyPaisa</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><label className="block text-xs font-medium text-stone-600 mb-1">Mobile Number</label><Input value={settingsForm.easypaisaNumber} onChange={setF("easypaisaNumber")} placeholder="0300-1234567" /></div>
                      <div><label className="block text-xs font-medium text-stone-600 mb-1">Account Name</label><Input value={settingsForm.easypaisaName} onChange={setF("easypaisaName")} placeholder="Paint by Mahi" /></div>
                    </div>
                  </div>
                  <div className="border border-red-200 rounded-xl p-4 bg-red-50/40">
                    <h3 className="font-semibold text-red-800 text-sm mb-3">❤️ JazzCash</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><label className="block text-xs font-medium text-stone-600 mb-1">Mobile Number</label><Input value={settingsForm.jazzcashNumber} onChange={setF("jazzcashNumber")} placeholder="0300-1234567" /></div>
                      <div><label className="block text-xs font-medium text-stone-600 mb-1">Account Name</label><Input value={settingsForm.jazzcashName} onChange={setF("jazzcashName")} placeholder="Paint by Mahi" /></div>
                    </div>
                  </div>
                  <div className="border border-blue-200 rounded-xl p-4 bg-blue-50/40">
                    <h3 className="font-semibold text-blue-800 text-sm mb-3">🏦 Bank Transfer</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div><label className="block text-xs font-medium text-stone-600 mb-1">Bank Name</label><Input value={settingsForm.bankName} onChange={setF("bankName")} placeholder="Meezan Bank" /></div>
                      <div><label className="block text-xs font-medium text-stone-600 mb-1">Account Number</label><Input value={settingsForm.bankAccount} onChange={setF("bankAccount")} placeholder="01234567890" /></div>
                      <div><label className="block text-xs font-medium text-stone-600 mb-1">Account Title</label><Input value={settingsForm.bankTitle} onChange={setF("bankTitle")} placeholder="Paint by Mahi" /></div>
                      <div><label className="block text-xs font-medium text-stone-600 mb-1">IBAN</label><Input value={settingsForm.bankIban} onChange={setF("bankIban")} placeholder="PK00MEZN000..." /></div>
                    </div>
                  </div>
                  <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/40">
                    <h3 className="font-semibold text-amber-800 text-sm mb-3">📦 Cash on Delivery</h3>
                    <div className="max-w-xs"><label className="block text-xs font-medium text-stone-600 mb-1">COD Handling Fee (PKR)</label><Input value={settingsForm.codFee} onChange={setF("codFee")} placeholder="200" /></div>
                    <p className="text-xs text-stone-400 mt-2">Set to 0 to show no fee.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
                <h2 className="font-bold text-stone-800 mb-1">Artist Info</h2>
                <p className="text-xs text-stone-400 mb-4">Home page artist section</p>
                <div className="space-y-3">
                  <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Artist Name</label><Input value={settingsForm.artistName} onChange={setF("artistName")} /></div>
                  <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Bio Paragraph 1</label><Textarea value={settingsForm.artistBio1} onChange={setF("artistBio1")} rows={3} /></div>
                  <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Bio Paragraph 2</label><Textarea value={settingsForm.artistBio2} onChange={setF("artistBio2")} rows={3} /></div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Years</label><Input value={settingsForm.artistYears} onChange={setF("artistYears")} /></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Works</label><Input value={settingsForm.artistWorksCount} onChange={setF("artistWorksCount")} /></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Customers</label><Input value={settingsForm.artistCustomersCount} onChange={setF("artistCustomersCount")} /></div>
                    <div><label className="block text-sm font-medium text-stone-700 mb-1.5">Countries</label><Input value={settingsForm.artistCountries} onChange={setF("artistCountries")} /></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pb-6">
                <Button variant="gold" size="lg" onClick={saveSettings} className="gap-2 px-8"><Save className="w-4 h-4" />Save All Settings</Button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
