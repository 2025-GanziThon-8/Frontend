import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mascot from "../assets/img/mascot.png";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-[#f1f6ed] flex justify-center">
      <div className="w-[390px] bg-[#FAF7EF] min-h-screen flex flex-col items-center justify-center relative">
        <div className="flex flex-col items-center -mt-10">
          <p className="text-[20px] text-[#7DBF6F] font-semibold mb-4">
            당신의 하루를 지켜주는
          </p>
          <img src={Mascot} alt="mascot" className="w-[180px] h-auto mb-6" />
          <h1 className="text-[36px] font-extrabold text-[#7DBF6F] tracking-wide">
            SAFEPATH
          </h1>
        </div>
        <p className="absolute bottom-10 text-[12px] text-[#7DBF6F]">
          Copyright © Ministry of the Interior and Safety. All Rights reserved.
        </p>
      </div>
    </div>
  );
}