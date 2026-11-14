export default function Preloader({ isHidden }) {
  return (
    <div
      className={`sadeem-preloader ${isHidden ? "is-hidden" : ""}`}
      role="status"
      aria-label="جاري تحميل سديم"
      aria-live="polite"
    >
      <div className="sadeem-preloader-content">
        <div className="sadeem-logo" dir="ltr">
          <span className="sadeem-logo-ar" dir="rtl">
            سديم
          </span>

          <span className="sadeem-logo-divider" />

          <span className="sadeem-logo-en">SADEEM</span>
        </div>

        <p className="sadeem-tagline">جمالك يبدأ من هنا</p>

        <div className="sadeem-loader">
          <span />
        </div>
      </div>
    </div>
  );
}
