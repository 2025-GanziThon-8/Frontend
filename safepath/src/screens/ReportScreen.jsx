// src/screens/ReportScreen.jsx
import { useEffect, useRef, useState } from "react";
import { loadKakao } from "../lib/loadKakao";
import ReportSummaryCard from "../component/ReportSummaryCard";
import ReportDetailPanel from "../component/ReportDetailPanel";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""; // 배포 전에는 ""로 두고 상대 경로 사용

export default function ReportScreen() {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);

  // 🔹 상세 패널 오픈 여부
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 🔹 /analysis/report 응답 상태
  const [reportData, setReportData] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

  useEffect(() => {
    let ro;
    loadKakao().then((kakao) => {
      if (!mapRef.current) return;

      const center = new kakao.maps.LatLng(37.5446, 127.0565); // 성수역
      const map = new kakao.maps.Map(mapRef.current, { center, level: 4 });
      mapObjRef.current = map;

      map.setDraggable(false);
      map.setZoomable(false);

      ro = new ResizeObserver(() => mapObjRef.current?.relayout());
      ro.observe(mapRef.current);
    });

    return () => {
      ro?.disconnect();
      mapObjRef.current = null;
    };
  }, []);

  const previewPath = [
    { lat: 37.5439, lng: 127.0553 },
    { lat: 37.5446, lng: 127.0565 },
    { lat: 37.5453, lng: 127.0582 },
  ];

  // 🔹 요약 카드 → 상세 열기 + /analysis/report 요청
  const handleOpenDetail = async () => {
    setIsDetailOpen(true);
    setIsReportLoading(true);
    setReportError(null);
    setReportData(null);

    try {
      const response = await fetch(`${API_BASE_URL}/analysis/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route_id: "path-1",
          stats: {
            distance: 1300, // 예시: 1300m
            time: 900, // 예시: 900초 (15분)
            cpted_avg: 82.3,
          },
        }),
      });

      const isJson =
        response.headers
          .get("content-type")
          ?.includes("application/json") ?? false;
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        // 명세서: 400 / 422 / 500 / 502 등 공통 처리
        const message =
          data?.detail ||
          data?.message ||
          `리포트 생성에 실패했습니다. (HTTP ${response.status})`;
        setReportError(message);
        setReportData(null);
        return;
      }

      // 성공 (200 OK) → data.report 사용
      setReportData(data?.report ?? null);
    } catch (e) {
      setReportError("네트워크 오류로 리포트 생성에 실패했습니다.");
      setReportData(null);
    } finally {
      setIsReportLoading(false);
    }
  };

  // 🔹 상세 닫기
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    // 필요하면 에러/데이터도 여기서 초기화
    // setReportData(null);
    // setReportError(null);
  };

  return (
    <div className="fixed inset-0 mx-auto w-full max-w-[402px] h-screen overflow-hidden">
      {/* 지도: 배경 고정 */}
      <div
        ref={mapRef}
        className="absolute inset-0 -z-10 pointer-events-none"
      />

      {/* 블러 오버레이 */}
      <div className="absolute inset-0 z-10 bg-neutral-white/40 backdrop-blur-[6px] pointer-events-none" />

      {/* 가로 슬라이더 */}
      <div className="absolute left-1/2 top-[47%] z-20 w-full -translate-x-1/2 -translate-y-1/2 ">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pl-10 pr-10">
          {[0, 1, 2].map((i) => (
             <div key={i} className="shrink-0 w-full max-w-[322px] snap-center">
              <ReportSummaryCard
                previewCenter={{
                  lat: 37.5446 + i * 0.0003,
                  lng: 127.0565 + i * 0.0003,
                }}
                previewPath={previewPath}
                onDetail={handleOpenDetail}
                onClose={() => {}}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 상세 리포트 패널 (모달) */}
      {isDetailOpen && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/20"
          onClick={handleCloseDetail} // 바깥 클릭 시 닫기
        >
          <div
            className="w-full px-4"
            onClick={(e) => e.stopPropagation()} // 패널 내부 클릭 시 닫힘 방지
          >
            {/* 카드 자체 높이를 고정: 화면의 72% + 살짝 위로 올림 */}
            <div className="mx-auto max-w-[356px] h-[72vh] rounded-[20px] overflow-hidden -translate-y-6">
              {/* 이 안에서만 세로 스크롤 */}
              <div className="h-full overflow-y-auto no-scrollbar">
                <ReportDetailPanel
                  report={reportData}
                  loading={isReportLoading}
                  error={reportError}
                  onGuideClick={() => {}}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
