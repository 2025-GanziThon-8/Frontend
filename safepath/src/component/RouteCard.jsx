import iconLocation from "../assets/icon/icon_location.svg";

export default function RouteCard({
  label = "추천경로",
  timeText = "7분",
  distanceText = "432m",
  safetyScore = 94,
  onDetail,
}) {
  return (
    <div
      className="w-[374px] h-[103px] flex-none rounded-[4px] bg-neutral-white flex items-stretch justify-between px-4 py-2"
      style={{ boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.25)" }}
    >
      {/* 왼쪽 정보 영역 */}
      <div className="flex flex-col justify-between h-full">
        <div>
          <p className="text-[12px] font-bold leading-6 text-neutral-black">
            {label}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[26px] leading-[24px] text-primary-green">
              {timeText}
            </span>
            <span className="text-[16px] leading-[24px] text-neutral-black">
              {distanceText}
            </span>
          </div>
        </div>

        <p className="text-[12px] leading-6 text-neutral-gray300">
          안전지수 {safetyScore}점
        </p>
      </div>

      {/* 오른쪽 아이콘 + 경로상세 버튼 */}
      <button
        type="button"
        onClick={onDetail}
        className="flex flex-col items-center justify-center w-[80px]"
      >
        <div className="w-[46px] h-[46px] rounded-full bg-primary-green flex items-center justify-center">
          <img
            src={iconLocation}
            alt="경로 상세 아이콘"
            className="w-46 h-46"
          />
        </div>
        <span className="mt-1 text-[14px] leading-6 text-primary-green">
          경로상세
        </span>
      </button>
    </div>
  );
}