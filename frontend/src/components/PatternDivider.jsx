export default function PatternDivider({ light = false }) {
  const stroke = light ? "rgba(245,242,235,0.55)" : "rgba(28,26,23,0.35)";
  const dot = light ? "#C85A3C" : "#C85A3C";
  return (
    <div className="w-full flex items-center gap-4 select-none" aria-hidden>
      <div className="flex-1 h-px" style={{ background: stroke, opacity: 0.4 }} />
      <svg width="120" height="18" viewBox="0 0 120 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 9 C 18 -2, 32 20, 48 9 S 78 -2, 94 9 S 118 20, 118 9" stroke={stroke} strokeWidth="1"/>
        <circle cx="60" cy="9" r="3.5" fill={dot} />
        <circle cx="60" cy="9" r="7" stroke={stroke} strokeWidth="0.8" fill="none"/>
      </svg>
      <div className="flex-1 h-px" style={{ background: stroke, opacity: 0.4 }} />
    </div>
  );
}
