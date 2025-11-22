import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadKakao } from "../lib/loadKakao";
import ReportSummaryCard from "../component/ReportSummaryCard";
import ReportDetailPanel from "../component/ReportDetailPanel";
import { useRouteStore } from "../store/useRouteStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getPlaceLabel = (place) => {
  if (!place) return "";
  if (typeof place === "string") return place;

  return (
    place.place_name ||
    place.road_address_name ||
    place.address_name ||
    place.name ||
    ""
  );
};

export default function ReportScreen() {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const navigate = useNavigate();

  const { start, end, paths } = useRouteStore();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);
  const [reportData, setReportData] = useState(null);

  // 지도 초기화
  useEffect(() => {
    let ro;

    loadKakao().then((kakao) => {
      if (!mapRef.current) return;

      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(37.5446, 127.0565),
        level: 4,
      });

      mapObjRef.current = map;
      map.setDraggable(false);
      map.setZoomable(false);

      ro = new ResizeObserver(() => {
        mapObjRef.current?.relayout();
      });
      ro.observe(mapRef.current);
    });

    return () => {
      ro?.disconnect();
      mapObjRef.current = null;
    };
  }, []);

  // fallback polyline
  const fallbackPreviewPath = [
    { lat: 37.5439, lng: 127.0553 },
    { lat: 37.5446, lng: 127.0565 },
    { lat: 37.5453, lng: 127.0582 },
  ];

  const cardPaths = Array.isArray(paths) ? paths.slice(0, 3) : [];

  // 상세 보기 클릭
  const handleOpenDetail = async (path, index) => {
    if (!path) {
      alert("유효한 경로가 없습니다.");
      return;
    }

    setIsDetailOpen(true);
    setIsReportLoading(true);
    setReportError(null);
    setReportData(null);

    try {
      const originLabel = getPlaceLabel(start);
      const destLabel = getPlaceLabel(end);

      const coordinates =
        Array.isArray(path.polyline) && path.polyline.length > 0
          ? path.polyline
          : fallbackPreviewPath;

          const payload = {
            routeId: path.id,
            origin: originLabel,
            destination: destLabel,
            totalDistance: path.distance ?? 0,
            totalTime: path.time ?? 0,
            coordinates,
            score: path.score ?? 0,      // ★ 반드시 추가
            grade: path.grade ?? "N/A",  // ★ 반드시 추가
          };

      const response = await fetch(`${API_BASE_URL}/api/v1/analysis/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (!response.ok) {
        console.error("[REPORT] API 실패:", json?.message);
        setReportError(json?.message || "리포트 생성 실패");
        return;
      }

      setReportData(json.report);
    } catch (error) {
      console.error("[REPORT] 네트워크 오류", error);
      setReportError("네트워크 오류로 리포트 생성 실패");
    } finally {
      setIsReportLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 mx-auto w-full max-w-[402px] h-screen overflow-hidden">
      <div ref={mapRef} className="absolute inset-0 -z-10 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-neutral-white/40 backdrop-blur-[6px] pointer-events-none" />

      {/* 카드 슬라이더 */}
      <div className="absolute left-1/2 top-[47%] z-20 w-full -translate-x-1/2 -translate-y-1/2">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pl-10 pr-10">
          {cardPaths.map((path, i) => {
            if (!path) return null;

            const previewPath =
              Array.isArray(path.polyline) && path.polyline.length > 0
                ? path.polyline
                : fallbackPreviewPath;

            return (
              <div key={path.id} className="shrink-0 w-full max-w-[322px] snap-center">
                <ReportSummaryCard
                  variant={i === 1 ? "bright" : i === 2 ? "fast" : "balanced"}
                  previewCenter={{ lat: previewPath[0].lat, lng: previewPath[0].lng }}
                  previewPath={previewPath}
                  onDetail={() => handleOpenDetail(path, i)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 상세 패널 */}
      {isDetailOpen && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/20"
          onClick={() => setIsDetailOpen(false)}
        >
          <div className="w-full px-4" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto max-w-[356px] h-[72vh] rounded-[20px] overflow-hidden -translate-y-6">
              <div className="h-full overflow-y-auto no-scrollbar">
                <ReportDetailPanel
                  report={reportData}
                  loading={isReportLoading}
                  error={reportError}
                  onGuideClick={() => navigate("/route")}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}