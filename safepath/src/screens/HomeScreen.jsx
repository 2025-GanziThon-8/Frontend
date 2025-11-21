import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadKakao } from "../lib/loadKakao";
import InputRoute from "../component/InputRoute";
import { useRouteStore } from "../store/useRouteStore";

export default function HomeScreen() {
  const navigate = useNavigate();

  const mapRef = useRef(null);
  const mapObjRef = useRef(null);

  const { start, end, viaList, addVia } = useRouteStore(); // zustand 상태 관리

  const handleClickStart = () => navigate("/search?type=from");
  const handleClickEnd = () => navigate("/search?type=to");
  const handleClickVia = (idx) => navigate(`/search?type=via&index=${idx}`);

  const goRoute = () => {
    if (!start || !end) {
      alert("출발지와 도착지를 먼저 입력해주세요.");
      return;
    }
    navigate("/report");
  };

  useEffect(() => {
    let ro;

    loadKakao().then((kakao) => {
      if (!mapRef.current) return;

      const center = new kakao.maps.LatLng(37.5665, 126.9780);
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
    </div>
  );
}