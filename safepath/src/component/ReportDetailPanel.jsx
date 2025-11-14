// src/components/ReportDetailPanel.jsx

export default function ReportDetailPanel({
  routeText = "경로 : 성수역  →  한양대역",
  gradeText = "종합 등급 : A등급 (82점)",
  distanceText = "거리 : 0.85 km",
  criteriaText = "분석 기준 : CPTED",
  summaryText =
    "일부 좁은 골목 구간(210 ~ 310m)은 집중등이 희박으로\n주의가 필요합니다.",
  onGuideClick,
}) {
  // CPTED 평가 / 구간 안내 더미 데이터
  const cptedItems = [
    "자연감시 : 90점 - 밝고 CCTV 다수 존재",
    "접근통제 : 70점 - 개방형 접속 다수 존재",
    "영역성 강화 : 80점 - 상점 및 출입구 다수 조성",
    "활동성 : 75점 - 야간 시간대 인적 도보",
    "유지관리 : 85점 - 조명/시설 양호",
  ];

  const sectionItems = [
    "0m ~ 200m : 조명 밝음, CCTV 다수 + 안전",
    "210m ~ 310m : 간헐적 어두운 구간 존재, 주의 필요",
    "320m ~ 850m : 상업시설 밀집, 인적 많음 + 안전",
  ];

  return (
    <div className="w-full max-w-[356px] rounded-[20px] bg-neutral-white border border-neutral-gray100 shadow-md overflow-hidden">
      {/* 헤더 */}
      <div className="bg-primary-green px-5 pt-4 pb-3">
        <p className="text-[22px] font-semibold tracking-[0.08em] text-neutral-white">
          AI SAFETY REPORT
        </p>
        <p className="mt-1 text-[14px] font-medium tracking-[0.04em] text-neutral-white">
          CPTED 기반 분석
        </p>
      </div>

      {/* 본문 */}
      <div className="px-6 pt-6 pb-5">
        {/* 경로 / 점수 정보 */}
        <div className="space-y-1.5 text-neutral-black text-[16px] font-medium tracking-[0.04em]">
          <p>{routeText}</p>
          <p>{gradeText}</p>
          <p>{distanceText}</p>
          <p>{criteriaText}</p>
        </div>

        {/* 구분선 */}
        <div className="mt-5 h-px w-full bg-black/10" />

        {/* 요약 섹션 */}
        <div className="mt-5 text-center">
          <h3 className="text-[18px] font-semibold tracking-[0.04em] text-neutral-black">
            요약
          </h3>
          <p className="mt-3 text-[12px] font-medium tracking-[0.04em] text-neutral-black leading-relaxed whitespace-pre-line">
            {summaryText}
          </p>

          {/* 페이지 도트 */}
          <div className="mt-4 flex justify-center gap-2">
            <span className="w-[6px] h-[6px] rounded-full bg-[#7D817D]" />
            <span className="w-[6px] h-[6px] rounded-full bg-[#CFCED2]" />
          </div>
        </div>

        {/* CPTED 평가 */}
        <div className="mt-6 rounded-[12px] border border-primary-green bg-primary-green/5 px-4 py-3">
          <h4 className="text-center text-[14px] font-semibold text-neutral-black">
            CPTED 평가
          </h4>
          <div className="mt-2 h-px w-full bg-black/10" />
          <ul className="mt-3 space-y-1.5 text-[12px] text-neutral-black leading-relaxed">
            {cptedItems.map((text, idx) => (
              <li key={idx}>{text}</li>
            ))}
          </ul>
        </div>

        {/* 구간별 안내 */}
        <div className="mt-6">
          <h4 className="text-center text-[14px] font-semibold text-neutral-black">
            구간별 안내
          </h4>
          <ul className="mt-3 space-y-1.5 text-[12px] text-neutral-black leading-relaxed">
            {sectionItems.map((text, idx) => (
              <li key={idx}>{text}</li>
            ))}
          </ul>
        </div>

        {/* 길 안내 버튼 */}
        <button
          type="button"
          onClick={onGuideClick}
          className="mt-6 w-full h-[48px] rounded-lg bg-primary-green text-neutral-white text-[16px] font-semibold leading-[24px] text-center hover:brightness-95 active:brightness-90 transition"
        >
          길 안내 받기
        </button>
      </div>
    </div>
  );
}
