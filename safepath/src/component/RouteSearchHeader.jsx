import iconBack2 from "../assets/icon/icon_back2.svg";
import iconClose3 from "../assets/icon/icon_close3.svg";

export default function RouteSearchHeader({
  title = "안전 경로 확인하기",
  fromText = "을지로 입구역 2호선",
  toText = "서울특별시청",
  onBack,
  onClose,
}) {
  return (
    <header className="w-full max-w-[402px] h-[132px] pt-5 bg-primary-green text-neutral-white font-pretendard">
      
      {/* 뒤로가기 / 타이틀 / 닫기 */}
      <div className="flex items-center justify-between px-2">
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

      {/* 경로 한 줄 바 (출발 → 도착) */}
      <div className="mt-4 px-4 pt-2">
        <div className="h-[40px] w-full rounded-[6px] bg-[#7BD57A] flex items-center justify-center">
          <span className="text-[15px] font-medium tracking-[0.03em] text-neutral-white">
            {fromText}  →  {toText}
          </span>
        </div>
      </div>
    </header>
  );
}
