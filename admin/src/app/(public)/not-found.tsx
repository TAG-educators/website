import Link from "next/link";
import "./public.css";

export default function NotFound() {
  return (
    <div className="public-theme not-found-page">
      <div className="wrap">
        <div className="not-found-content">
          <svg className="not-found-arc" viewBox="0 0 120 40" fill="none">
            <path d="M5 35 Q60 -5 115 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h1>404</h1>
          <h2>Page not found</h2>
          <p>The page you're looking for has drifted off course. Let's get you back on deck.</p>
          <div className="not-found-actions">
            <Link href="/" className="btn-primary">
              Back to Home
              <svg className="go-arc" viewBox="0 0 20 14" fill="none">
                <path className="horizon" d="M0 7h18" />
                <path className="sun" d="M14 1l4 6-4 6" />
              </svg>
            </Link>
            <Link href="/courses" className="btn-ghost">Browse Courses</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
