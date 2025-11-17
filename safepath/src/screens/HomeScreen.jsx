import { useEffect, useRef, useState } from "react";
import { loadKakao } from "../lib/loadKakao";
import InputRoute from "../component/InputRoute";

export default function HomeScreen() {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);

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
    <div className="fixed inset-0 mx-auto w-full max-w-[402px] h-screen overflow-hidden font-pretendard">
      <div ref={mapRef} className="absolute inset-0 -z-10" />
      <div className="absolute inset-0 backdrop-blur-sm -z-5" />
      <div className="absolute inset-x-0 top-0 h-[90px] bg-primary-green z-10" />
      <div className="absolute inset-x-0 top-[45%] -translate-y-1/2 z-20 flex justify-center">
        <InputRoute />
      </div>
      <div className="absolute bottom-4 w-full flex justify-center z-20">
        <div className="w-28 h-1.5 bg-neutral-gray200/70 rounded-full"></div>
      </div>
    </div>
  );
}