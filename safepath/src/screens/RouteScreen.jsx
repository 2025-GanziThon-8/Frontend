import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadKakao } from "../lib/loadKakao";
import RouteSearchHeader from "../component/RouteSearchHeader";
import RouteCard from "../component/RouteCard";
import { useRouteStore } from "../store/useRouteStore";

// 출발/도착 핀 아이콘
import departIcon from "../assets/icon/icon_depart.svg";
import arrivedIcon from "../assets/icon/icon_arrived.svg";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://safe-route-api-9396636795.asia-northeast3.run.app/api/v1";

function decodePolyline(encoded, precision = 5) {
  if (!encoded || typeof encoded !== "string") return [];

  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;
  const coordinates = [];
  const factor = Math.pow(10, precision);

  while (index < len) {
    let result = 0;
    let shift = 0;
    let b;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
    lat += dlat;

    result = 0;
    shift = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push({
      lat: lat / factor,
      lng: lng / factor,
    });
  }

  return coordinates;
}

export default function RouteScreen() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const polylineRef = useRef(null);      
  const startMarkerRef = useRef(null);  
  const endMarkerRef = useRef(null);   

  // 전역 상태 (Home/Search에서 저장한 값)
  const {
    start,
    end,
    viaList,
    setPaths: setGlobalPaths,
    setSelectedPath,
  } = useRouteStore();

  // 경로 목록 / 상태
  const [paths, setPaths] = useState([]);
  const [pathsLoading, setPathsLoading] = useState(false);
  const [pathsError, setPathsError] = useState(null);
  const [selectedPathId, setSelectedPathId] = useState(null);

  // 카카오맵 로딩
  useEffect(() => {
    let ro;
    loadKakao().then((kakao) => {
      if (!mapRef.current) return;

      const center = new kakao.maps.LatLng(37.5665, 126.9780); // 기본: 시청 근처
      const map = new kakao.maps.Map(mapRef.current, { center, level: 4 });
      mapObjRef.current = map;

      ro = new ResizeObserver(() => {
        if (mapObjRef.current && mapRef.current) {
          mapObjRef.current.relayout();
        }
      });
      ro.observe(mapRef.current);
    });

    return () => {
      ro?.disconnect();

      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      if (startMarkerRef.current) {
        startMarkerRef.current.setMap(null);
        startMarkerRef.current = null;
      }
      if (endMarkerRef.current) {
        endMarkerRef.current.setMap(null);
        endMarkerRef.current = null;
      }

      mapObjRef.current = null;
    };
  }, []);

  useEffect(() => {
    const fetchPaths = async () => {
      setPathsLoading(true);
      setPathsError(null);
      setPaths([]);

      // 출발지/도착지 없으면 에러 메시지만 표시
      if (!start || !end) {
        setPathsError("출발지와 도착지를 먼저 선택해주세요.");
        setPathsLoading(false);
        return;
      }

      // Search 화면에서 저장한 좌표/이름 사용
      const startLat = start.lat ?? start.y;
      const startLng = start.lng ?? start.x;
      const endLat = end.lat ?? end.y;
      const endLng = end.lng ?? end.x;

      // 경유지는 1개만 지원, 없으면 null
      const via = viaList[0] || null;
      const waypointLat = via ? via.lat ?? via.y : null;
      const waypointLng = via ? via.lng ?? via.x : null;

      const payload = {
        start_lat: startLat,
        start_lng: startLng,
        end_lat: endLat,
        end_lng: endLng,
        waypoint_lat: waypointLat,
        waypoint_lng: waypointLng,
        start_name:
          start.name ?? start.place_name ?? start.address_name ?? "출발지",
        end_name: end.name ?? end.place_name ?? end.address_name ?? "도착지",
      };

      console.log("paths payload >>>", payload);

      try {
        // BASE_URL에 이미 /api/v1 포함되어 있으니 여기서는 /analysis/paths만 붙임
        const res = await fetch(`${API_BASE_URL}/analysis/paths`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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
          setGlobalPaths([]);
          return;
        }

        const list = data?.paths ?? [];
        setPaths(list);
        setGlobalPaths(list);

        const recommended =
          list.find((p) => p.is_recommended) ?? list[0] ?? null;

        if (recommended) {
          setSelectedPathId(recommended.id);
          setSelectedPath(recommended); 
        }
      } catch (e) {
        console.error(e);
        setPathsError("네트워크 오류로 경로 조회에 실패했습니다.");
        setPaths([]);
        setGlobalPaths([]);
      } finally {
        setPathsLoading(false);
      }
    };

    fetchPaths();
  }, [start, end, viaList, setGlobalPaths, setSelectedPath]);

  //선택된 경로를 지도에 폴리라인 + 출발/도착 핀으로 표시
  useEffect(() => {
    const kakao = window.kakao;
    if (!kakao || !kakao.maps) return;
    if (!mapObjRef.current) return;
    if (!paths.length) return;

    const selected =
      paths.find((p) => p.id === selectedPathId) ?? paths[0];

    if (!selected || !selected.polyline) return;

    // 응답 polyline → 좌표 배열로 변환
    let coords = [];
    if (Array.isArray(selected.polyline)) {

      coords = selected.polyline.map(
        (p) => new kakao.maps.LatLng(p.lat, p.lng)
      );
    } else if (typeof selected.polyline === "string") {
        
      const decoded = decodePolyline(selected.polyline);
      coords = decoded.map((p) => new kakao.maps.LatLng(p.lat, p.lng));
    }

    if (coords.length < 2) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    if (startMarkerRef.current) {
      startMarkerRef.current.setMap(null);
      startMarkerRef.current = null;
    }
    if (endMarkerRef.current) {
      endMarkerRef.current.setMap(null);
      endMarkerRef.current = null;
    }

    const polyline = new kakao.maps.Polyline({
      path: coords,
      strokeWeight: 6,
      strokeColor: "#6BC96A",
      strokeOpacity: 0.9,
      strokeStyle: "solid",
    });
    polyline.setMap(mapObjRef.current);
    polylineRef.current = polyline;

    // 출발/도착 마커 찍기
    const startPos = coords[0];
    const endPos = coords[coords.length - 1];

    const startImage = new kakao.maps.MarkerImage(
      departIcon,
      new kakao.maps.Size(32, 32),
      { offset: new kakao.maps.Point(16, 32) }
    );
    const endImage = new kakao.maps.MarkerImage(
      arrivedIcon,
      new kakao.maps.Size(32, 32),
      { offset: new kakao.maps.Point(16, 32) }
    );

    const startMarker = new kakao.maps.Marker({
      position: startPos,
      image: startImage,
    });
    const endMarker = new kakao.maps.Marker({
      position: endPos,
      image: endImage,
    });

    startMarker.setMap(mapObjRef.current);
    endMarker.setMap(mapObjRef.current);

    startMarkerRef.current = startMarker;
    endMarkerRef.current = endMarker;

    //지도를 선에 맞게 줌/이동
    const bounds = new kakao.maps.LatLngBounds();
    coords.forEach((p) => bounds.extend(p));
    mapObjRef.current.setBounds(bounds);
  }, [paths, selectedPathId]);

  const cardData = paths.map((p, index) => {
    const minutes = Math.round((p.time ?? 0) / 60);
    const distance = p.distance ?? 0;
    const safetyGrade = p.summary_grade ?? "";

    let label = "일반/빠른경로";
    if (p.is_recommended) label = "추천경로";
    else if (index === 1) label = "안전우선경로";

    return {
      id: p.id,
      label,
      timeText: `${minutes}분`,
      distanceText: `${distance}m`,
      safetyScore: safetyGrade, 
      aiPreview: p.ai_preview ?? [],
    };
  });

  // 카드 클릭 → 선택 경로 전역 저장 + 지도 경로 변경
  const handleCardDetail = (pathId) => {
    setSelectedPathId(pathId);
    const found = paths.find((p) => p.id === pathId);
    if (found) {
      setSelectedPath(found);
    }
  };

  return (
    <div className="fixed inset-0 mx-auto w-full max-w-[402px] h-screen overflow-hidden">
      {/* 지도 배경 전체 */}
      <div ref={mapRef} className="absolute inset-0 -z-10" />

      {/* 상단 헤더 */}
      <div className="absolute inset-x-0 top-0 z-20">
        <RouteSearchHeader
          fromText={start?.name ?? start?.place_name ?? "출발지"}
          toText={end?.name ?? end?.place_name ?? "도착지"}
          onBack={() => window.history.back()}
          onClose={() => navigate("/home")}
          onSwap={() => {}}
        />
      </div>

      {/* 하단 가로 슬라이더 */}
      <div className="absolute left-1/2 top-[90%] z-30 w-full -translate-x-1/2 -translate-y-1/2">
        {pathsLoading && (
          <div className="text-center text-[14px] text-neutral-black">
            경로를 불러오는 중입니다...
          </div>
        )}

        {pathsError && (
          <div className="px-4 text-center text-[14px] text-primary-red whitespace-pre-line">
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