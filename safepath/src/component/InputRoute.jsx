import React from "react";
import Mascot from "../assets/img/mascot.png";

export default function InputRoute({
  start,
  end,
  viaList,
  onClickStart,
  onClickEnd,
  onClickVia,
  onAddVia,
}) {
  return (
    <div
      className="w-[356px] bg-neutral-white rounded-[20px] border-2 border-primary-green/60
        shadow-lg bg-gradient-to-br from-white/0 to-primary-green/20 font-pretendard
        max-h-[70vh] flex flex-col"
    >
      <div className="pt-6 px-6">
        <div className="flex justify-center mb-3">
          <img src={Mascot} alt="mascot" className="w-[90px] h-auto" />
        </div>
        <h2 className="text-center text-[16px] text-neutral-black font-semibold leading-6 mb-4">
          출발지와 도착지를 입력하고<br />안전한 길을 찾아보세요!
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
        <div
          onClick={onClickStart}
          className="cursor-pointer w-full px-4 py-2.5 bg-neutral-white rounded-lg border border-primary-green"
        >
          <span className={`${start ? "text-neutral-black" : "text-neutral-gray300"}`}>
            {start || "출발지를 입력해주세요"}
          </span>
        </div>

        {viaList.map((v, idx) => (
          <div
            key={idx}
            onClick={() => onClickVia(idx)}
            className="cursor-pointer w-full px-4 py-2.5 bg-neutral-white rounded-lg border border-primary-green"
          >
            <span className={`${v ? "text-neutral-black" : "text-neutral-gray300"}`}>
              {v || "경유지를 입력해주세요"}
            </span>
          </div>
        ))}

        <div
          onClick={onClickEnd}
          className="cursor-pointer w-full px-4 py-2.5 bg-neutral-white rounded-lg border border-primary-green"
        >
          <span className={`${end ? "text-neutral-black" : "text-neutral-gray300"}`}>
            {end || "도착지를 입력해주세요"}
          </span>
        </div>
      </div>
      
      <div className="px-6 pb-6">
        <button
          type="button"
          onClick={onAddVia}
          className="flex items-center justify-center gap-2 mx-auto mb-4 
                     text-neutral-gray300 text-[14px] font-medium"
        >
          <span className="w-4 h-4 rounded-full bg-primary-green flex items-center justify-center text-white">
            +
          </span>
          경유지 추가하기
        </button>

        <button className="w-full py-3 bg-primary-green text-neutral-white rounded-lg text-[16px] font-semibold">
          안전한 길찾기
        </button>
      </div>
    </div>
  );
}