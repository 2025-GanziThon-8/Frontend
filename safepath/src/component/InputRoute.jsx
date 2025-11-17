import React, { useState } from "react";
import Mascot from "../assets/img/mascot.png";

export default function InputRoute() {
  const [waypoints, setWaypoints] = useState([]);

  const handleAddWaypoint = () => {
    setWaypoints([...waypoints, ""]);
  };

  const handleChangeWaypoint = (idx, value) => {
    const updated = [...waypoints];
    updated[idx] = value;
    setWaypoints(updated);
  };

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
        <h2 className="text-center text-[16px] text-neutral-black font-semibold leading-6 mb-4 tracking-wide">
          출발지와 도착지를 입력하고<br />안전한 길을 찾아보세요!
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
        <input
          type="text"
          placeholder="1. 출발지를 입력해주세요"
          className="w-full px-4 py-2.5 bg-neutral-white rounded-lg border border-primary-green
                     placeholder-neutral-gray300 text-neutral-black text-[14px]"
        />
        {waypoints.map((point, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`${idx + 2}. 경유지를 입력해주세요`}
            value={point}
            onChange={(e) => handleChangeWaypoint(idx, e.target.value)}
            className="w-full px-4 py-2.5 bg-neutral-white rounded-lg border border-primary-green
                       placeholder-neutral-gray300 text-neutral-black text-[14px]"
          />
        ))}
        <input
          type="text"
          placeholder={`${waypoints.length + 2}. 도착지를 입력해주세요`}
          className="w-full px-4 py-2.5 bg-neutral-white rounded-lg border border-primary-green
                     placeholder-neutral-gray300 text-neutral-black text-[14px]"
        />
      </div>
      <div className="px-6 pb-6">
        <button
          type="button"
          onClick={handleAddWaypoint}
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