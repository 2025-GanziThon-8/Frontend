export default function Loading({
  size = 64,        // px
  thickness = 8,    // stroke width
  arcColor,
  className = "",
  ...rest
}) {
 
  const primaryGreen = "#6BC96A";   
  const neutralWhite = "#FFFDF5";   

  const finalArcColor = arcColor ?? primaryGreen;

  // 원형 진행 아크 길이 계산
  const r = size / 2 - thickness / 2;
  const C = 2 * Math.PI * r;
  const arc = C * 0.28; // 원의 28% 정도 길이

  return (
    <div
      role="status"
      aria-busy="true"
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      {...rest}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="animate-[spin_1.2s_linear_infinite]"
      >
        {/* 바깥 테두리 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={neutralWhite}
          strokeWidth={thickness}
          fill="none"
        />
        {/* 진행 아크 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={finalArcColor}
          strokeWidth={thickness}
          strokeLinecap="butt"
          strokeDasharray={`${arc} ${C}`}
          fill="none"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
