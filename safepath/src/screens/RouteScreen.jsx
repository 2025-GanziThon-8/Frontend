import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadKakao } from "../lib/loadKakao";
import RouteSearchHeader from "../component/RouteSearchHeader";
import RouteCard from "../component/RouteCard";
import { useRouteStore } from "../store/useRouteStore";
import departIcon from "../assets/icon/icon_depart.svg";
import arrivedIcon from "../assets/icon/icon_arrived.svg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Decode polyline
function decodePolyline(encoded, precision = 5) {
  if (!encoded || typeof encoded !== "string") return [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates = [];
  const factor = Math.pow(10, precision);

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let b;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : result >> 1;

    result = 0;
    shift = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : result >> 1;

    coordinates.push({ lat: lat / factor, lng: lng / factor });
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

  const { start, end, viaList, setPaths: setGlobalPaths, setSelectedPath } =
    useRouteStore();

  const [paths, setPaths] = useState([]);
  const [selectedPathId, setSelectedPathId] = useState(null);

  // Kakao map init
  useEffect(() => {
    loadKakao().then((kakao) => {
      if (!mapRef.current) return;
      const map = new kakao.maps.Map(mapRef.current, {
        center: new kakao.maps.LatLng(37.5665, 126.978),
        level: 4,
      });
      mapObjRef.current = map;
    });

    return () => {
      polylineRef.current?.setMap(null);
      startMarkerRef.current?.setMap(null);
      endMarkerRef.current?.setMap(null);
    };
  }, []);

  // Fetch paths
  useEffect(() => {
    async function loadPaths() {
      if (!start || !end) return;

      const payload = {
        start_lat: start.lat ?? start.y,
        start_lng: start.lng ?? start.x,
        end_lat: end.lat ?? end.y,
        end_lng: end.lng ?? end.x,
        waypoint_lat: viaList[0]?.lat ?? null,
        waypoint_lng: viaList[0]?.lng ?? null,
        start_name:
          start.name ?? start.place_name ?? start.address_name ?? "출발지",
        end_name: end.name ?? end.place_name ?? end.address_name ?? "도착지",
      };

      const res = await fetch(`${API_BASE_URL}/api/v1/analysis/paths`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const list = data.paths ?? [];

      setPaths(list);
      setGlobalPaths(list);

      const recommended =
        list.find((p) => p.is_recommended) ?? list[0] ?? null;

      if (recommended) {
        setSelectedPathId(recommended.id);
        setSelectedPath(recommended);
      }
    }

    loadPaths();
  }, [start, end, viaList, setSelectedPath, setGlobalPaths]);

  // Draw Polyline, markers
  useEffect(() => {
    const kakao = window.kakao;
    if (!kakao || !mapObjRef.current) return;
    if (!paths.length) return;

    const selected =
      paths.find((p) => p.id === selectedPathId) ?? paths[0];
    if (!selected) return;

    let coords = [];

    // 배열 polyline
    if (Array.isArray(selected.polyline)) {
      coords = selected.polyline.map(
        (p) => new kakao.maps.LatLng(p.lat, p.lng)
      );
    }

    // string polyline
    else if (typeof selected.polyline === "string") {
      const decoded = decodePolyline(selected.polyline);
      coords = decoded.map((p) => new kakao.maps.LatLng(p.lat, p.lng));
    }

    if (coords.length < 2) return;

    // 초기화
    polylineRef.current?.setMap(null);
    startMarkerRef.current?.setMap(null);
    endMarkerRef.current?.setMap(null);

    // polyline
    const polyline = new kakao.maps.Polyline({
      path: coords,
      strokeWeight: 6,
      strokeColor: "#6BC96A",
      strokeOpacity: 0.9,
    });
    polyline.setMap(mapObjRef.current);
    polylineRef.current = polyline;

    // markers
    const startMarker = new kakao.maps.Marker({
      position: coords[0],
      image: new kakao.maps.MarkerImage(
        departIcon,
        new kakao.maps.Size(32, 32),
        { offset: new kakao.maps.Point(16, 32) }
      ),
    });

    const endMarker = new kakao.maps.Marker({
      position: coords[coords.length - 1],
      image: new kakao.maps.MarkerImage(
        arrivedIcon,
        new kakao.maps.Size(32, 32),
        { offset: new kakao.maps.Point(16, 32) }
      ),
    });

    startMarker.setMap(mapObjRef.current);
    endMarker.setMap(mapObjRef.current);

    startMarkerRef.current = startMarker;
    endMarkerRef.current = endMarker;

    // bounds, padding
    const bounds = new kakao.maps.LatLngBounds();
    coords.forEach((p) => bounds.extend(p));
    mapObjRef.current.setBounds(bounds, 80);
  }, [paths, selectedPathId]);

  // Cards
  const cardData = paths.map((p, i) => ({
    id: p.id,
    label: p.is_recommended
      ? "추천 경로"
      : i === 1
      ? "안전 우선 경로"
      : "일반 경로",
    timeText: `${Math.round((p.time ?? 0) / 60)}분`,
    distanceText: `${p.distance ?? 0}m`,
    safetyScore: p.summary_grade ?? "",
  }));

  return (
    <div className="fixed inset-0 mx-auto w-full max-w-[402px] h-screen overflow-hidden">
      <div ref={mapRef} className="absolute inset-0 -z-10" />

      <div className="absolute inset-x-0 top-0 z-20">
        <RouteSearchHeader
          fromText={start?.name ?? "출발지"}
          toText={end?.name ?? "도착지"}
          onBack={() => window.history.back()}
          onClose={() => navigate("/home")}
        />
      </div>

      <div className="absolute left-1/2 top-[90%] z-30 w-full -translate-x-1/2 -translate-y-1/2">
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory no-scrollbar px-2">
          {cardData.map((card) => (
            <RouteCard
              key={card.id}
              label={card.label}
              timeText={card.timeText}
              distanceText={card.distanceText}
              safetyScore={card.safetyScore}
              onDetail={() => setSelectedPathId(card.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}