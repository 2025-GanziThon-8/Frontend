// src/screens/RouteScreen.jsx
import { useEffect, useRef, useState } from "react";
import { loadKakao } from "../lib/loadKakao";
import RouteSearchHeader from "../component/RouteSearchHeader";
import RouteCard from "../component/RouteCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function RouteScreen() {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);

  // 🔹 경로 목록 / 상태
  const [paths, setPaths] = useState([]);
  const [pathsLoading, setPathsLoading] = useState(false);
  const [pathsError, setPathsError] = useState(null);
  const [selectedPathId, setSelectedPathId] = useState(null);

  // 🔹 카카오맵 로딩
  useEffect(() => {
    let ro;
    loadKakao().then((kakao) => {
      if (!mapRef.current) return;

      const center = new kakao.maps.LatLng(37.5665, 126.9780); // 시청 근처
      const map = new kakao.maps.Map(mapRef.current, { center, level: 4 });
      mapObjRef.current = map;

      ro = new ResizeObserver(() => mapObjRef.current?.relayout());
      ro.observe(mapRef.current);
    });

    return () => {
      ro?.disconnect();
      mapObjRef.current = null;
    };
  }, []);

  // 🔹 /analysis/paths 호출 (또는 더미 데이터)
  useEffect(() => {
    const fetchPaths = async () => {
      setPathsLoading(true);
      setPathsError(null);
      setPaths([]);

      // ✅ 아직 서버/BASE_URL 없을 때: 더미 데이터로 카드 3개 표시
      if (!API_BASE_URL) {
        const dummyPaths = [
          {
            id: "path-1",
            time: 420, // 7분
            distance: 432,
            cpted: { avg: 94 },
            is_recommended: true,
            polyline: "",
          },
          {
            id: "path-2",
            time: 540, // 9분
            distance: 420,
            cpted: { avg: 98 },
            is_recommended: false,
            polyline: "",
          },
          {
            id: "path-3",
            time: 300, // 5분
            distance: 390,
            cpted: { avg: 80 },
            is_recommended: false,
            polyline: "",
          },
        ];

        setPaths(dummyPaths);
        setSelectedPathId("path-1");
        setPathsLoading(false);
        return; // 🔚 실제 fetch 생략
      }

      // ✅ 나중에 BASE_URL 설정되면 실제 API 호출
      try {
        const res = await fetch(`${API_BASE_URL}/analysis/paths`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            start_lat: 37.5662952,
            start_lng: 126.9779451,
            start_name: "을지로 입구 2호선",
            end_lat: 37.5662952,
            end_lng: 126.9779451,
            end_name: "서울특별시청",
          }),
        });

        const isJson =
          res.headers.get("content-type")?.includes("application/json") ?? false;
        const data = isJson ? await res.json() : null;

        if (!res.ok) {
          const msg =
            data?.detail ||
            data?.message ||
            `경로 조회에 실패했습니다. (HTTP ${res.status})`;
          setPathsError(msg);
          setPaths([]);
          return;
        }

        const list = data?.paths ?? [];
        setPaths(list);

        const recommended =
          list.find((p) => p.is_recommended) ?? list[0] ?? null;
        if (recommended) setSelectedPathId(recommended.id);
      } catch (e) {
        setPathsError("네트워크 오류로 경로 조회에 실패했습니다.");
        setPaths([]);
      } finally {
        setPathsLoading(false);
      }
    };

    fetchPaths();
  }, []);

  // 🔹 카드용 데이터로 변환
  const cardData = paths.map((p, index) => {
    const minutes = Math.round((p.time ?? 0) / 60);
    const distance = p.distance ?? 0;
    const safety = p.cpted?.avg ?? 0;

    let label = "일반/빠른경로";
    if (p.is_recommended) label = "추천경로";
    else if (index === 1) label = "안전우선경로";

    return {
      id: p.id,
      label,
      timeText: `${minutes}분`,
      distanceText: `${distance}m`,
      safetyScore: safety,
    };
  });

  const handleCardDetail = (pathId) => {
    setSelectedPathId(pathId);
    // TODO: 선택된 경로로 폴리라인 그리기 등 추가 로직
  };

  return (
    <div className="fixed inset-0 mx-auto w-full max-w-[402px] h-screen overflow-hidden">
      {/* 지도: 배경 전체 */}
      <div ref={mapRef} className="absolute inset-0 -z-10" />

      {/* 상단 헤더 */}
      <div className="absolute inset-x-0 top-0 z-20">
        <RouteSearchHeader
          fromText="을지로 입구 2호선"
          toText="서울특별시청"
          onBack={() => window.history.back()}
          onClose={() => window.history.back()}
          onSwap={() => {}}
        />
      </div>

      {/* 하단 가로 슬라이더 */}
      <div className="absolute left-1/2 top-[81%] z-30 w-full -translate-x-1/2 -translate-y-1/2">
        {pathsLoading && (
          <div className="text-center text-[14px] text-neutral-black">
            경로를 불러오는 중입니다...
          </div>
        )}

        {pathsError && (
          <div className="px-4 text-center text-[14px] text-primary-red">
            {pathsError}
          </div>
        )}

        {!pathsLoading && !pathsError && cardData.length > 0 && (
          <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory no-scrollbar px-2">
            {cardData.map((card) => (
              <div key={card.id} className="snap-center flex-none">
                <RouteCard
                  label={card.label}
                  timeText={card.timeText}
                  distanceText={card.distanceText}
                  safetyScore={card.safetyScore}
                  onDetail={() => handleCardDetail(card.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
