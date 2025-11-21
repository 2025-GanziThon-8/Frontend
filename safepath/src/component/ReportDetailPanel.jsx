export default function ReportDetailPanel({
  // 프론트에서만 관리하는 기본 텍스트 (fallback 용)
  routeText = "경로 : 출발지  →  도착지",
  criteriaText = "분석 기준 : CPTED",

  // /analysis/report 응답 데이터
  report, 
  loading = false,
  error,
  onGuideClick,
}) {
  // 응답 데이터 구조 분해
  const summary = report?.route_summary || null;
  const evals = report?.cpted_evaluation || {};
  const facilities = evals.facilities || {};
  const natural = evals.natural_surveillance || {};
  const access = evals.access_control || {};
  const activity = evals.activity_support || {};
  const maintain = evals.maintenance || {};
  const territory = evals.territoriality || {};
  const guides = report?.segment_guides || [];

  // 경로 텍스트 
  const displayRouteText = summary ? `경로 : ${summary.origin}  →  ${summary.destination}` : routeText;

  // 종합 등급 텍스트 
  const displayGradeText = summary?.overall_grade ? `종합 등급 : ${summary.overall_grade}` : "종합 등급 : 등급 (점)";

  // 거리 텍스트 
  const distanceMeters =
    typeof summary?.total_distance === "number" ? summary.total_distance : null;

  const displayDistanceText =
    distanceMeters != null ? `거리 : ${(distanceMeters / 1000).toFixed(2)} km` : "거리 : 0 km";

  // AI 요약 문장 
  const aiSummaryText = report?.ai_summary ?? "요약 내용";

  // CPTED 평가 리스트
  const cptedItems =
    report && Object.keys(evals).length > 0
      ? [
          `자연감시 (${natural.score ?? "-"}점) - ${
            natural.description ?? "자연감시 평가 결과"
          }`,
          `접근통제 (${access.score ?? "-"}점) - ${
            access.description ?? "접근통제 평가 결과"
          }`,
          `활동성 (${activity.score ?? "-"}점) - ${
            activity.description ?? "활동성 평가 결과"
          }`,
          `유지관리 (${maintain.score ?? "-"}점) - ${
            maintain.description ?? "유지관리 평가 결과"
          }`,
          `영역성 (${territory.score ?? "-"}점) - ${
            territory.description ?? "영역성 평가 결과"
          }`,
          `시설 현황: CCTV ${facilities.cctv_count ?? 0}대 · 조명 ${
            facilities.light_count ?? 0
          }개 · 편의점 ${facilities.store_count ?? 0}개 · 경찰시설 ${
            facilities.police_count ?? 0
          }곳 · 학교 ${facilities.school_count ?? 0}곳`,
        ]
      : [
          "자연감시 : 0점 - ",
          "접근통제 : 0점 - ",
          "영역성 : 0점 - ",
          "활동성 : 0점 - ",
          "유지관리 : 0점 - ",
        ];

  // 구간별 안내 리스트
  const sectionItems =
    guides.length > 0
      ? guides.map((g) => {
          const desc = g.description || "";
          const dist = g.distance_range || "";
          const level = g.safety_level || "";
          const rec =
            g.recommendations && g.recommendations.length > 0
              ? ` (${g.recommendations.join(", ")})`
              : "";

          return `${dist} : ${desc} ${level ? `[${level}]` : ""}${rec}`;
        })
      : [];

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
        {/* 로딩 / 에러 상태 안내 */}
        {loading && (
          <p className="mb-3 text-center text-[12px] text-neutral-gray200">
            CPTED · AI 리포트를 생성하는 중입니다...
          </p>
        )}
        {error && (
          <p className="mb-3 text-center text-[12px] text-red-500 whitespace-pre-line">
            {error}
          </p>
        )}

        {/* 경로 / 점수 정보 */}
        <div className="space-y-1.5 text-neutral-black text-[16px] font-medium tracking-[0.04em]">
          <p>{displayRouteText}</p>
          <p>{displayGradeText}</p>
          <p>{displayDistanceText}</p>
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
            {aiSummaryText}
          </p>
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