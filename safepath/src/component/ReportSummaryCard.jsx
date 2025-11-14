// src/components/ReportSummaryCard.jsx
import { useEffect, useRef } from "react";
import { loadKakao } from "../lib/loadKakao";
import mascot from "../assets/img/mascot.png";
import iconClose2 from "../assets/icon/icon_close2.svg"; // ✅ 클로즈 아이콘

export default function ReportSummaryCard({
  title = "AI INSIGHT",
  points = [
    "밝기와 안전, 효율성이 균형 잡힌 길이에요",
    "너무 돌아가지 않으면서도 안정적이에요",
    "AI가 종합 분석해 가장 추천한 경로예요",
  ],
  previewCenter = { lat: 37.5446, lng: 127.0565 },
  previewPath = [],
  onDetail,
  onClose,
}) {
  const miniMapRef = useRef(null);

  useEffect(() => {
    let map, polyline;

    loadKakao().then((kakao) => {
      if (!miniMapRef.current) return;

      const center = new kakao.maps.LatLng(previewCenter.lat, previewCenter.lng);
      map = new kakao.maps.Map(miniMapRef.current, { center, level: 5 });
      map.setDraggable(false);
      map.setZoomable(false);

      if (previewPath && previewPath.length >= 2) {
        const linePath = previewPath.map(
          (p) => new kakao.maps.LatLng(p.lat, p.lng)
        );
        polyline = new kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 5,
          strokeColor: "#6BC96A",
          strokeOpacity: 0.9,
          strokeStyle: "solid",
        });
        polyline.setMap(map);
      }
    });

    return () => {
      map = null;
      polyline = null;
    };
  }, [previewCenter, previewPath]);

  return (
    <div
      className="
        w-full max-w-[322px] min-h-[454px]
      rounded-[20px] border-2 border-primary-green
      shadow px-5 pt-6 pb-4
    "
    style={{
      background:
        "linear-gradient(131deg, rgba(255, 253, 245, 0) 0%, rgba(107, 201, 106, 0.20) 100%), #FFFDF5",
      backdropFilter: "blur(0.5px)",
    }}
  >
      <div className="flex items-center justify-center relative">
        <h3 className="text-semi-16 text-neutral-black tracking-[0.04em] font-semibold">
          {title}
        </h3>
        <button
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-0 w-7 h-7 rounded-full hover:bg-primary-green/10 flex items-center justify-center"
        >
          <img
            src={iconClose2}
            alt="닫기"
            className="w-4 h-4"
          />
        </button>
      </div>

      {/* ✅ 마스코트 */}
      <div className="flex justify-center mt-4">
        <img
          src={mascot}
          alt="Mascot"
          className="w-[84px] h-[84px] object-contain"
        />
      </div>

      <ul className="mt-3 space-y-1.5 text-regular-12 text-neutral-black">
        {points.map((t, i) => (
          <li key={i} className="leading-[14px]">
            {i + 1}. {t}
          </li>
        ))}
      </ul>

      <div
        ref={miniMapRef}
        className="mt-4 w-full h-[145px] rounded-md border border-primary-green overflow-hidden"
      />

      <button
        onClick={onDetail}
        className="mt-4 w-full h-[44px] rounded-lg bg-primary-green text-neutral-white text-semi-14 hover:brightness-95 active:brightness-90 transition"
      >
        리포트 자세히 보기
      </button>
    </div>
  );
}
