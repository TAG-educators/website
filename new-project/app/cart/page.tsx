"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Send, Loader2, CheckCircle, ArrowRight, ShoppingCart, BookOpen, MessageCircle, Plus, Clock, Calendar } from "lucide-react";
import { useCart } from "@/components/providers/cart-provider";
import { advanceVoyageStage } from "@/components/sections/voyage-tracker";
import { supabase } from "@/lib/supabase";
import { PageLayout } from "@/components/sections/page-layout";
import { FloatingSymbols } from "@/components/sections/floating-symbols";
import { siteConfig } from "@/lib/site-config";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useCurrency } from "@/components/providers/currency-provider";
import { selectionPricePKR } from "@/lib/pricing";
import type { Course } from "@/lib/courses";

export default function CartPage() {
  const { items, removeItem, clearCart } = useCart();
  const { settings } = useSiteSettings();
  const { format } = useCurrency();
  const [courseList, setCourseList] = useState<Course[] | null>(null);

  // Prices are looked up live (not stored in the cart) so admin price changes apply.
  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCourseList(data);
      })
      .catch(() => {});
  }, []);

  const priceFor = (item: (typeof items)[number]): number | null => {
    const course = courseList?.find((c) => c.slug === item.slug);
    return course && course.price > 0 ? selectionPricePKR(course.price, item.selectedLevel) : null;
  };
  const totalPKR = items.reduce((sum, item) => sum + (priceFor(item) ?? 0), 0);
  const hasUnpricedItem = items.some((item) => priceFor(item) === null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    studentName: "",
    studentPhone: "",
    studentEmail: "",
    location: "",
    parentName: "",
    parentPhone: "",
    commitment: false,
  });

  const whatsappUrl = settings?.phone
    ? `https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}`
    : siteConfig.whatsappUrl;
  const whatsappDisplay = settings?.phone || siteConfig.whatsappDisplay;
  const email = settings?.email || siteConfig.email;

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or reach us on WhatsApp.");
      return;
    }
    setStatus("loading");
    setErrorMessage(null);

    const courseLabels = items.map((item) =>
      item.batchDays || item.batchTime
        ? `${item.name} (${item.selectedLevel}) — ${[item.batchDays, item.batchTime, item.batchDuration ? `${item.batchDuration} mins` : null].filter(Boolean).join(", ")}`
        : `${item.name} (${item.selectedLevel})`
    );

    const insertPayload = {
      student_name: form.studentName,
      parent_name: form.parentName,
      email: form.studentEmail,
      phone: form.studentPhone,
      location: form.location,
      parent_phone: form.parentPhone,
      courses: courseLabels,
      status: "new",
    };

    const { error } = await supabase.from("registrations").insert(insertPayload);

    // Google Sheet backup (fire-and-forget — never blocks the user)
    fetch("https://script.google.com/macros/s/AKfycbwYVP6NuO-FtwsXOtx-D-cn_3_Y78iF7mvUYn93UrPUNUqI6z-hMsIOh3RJe0TldSEK/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(insertPayload),
    }).catch(() => {});

    if (error) {
      setStatus("error");
      setErrorMessage("We couldn't submit your registration. Please try again, or message us on WhatsApp and we'll sign you up manually.");
      return;
    }

    setStatus("success");
    clearCart();
    setForm({ studentName: "", studentPhone: "", studentEmail: "", location: "", parentName: "", parentPhone: "", commitment: false });
    advanceVoyageStage(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputClass = "h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-[#b472cc] focus:ring-2 focus:ring-[#b472cc]/10";

  return (
    <PageLayout>
      {/* Hero */}
      <section className="cart-page relative bg-ocean-deeper pt-32 md:pt-40" data-header-theme="dark">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-ocean/20 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-ocean-light/10 blur-[100px]" />
        <FloatingSymbols />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <ShoppingCart className="h-4 w-4" style={{ color: "#b472cc" }} />
            <span className="text-sm font-medium text-white/80">Registration</span>
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
            Your Registration
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/70 text-pretty">
            Review your selected courses, fill in your details, and we will confirm your batch timings on WhatsApp.
          </p>
        </div>
        {/* Content */}
        <div className="relative z-10 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-2xl rounded-3xl border border-border bg-white p-12 text-center shadow-premium"
              >
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-white"
                  style={{ background: "linear-gradient(135deg, #6b2f78, #a855c4)" }}
                >
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h2 className="mt-8 font-display text-3xl font-bold text-foreground">
                  Registration Submitted!
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Thank you for your interest in TAG Educators. Our team will get back to you with a confirmation shortly.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href="/courses"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold text-white shadow-[0_4px_16px_-4px_rgba(107,47,120,0.5)] transition-all hover:brightness-110 hover:-translate-y-0.5 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #6b2f78, #a855c4)" }}
                  >
                    Browse More Courses
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 text-base font-semibold text-foreground transition-all hover:border-[#b472cc] hover:text-[#b472cc] active:scale-95"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Message on WhatsApp
                  </a>
                </div>
              </motion.div>
            ) : items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1, margin: "0px 0px -40px 0px" }}
                className="mx-auto max-w-2xl rounded-3xl border border-border bg-white p-16 text-center shadow-premium"
              >
                <div
                  className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(107, 47, 120, 0.1), rgba(168, 85, 196, 0.05))",
                    color: "#b472cc",
                  }}
                >
                  <ShoppingCart className="h-12 w-12" strokeWidth={1.5} />
                </div>
                <h2 className="mt-8 font-display text-3xl font-bold text-foreground">
                  No Courses Selected Yet
                </h2>
                <p className="mt-4 text-base text-muted-foreground">
                  Browse our courses and add the ones you would like to try.
                </p>
                <Link
                  href="/courses"
                  className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold text-white shadow-[0_4px_16px_-4px_rgba(107,47,120,0.5)] transition-all hover:brightness-110 hover:-translate-y-0.5 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #6b2f78, #a855c4)" }}
                >
                  Browse Courses
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            ) : (
              <div
                key="cart"
                className="cart-registration-layout grid items-start gap-8 md:grid-cols-[1.4fr_1fr]"
              >
                {/* Left: Cart items + form */}
                <div>
                  {/* Cart items */}
                  <h2 className="font-display text-2xl font-bold text-white">
                    Selected Courses ({items.length})
                  </h2>

                  <div className="mt-6 flex flex-col gap-4">
                    <AnimatePresence>
                      {items.map((item) => {
                        const itemKey = `${item.slug}-${item.selectedLevel}`;
                        return (
                          <motion.div
                            key={itemKey}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.1, margin: "0px 0px -40px 0px" }}
                            exit={{ opacity: 0, x: -30 }}
                            className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-premium transition-[border-color,box-shadow] duration-300 hover:border-[#b472cc]/30 hover:shadow-premium-lg"
                          >
                            <div
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                              style={{
                                background: "linear-gradient(135deg, rgba(107, 47, 120, 0.2), rgba(168, 85, 196, 0.1))",
                                color: "#b472cc",
                              }}
                            >
                              <BookOpen className="h-6 w-6" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/courses/${item.slug}`}
                                className="font-display text-[1.05rem] font-bold text-foreground transition-colors hover:text-[#b472cc]"
                              >
                                {item.name}
                              </Link>
                              <div className="mt-1 flex items-center gap-2 flex-wrap">
                                <span
                                  className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                                  style={{ background: "rgba(107, 47, 120, 0.1)", color: "#b472cc" }}
                                >
                                  {item.selectedLevel}
                                </span>
                                {item.batchDays && (
                                  <span className="shrink-0 flex items-center gap-1 text-[0.78rem] text-muted-foreground">
                                    <Calendar className="h-3 w-3" style={{ color: "#b472cc" }} />
                                    {item.batchDays}
                                  </span>
                                )}
                                {item.batchTime && (
                                  <span className="shrink-0 flex items-center gap-1 text-[0.78rem] text-muted-foreground">
                                    <Clock className="h-3 w-3" style={{ color: "#b472cc" }} />
                                    {item.batchTime}
                                  </span>
                                )}
                                {item.batchDuration && (
                                  <span className="shrink-0 text-[0.78rem] text-muted-foreground">{item.batchDuration} mins</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(itemKey)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                              aria-label={`Remove ${item.name} (${item.selectedLevel})`}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  <div className="mt-5">
                    <Link
                      href="/courses"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5"
                      style={{ color: "#b472cc" }}
                    >
                      <Plus className="h-4 w-4" />
                      Add more courses
                    </Link>
                  </div>

                  {/* Registration form */}
                  <div className="mt-10">
                    <h2 className="font-display text-2xl font-bold text-white">Your Details</h2>
                    <p className="mt-1.5 text-[0.92rem] text-white/70">
                      Fill in your information below. We will confirm your registration on WhatsApp.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-premium">
                      <div className="space-y-5">
                        <div>
                          <label className="mb-2 block text-[0.88rem] font-medium text-foreground">Student Full Name *</label>
                          <input required value={form.studentName} onChange={(e) => handleChange("studentName", e.target.value)} placeholder="Full name" className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.88rem] font-medium text-foreground">Student WhatsApp Number * (with country code)</label>
                          <input required type="tel" value={form.studentPhone} onChange={(e) => handleChange("studentPhone", e.target.value)} placeholder="+92 ..." className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.88rem] font-medium text-foreground">Student Email Address *</label>
                          <input required type="email" value={form.studentEmail} onChange={(e) => handleChange("studentEmail", e.target.value)} placeholder="student@example.com" className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.88rem] font-medium text-foreground">Current Location (Country & City) *</label>
                          <input required value={form.location} onChange={(e) => handleChange("location", e.target.value)} placeholder="e.g. Karachi, Pakistan" className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.88rem] font-medium text-foreground">Parent/Guardian Full Name *</label>
                          <input required value={form.parentName} onChange={(e) => handleChange("parentName", e.target.value)} placeholder="Parent or guardian name" className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.88rem] font-medium text-foreground">Parent/Guardian WhatsApp Number *</label>
                          <input required type="tel" value={form.parentPhone} onChange={(e) => handleChange("parentPhone", e.target.value)} placeholder="+92 ..." className={inputClass} />
                        </div>
                        <div className="flex items-start gap-3">
                          <input type="checkbox" required checked={form.commitment} onChange={(e) => handleChange("commitment", e.target.checked)} className="mt-1 h-4 w-4 rounded border-border accent-[#b472cc]" />
                          <label className="text-[0.82rem] leading-relaxed text-muted-foreground">
                            I understand that batch sizes are strictly limited. I agree to finalize my fee payment to lock in my seat before it is passed to the next student on the waitlist.
                          </label>
                        </div>
                      </div>

                      {status === "error" && errorMessage && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.85rem] text-red-700">
                          {errorMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-base font-semibold text-white shadow-[0_4px_16px_-4px_rgba(107,47,120,0.5)] transition-all hover:brightness-110 active:scale-95 disabled:opacity-70"
                        style={{ background: "linear-gradient(135deg, #6b2f78, #a855c4)" }}
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Secure My Spot
                            <Send className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right: Summary */}
                <div className="cart-registration-summary">
                  <div className="rounded-2xl border border-border bg-white p-6 shadow-premium">
                    <h3 className="font-display text-[1.15rem] font-bold text-foreground">Registration Summary</h3>

                    <div className="mt-5 space-y-0">
                      {items.map((item) => {
                        const price = priceFor(item);
                        return (
                          <div key={`${item.slug}-${item.selectedLevel}`} className="flex items-start justify-between gap-3 border-b border-border py-2.5 text-[0.92rem] text-muted-foreground last:border-b-0">
                            <div className="min-w-0">
                              <span className="block">{item.name}</span>
                              <span className="block text-[0.82rem] font-medium" style={{ color: "#b472cc" }}>{item.selectedLevel}</span>
                            </div>
                            <span className="shrink-0 font-semibold text-foreground">
                              {price !== null ? format(price) : "—"}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-[0.92rem] text-muted-foreground">
                      <span>Total Courses</span>
                      <span>{items.length}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[1.1rem] font-semibold text-foreground">
                      <span>Total Price</span>
                      <span>{courseList ? format(totalPKR) : "—"}</span>
                    </div>
                    {courseList && hasUnpricedItem && (
                      <p className="mt-1 text-[0.78rem] text-muted-foreground">
                        Some courses have no listed price and are not included in the total.
                      </p>
                    )}

  

                    <Link
                      href="/courses"
                      className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-white text-sm font-semibold text-foreground transition-all hover:border-[#b472cc] hover:text-[#b472cc] active:scale-95"
                    >
                      Add More Courses
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}