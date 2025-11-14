// src/screens/ReportScreen.jsx
import { useEffect, useRef, useState } from "react";
import { loadKakao } from "../lib/loadKakao";
import ReportSummaryCard from "../component/ReportSummaryCard";
import ReportDetailPanel from "../component/ReportDetailPanel";

export default function ReportScreen() {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);

  // 🔹 상세 패널 오픈 여부
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  // 🔹 요약 카드 → 상세 열기
  const handleOpenDetail = () => {
    setIsDetailOpen(true);
  };

  // 🔹 상세 닫기
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  return (
    <div className="fixed inset-0 mx-auto w-full max-w-[402px] h-screen overflow-hidden">
      {/* 지도: 배경 고정 */}
      <div ref={mapRef} className="absolute inset-0 -z-10 pointer-events-none" />

      {/* 블러 오버레이 */}
      <div className="absolute inset-0 z-10 bg-neutral-white/40 backdrop-blur-[6px] pointer-events-none" />

      {/* 가로 슬라이더 */}
      <div className="absolute left-1/2 top-[47%] z-20 w-full -translate-x-1/2 -translate-y-1/2 px-4">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
          {[0, 1, 2].map((i) => (
            <div key={i} className="shrink-0 w-[322px] snap-center">
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
            {/* 🔹 카드 자체 높이를 고정: 화면의 70% */}
            <div className="mx-auto max-w-[356px] h-[72vh] rounded-[20px] overflow-hidden -translate-y-6">
              {/* 🔹 이 안에서만 세로 스크롤 */}
              <div className="h-full overflow-y-auto no-scrollbar">
                <ReportDetailPanel onGuideClick={() => {}} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
