import "./public.css";

export default function Loading() {
  return (
    <div className="public-theme loading-page">
      <div className="wrap">
        <div className="loading-content">
          <svg className="loading-arc" viewBox="0 0 120 40" fill="none">
            <path d="M5 35 Q60 -5 115 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="loading-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}
