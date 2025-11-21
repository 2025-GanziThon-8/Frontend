import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Onboard1 from "../assets/img/OnboardIMG1.svg";
import Onboard2 from "../assets/img/OnboardIMG2.svg";
import Onboard3 from "../assets/img/OnboardIMG3.svg";

export default function OnboardScreen() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const slides = [Onboard1, Onboard2, Onboard3];
  const messages = [
    `출발지와 도착지를 입력하면\nAI가 가장 안전한 길을 찾아드려요.`,
    `AI가 주변 환경을 분석하여\n더 안전한 길을 추천합니다.`,
    `귀가길 위험 요인을 분석한\nAI 안전 리포트를 제공합니다.`,
  ];

  const handleNext = () => {
    if (page < 2)
      setPage(page + 1);
    else 
      navigate("/home");
  };

  const skip = () => navigate("/home");

  return (
    <div className="min-h-screen w-full bg-[#f1f6ed] flex justify-center">
      <div className="w-[390px] bg-[#FAF7EF] min-h-screen flex flex-col items-center relative">
        <button onClick={skip} className="absolute top-10 right-6 text-[#7DBF6F] text-[16px] font-medium">
          건너뛰기
        </button>
        <div className="mt-20 w-[60%] max-w-[350px] rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${page * 100}%)` }}>
            {slides.map((src, idx) => (
              <img key={idx} src={src} className="w-full flex-shrink-0" />
            ))}
          </div>
        </div>
        <p className="mt-8 text-center whitespace-pre-line text-[18px] font-medium text-[#7DBF6F] px-6 leading-relaxed">
          {messages[page]}
        </p>
        <div className="flex gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${ page === i ? "bg-[#7DBF6F]" : "bg-[#A5D6A7]" }`}></div>
          ))}
        </div>
        <button
          onClick={handleNext}
          className="absolute bottom-10 w-[90%] py-4 bg-[#7DBF6F] text-white text-lg font-semibold rounded-2xl shadow-sm"
        >
          {page === 2 ? "시작하세요" : "계속"}
        </button>
      </div>
    </div>
  );
}