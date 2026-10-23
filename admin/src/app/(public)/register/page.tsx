"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Course } from "@/lib/types";
import "../public.css";

export default function RegisterPage() {
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load courses from cart (sessionStorage)
    try {
      const raw = sessionStorage.getItem("tag-cart");
      if (raw) setSelectedCourses(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      studentName: formData.get("studentName"),
      parentName: formData.get("parentName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      courses: selectedCourses.map((c) => c.title),
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Registration failed");
      setSubmitted(true);
      sessionStorage.removeItem("tag-cart");
    } catch {
      setError("Something went wrong. Please try again or contact us on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="catalog-page">
        <div className="wrap">
          <div className="register-success">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1>Registration received!</h1>
            <p>Thank you. We've received your registration and will contact you within 24 hours to confirm your enrollment.</p>
            <div className="register-success-actions">
              <Link href="/" className="btn-primary">Back to Home</Link>
              <Link href="/courses" className="btn-ghost">Browse More Courses</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <div className="wrap">
        <div className="section-head" style={{ textAlign: "left", marginBottom: 48 }}>
          <span className="eyebrow">Enrollment</span>
          <h1 style={{ fontSize: "var(--fs-h2)" }}>Register for Courses</h1>
          <p>Fill in your details below and we'll get you started.</p>
        </div>

        <div className="register-layout">
          {/* Selected courses sidebar */}
          <div className="register-courses">
            <h3>Selected Courses</h3>
            {selectedCourses.length === 0 ? (
              <p className="register-no-courses">
                No courses selected.{" "}
                <Link href="/courses">Browse courses →</Link>
              </p>
            ) : (
              <div className="register-course-list">
                {selectedCourses.map((c) => (
                  <div key={c.id} className="register-course-item">
                    <span className="course-level-badge">{c.level}</span>
                    <div>
                      <strong>{c.title}</strong>
                      <p>{c.subject}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Registration form */}
          <form className="register-form" onSubmit={handleSubmit}>
            <h3>Student Details</h3>

            <label>
              <span>Student Name *</span>
              <input type="text" name="studentName" required placeholder="Student's full name" />
            </label>

            <label>
              <span>Parent / Guardian Name</span>
              <input type="text" name="parentName" placeholder="Parent or guardian name" />
            </label>

            <div className="form-row">
              <label>
                <span>Email *</span>
                <input type="email" name="email" required placeholder="you@example.com" />
              </label>
              <label>
                <span>Phone / WhatsApp *</span>
                <input type="tel" name="phone" required placeholder="+92 3XX XXXXXXX" />
              </label>
            </div>

            <label>
              <span>Additional Notes</span>
              <textarea name="notes" rows={4} placeholder="Any questions or special requirements..." />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Registration"}
              {!submitting && (
                <svg className="go-arc" viewBox="0 0 20 14" fill="none">
                  <path className="horizon" d="M0 7h18" />
                  <path className="sun" d="M14 1l4 6-4 6" />
                </svg>
              )}
            </button>

            <p className="form-disclaimer">
              By submitting, you agree to be contacted by TAG Educators regarding your enrollment.
              We'll reach out via WhatsApp or email within 24 hours.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
