import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadKakao } from "../lib/loadKakao";
import InputRoute from "../component/InputRoute";
import { useRouteStore } from "../store/useRouteStore";
import Loading from "../component/Loading";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function HomeScreen() {
  const navigate = useNavigate();

  const mapRef = useRef(null);
  const mapObjRef = useRef(null);

  const { start, end, viaList, addVia, setPaths, setSelectedPath } =
    useRouteStore();

  const [isLoading, setIsLoading] = useState(false); //로딩 상태

  const handleClickStart = () => navigate("/search?type=from");
  const handleClickEnd = () => navigate("/search?type=to");
  const handleClickVia = (idx) => navigate(`/search?type=via&index=${idx}`);

  const goRoute = async () => {
    if (isLoading) return; //중복 클릭 방지

    if (!start || !end) {
      alert("출발지와 도착지를 먼저 입력해주세요.");
      return;
    }

    const payload = {
      start_lat: start.lat,
      start_lng: start.lng,
      end_lat: end.lat,
      end_lng: end.lng,
      waypoint_lat: viaList[0]?.lat ?? null,
      waypoint_lng: viaList[0]?.lng ?? null,
      start_name: start.name,
      end_name: end.name,
    };

    try {
      setIsLoading(true); //로딩 시작

      const res = await fetch(`${API_BASE_URL}/api/v1/analysis/paths`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "경로 조회 실패");
        return;
      }

      setPaths(data.paths);

      const recommended =
        data.paths.find((p) => p.is_recommended) ?? data.paths[0];

      setSelectedPath(recommended);

      // ReportScreen으로 이동
      navigate("/report");
    } catch (error) {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); //로딩 종료 (Report로 넘어가면 곧 언마운트됨)
    }
  };

  // 카카오 지도 초기화
  useEffect(() => {
    let ro;

    loadKakao().then((kakao) => {
      if (!mapRef.current) return;

      const center = new kakao.maps.LatLng(37.5665, 126.978);
      const map = new kakao.maps.Map(mapRef.current, { center, level: 3 });
      mapObjRef.current = map;

      ro = new ResizeObserver(() => mapObjRef.current?.relayout());
      ro.observe(mapRef.current);
    });

    return () => {
      ro?.disconnect();
      mapObjRef.current = null;
    };
  }, []);

  return (
    <div className="fixed inset-0 mx-auto w-full max-w-[402px] h-screen overflow-hidden">
      {/* 배경 지도 */}
      <div ref={mapRef} className="absolute inset-0 -z-10" />
      <div className="absolute inset-0 backdrop-blur-[2px] -z-5" />

      {/* 입력창 */}
      <div className="absolute inset-x-0 top-[48%] -translate-y-1/2 z-20 flex justify-center px-4">
        <InputRoute
          start={start}
          end={end}
          viaList={viaList}
          onClickStart={handleClickStart}
          onClickEnd={handleClickEnd}
          onClickVia={handleClickVia}
          onAddVia={addVia}
          onRoute={goRoute}
        />
      </div>

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/20">
          <Loading size={72} thickness={8} />
        </div>
      )}
    </div>
  );
}
