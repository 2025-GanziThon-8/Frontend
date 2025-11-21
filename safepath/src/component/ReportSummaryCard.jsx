import { useEffect, useRef } from "react";
import { loadKakao } from "../lib/loadKakao";
import mascot from "../assets/img/mascot.png";

export default function ReportSummaryCard({
  variant = "balanced",
  title,
  points,

  // 카드별 중심 좌표 (ReportScreen 에서 넘겨줌)
  previewCenter = { lat: 37.5446, lng: 127.0565 },
  // 경로 좌표 배열 
  previewPath = [],
  onDetail,
  onClose,
}) {
  const miniMapRef = useRef(null);

  const presetTitle = "AI INSIGHT";

  const presetPointsByVariant = {
    balanced: [
      "밝기와 안전, 효율성이 균형 잡힌 길이에요",
      "너무 돌아가지 않으면서도 안정적이에요",
      "AI가 종합 분석해 가장 추천한 경로예요",
    ],
    bright: [
      "가로등과 상점이 많은 밝은 길이에요",
      "CCTV 밀집 구간 위주로 안내돼요",
      "어두운 골목은 피해서 안내됩니다",
    ],
    fast: [
      "이동 거리가 짧고 신호 교차가 적어요",
      "가장 빠르게 도착할 수 있는 길이에요",
      "다만 야간엔 조명이 어두울 수 있어요",
    ],
  };

  const finalTitle = title ?? presetTitle;
  const finalPoints = points ?? presetPointsByVariant[variant] ?? [];

  useEffect(() => {
    let map, polyline;

    loadKakao().then((kakao) => {
      if (!miniMapRef.current) return;

      const center = new kakao.maps.LatLng(
        previewCenter.lat,
        previewCenter.lng
      );

      map = new kakao.maps.Map(miniMapRef.current, { center, level: 5 });
      map.setDraggable(false);
      map.setZoomable(false);

      if (Array.isArray(previewPath) && previewPath.length >= 2) {
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
          {finalTitle}
        </h3>
        <button
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-0 w-7 h-7 rounded-full hover:bg-primary-green/10 flex items-center justify-center"
        />
      </div>

      {/* 마스코트 */}
      <div className="flex justify-center mt-4">
        <img
          src={mascot}
          alt="Mascot"
          className="w-[84px] h-[84px] object-contain"
        />
      </div>

      {/* 설명 리스트 */}
      <div className="mt-3 flex justify-center">
        <ul className="space-y-1.5 text-[14px] text-neutral-black text-left">
          {finalPoints.map((t, i) => (
            <li key={i} className="leading-[20px]">
              {i + 1}. {t}
            </li>
          ))}
        </ul>
      </div>

      {/* 미니맵 */}
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
