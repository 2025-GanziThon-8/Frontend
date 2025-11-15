// src/components/RouteSearchHeader.jsx
import { useState } from "react";
import iconBack2 from "../assets/icon/icon_back2.svg";
import iconClose3 from "../assets/icon/icon_close3.svg";
import iconReverse from "../assets/icon/icon_reverse.svg";

export default function RouteSearchHeader({
  title = "안전 경로 확인하기",
  fromText = "을지로 입구 2호선",
  toText = "서울특별시청",
  onBack,
  onClose,
  onSwap,
}) {
  // 🔹 내부에서 표시용 주소 상태 관리
  const [fromValue, setFromValue] = useState(fromText);
  const [toValue, setToValue] = useState(toText);

  const handleSwap = () => {
    setFromValue(toValue);
    setToValue(fromValue);
    // 바깥에서도 필요하면 사용 가능
    if (onSwap) {
      onSwap({ from: toValue, to: fromValue });
    }
  };

  return (
    <header className="w-full max-w-[402px] h-[158px] bg-primary-green text-neutral-white font-pretendard relative">
      {/* 상단 바: 뒤로가기 / 타이틀 / 닫기 */}
      <div className="flex items-center justify-between px-4 pt-3">
        {/* 뒤로가기 버튼 */}
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="w-8 h-8 flex items-center justify-center"
        >
          <img src={iconBack2} alt="뒤로가기" className="w-[11px] h-[22px]" />
        </button>

        {/* 타이틀 */}
        <h1 className="text-[18px] font-semibold tracking-[0.04em] text-center">
          {title}
        </h1>

        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="w-8 h-8 flex items-center justify-center"
        >
          <img src={iconClose3} alt="닫기" className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* 출발 / 도착 입력 영역 */}
      <div className="mt-4 px-4">
        <div className="relative">
          {/* 위 박스 (출발지) */}
          <div className="h-10 w-full bg-white/20 rounded-t-[4px] px-3 flex items-center mb-0.5">
            <span className="text-[16px] font-medium leading-6 text-neutral-white">
              {fromValue}
            </span>
          </div>

          {/* 아래 박스 (도착지) */}
          <div className="h-10 w-full bg-white/20 rounded-b-[4px] px-3 flex items-center">
            <span className="text-[16px] font-medium leading-6 text-neutral-white">
              {toValue}
            </span>
          </div>

          {/* 출발/도착 스왑 버튼 */}
          <button
            type="button"
            onClick={handleSwap}
            aria-label="출발지와 도착지 바꾸기"
            className="absolute right-[20px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] rounded-full bg-primary-green flex items-center justify-center shadow-sm"
          >
            <img
              src={iconReverse}
              alt="출발지와 도착지 바꾸기"
              className="w-[36px] h-[36px]"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
