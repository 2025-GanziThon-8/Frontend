import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadKakao } from "../lib/loadKakao";
import ReportSummaryCard from "../component/ReportSummaryCard";
import ReportDetailPanel from "../component/ReportDetailPanel";
import { useRouteStore } from "../store/useRouteStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://safe-route-api-9396636795.asia-northeast3.run.app";

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

const getCoordsFromPath = (path) => {
  if (!path) return null;
  return (
    path.coordinates || path.coords || path.points || null
  );
};

// 경로 객체에서 거리/시간 뽑기
const getDistanceFromPath = (path) => {
  if (!path) return null;
  return (
    path.totalDistance ??
    path.total_distance ??
    path.distance ??
    null
  );
};

const getTimeFromPath = (path) => {
  if (!path) return null;
  return (
    path.totalTime ??
    path.total_time ??
    path.time ??
    path.duration ??
    null
  );
};

const getVariantByIndex = (idx) => {
  if (idx === 1) return "bright";
  if (idx === 2) return "fast";
  return "balanced";
};

export default function ReportScreen() {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const navigate = useNavigate();

  // 출발지/도착지 + 전체 경로 리스트
  const { start, end, paths } = useRouteStore();

  // 상세 패널 상태
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // /analysis/report 응답 상태
  const [reportData, setReportData] = useState(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

  // 배경 카카오맵
  useEffect(() => {
    let ro;
    loadKakao().then((kakao) => {
      if (!mapRef.current) return;

      const center = new kakao.maps.LatLng(37.5446, 127.0565); // fallback
      const map = new kakao.maps.Map(mapRef.current, { center, level: 4 });
      mapObjRef.current = map;

      map.setDraggable(false);
      map.setZoomable(false);

      ro = new ResizeObserver(() => {
        if (mapObjRef.current && mapRef.current) {
          mapObjRef.current.relayout();
        }
      });
      ro.observe(mapRef.current);
    });

    return () => {
      ro?.disconnect();
      mapObjRef.current = null;
    };
  }, []);

  // paths가 아직 없을 때 사용할 임시 프리뷰 경로
  const fallbackPreviewPath = [
    { lat: 37.5439, lng: 127.0553 },
    { lat: 37.5446, lng: 127.0565 },
    { lat: 37.5453, lng: 127.0582 },
  ];

  // 실제 카드에 쓸 경로 리스트 (최대 3개만 사용)
  const cardPaths =
    paths && paths.length > 0 ? paths.slice(0, 3) : [null, null, null];

  // 요약 카드 → 상세 열기 + /analysis/report 요청
  const handleOpenDetail = async (path, index) => {
    setIsDetailOpen(true);
    setIsReportLoading(true);
    setReportError(null);
    setReportData(null);

    try {
      const originLabel = getPlaceLabel(start) || "출발지";
      const destLabel = getPlaceLabel(end) || "도착지";

      const totalDistance = getDistanceFromPath(path) ?? 1941; // m
      const totalTime = getTimeFromPath(path) ?? 1560; // sec

      const coordsFromPath = getCoordsFromPath(path);
      const coordinates =
        coordsFromPath && coordsFromPath.length
          ? coordsFromPath
          : fallbackPreviewPath;

      const routeId = path?.routeId || path?.id || `path-${index + 1}`;

      const payload = {
        routeId,
        origin: originLabel,
        destination: destLabel,
        totalDistance,
        totalTime,
        coordinates,
      };

      console.log("report payload >>>", payload);

      const response = await fetch(`${API_BASE_URL}/api/v1/analysis/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const isJson =
        response.headers
          .get("content-type")
          ?.includes("application/json") ?? false;
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const message =
          data?.detail ||
          data?.message ||
          `리포트 생성에 실패했습니다. (HTTP ${response.status})`;
        setReportError(message);
        setReportData(null);
        return;
      }

      // 성공 (200 OK): data.report 사용
      setReportData(data?.report ?? null);
    } catch (e) {
      console.error(e);
      setReportError("네트워크 오류로 리포트 생성에 실패했습니다.");
      setReportData(null);
    } finally {
      setIsReportLoading(false);
    }
  };

  // 상세 닫기
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  // 길 안내 받기 → /route 이동
  const handleGuideClick = () => {
    setIsDetailOpen(false);
    navigate("/route");
  };

  return (
    <div className="fixed inset-0 mx-auto w-full max-w-[402px] h-screen overflow-hidden">
      {/* 지도: 배경 */}
      <div
        ref={mapRef}
        className="absolute inset-0 -z-10 pointer-events-none"
      />

      {/* 블러 오버레이 */}
      <div className="absolute inset-0 z-10 bg-neutral-white/40 backdrop-blur-[6px] pointer-events-none" />

      {/* 가로 슬라이더 (요약 카드들) */}
      <div className="absolute left-1/2 top-[47%] z-20 w-full -translate-x-1/2 -translate-y-1/2 ">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pl-10 pr-10">
          {cardPaths.map((path, i) => {
            // 경로 좌표
            const rawCoords = getCoordsFromPath(path);
            const previewPath =
              Array.isArray(rawCoords) && rawCoords.length > 0
                ? rawCoords.map((c) => ({
                    lat: c.lat ?? c.y ?? c.latitude,
                    lng: c.lng ?? c.x ?? c.longitude,
                  }))
                : fallbackPreviewPath;

            // 미니맵 중심
            let previewCenter = {
              lat: 37.5446 + i * 0.0003,
              lng: 127.0565 + i * 0.0003,
            };

            if (start && typeof start === "object") {
              const latVal = Number(start.y ?? start.lat);
              const lngVal = Number(start.x ?? start.lng);
              if (!Number.isNaN(latVal) && !Number.isNaN(lngVal)) {
                previewCenter = { lat: latVal, lng: lngVal };
              }
            }

            const variant = getVariantByIndex(i);

            return (
              <div
                key={path?.routeId || path?.id || `card-${i}`}
                className="shrink-0 w-full max-w-[322px] snap-center"
              >
                <ReportSummaryCard
                  variant={variant}
                  previewCenter={previewCenter}
                  previewPath={previewPath}
                  onDetail={() => handleOpenDetail(path, i)}
                  onClose={() => {}}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 상세 리포트 패널 */}
      {isDetailOpen && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/20"
          onClick={handleCloseDetail}
        >
          <div
            className="w-full px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto max-w-[356px] h-[72vh] rounded-[20px] overflow-hidden -translate-y-6">
              <div className="h-full overflow-y-auto no-scrollbar">
                <ReportDetailPanel
                  report={reportData}
                  loading={isReportLoading}
                  error={reportError}
                  onGuideClick={handleGuideClick}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
