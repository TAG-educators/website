import { fetchSettings } from "@/lib/settings";
import "../public.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact — TAG Educators",
  description: "Get in touch with TAG Educators. WhatsApp, email, or send us a message.",
};

function phoneToWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export default async function ContactPage() {
  const { data: settings } = await fetchSettings();

  const whatsapp = settings ? phoneToWhatsApp(settings.phone) : "";
  const email = settings?.email || "";
  const phone = settings?.phone || "";
  const address = settings?.address || "";

  return (
    <div className="catalog-page">
      <div className="wrap">
        <div className="section-head" style={{ textAlign: "left", marginBottom: 48 }}>
          <span className="eyebrow">Get in Touch</span>
          <h1 style={{ fontSize: "var(--fs-h2)" }}>Contact Us</h1>
          <p>Have a question about courses, enrollment, or anything else? We're here to help.</p>
        </div>

        <div className="contact-grid">
          {/* Contact methods */}
          <div className="contact-methods">
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noopener" className="contact-method-card">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 20l1.2-3.6A7.5 7.5 0 1112 19.5a7.4 7.4 0 01-3.4-.8L4 20" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="contact-method-info">
                  <h3>WhatsApp</h3>
                  <p>{phone}</p>
                  <span className="contact-method-action">Chat now →</span>
                </div>
              </a>
            )}

            {email && (
              <a href={`mailto:${email}`} className="contact-method-card">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="contact-method-info">
                  <h3>Email</h3>
                  <p>{email}</p>
                  <span className="contact-method-action">Send email →</span>
                </div>
              </a>
            )}

            {address && (
              <div className="contact-method-card">
                <div className="contact-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 21s-7-6.5-7-11a7 7 0 0114 0c0 4.5-7 11-7 11z" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div className="contact-method-info">
                  <h3>Location</h3>
                  <p>{address}</p>
                </div>
              </div>
            )}

            {/* Social links */}
            <div className="contact-social">
              {settings?.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener" className="social-link">Instagram</a>
              )}
              {settings?.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener" className="social-link">Facebook</a>
              )}
              {settings?.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener" className="social-link">YouTube</a>
              )}
            </div>
          </div>

          {/* Contact form */}
          <div className="contact-form-wrap">
            <h3>Send us a message</h3>
            <form className="contact-form" action="/api/contact" method="POST">
              <div className="form-row">
                <label>
                  <span>Name</span>
                  <input type="text" name="name" required placeholder="Your name" />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" name="email" required placeholder="you@example.com" />
                </label>
              </div>
              <label>
                <span>Subject</span>
                <input type="text" name="subject" placeholder="What's this about?" />
              </label>
              <label>
                <span>Message</span>
                <textarea name="message" rows={5} required placeholder="Tell us how we can help..." />
              </label>
              <button type="submit" className="btn-primary">
                Send Message
                <svg className="go-arc" viewBox="0 0 20 14" fill="none">
                  <path className="horizon" d="M0 7h18" />
                  <path className="sun" d="M14 1l4 6-4 6" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
