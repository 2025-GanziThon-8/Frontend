import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { loadKakao } from "../lib/loadKakao";
import { useRouteStore } from "../store/useRouteStore";

export default function SearchScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const type = params.get("type") || "from";
  const index = params.get("index") ? Number(params.get("index")) : null;

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const { setStart, setEnd, setVia } = useRouteStore();

  const searchAddress = async (query) => {
    const kakao = await loadKakao();
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(query, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        setResults(data);
      } else {
        setResults([]);
      }
    });
  };

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    const t = setTimeout(() => searchAddress(keyword), 200);
    return () => clearTimeout(t);
  }, [keyword]);

  const handleSelect = (place) => {
    const label = place.place_name;

    if (type === "from") setStart(label);
    else if (type === "to") setEnd(label);
    else if (type === "via") setVia(index, label);

    navigate(-1);
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert("이 기기에서 위치 정보를 사용할 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        const kakao = await loadKakao();
        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.coord2Address(longitude, latitude, (result, status) => {
          if (status !== kakao.maps.services.Status.OK) {
            alert("현재 위치를 주소로 변환할 수 없습니다.");
            return;
          }

          const address =
            result[0].road_address?.address_name ||
            result[0].address?.address_name;

          if (!address) {
            alert("주소를 찾을 수 없습니다.");
            return;
          }

          if (type === "from") setStart(address); // Zustand 저장
          else if (type === "to") setEnd(address);
          else if (type === "via") setVia(index, address);

          navigate(-1);
        });
      },
      () => {
        alert("위치 권한이 필요합니다.");
      }
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#F1F6EE] flex justify-center">
      <div className="w-[390px] min-h-screen bg-white flex flex-col">

      {/* 검색바 */}
      <div className="px-4 pt-6 pb-3 bg-white">

        <div className="flex items-center gap-3">

          {/* 뒤로가기 */}
          <button onClick={() => navigate(-1)} className="p-1">
            <svg width="22" height="22" stroke="#333" fill="none" strokeWidth="2">
              <path d="M14 18L7 11l7-7" />
            </svg>
          </button>

          {/* 검색 입력창 */}
          <input
            type="text"
            className="flex-1 h-11 bg-neutral-100 rounded-lg px-4 text-[15px] outline-none placeholder-neutral-500"
            placeholder={
              type === "from" ? "출발지를 입력해주세요"
                : type === "to" ? "도착지를 입력해주세요" : "경유지를 입력해주세요"
            }
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            autoFocus
          />

          {/* 검색 버튼 */}
          <button className="text-green-500 font-medium text-base pr-1">
            검색
          </button>
        </div>

        {/* 구분선 */}
        <div className="w-full h-px bg-neutral-900/10 mt-4" />
      </div>

      {/* 내 위치 불러오기 */}
      <div className="px-4 mt-4 mb-2">
        <button
          onClick={handleMyLocation}
          className="
            w-full h-12 rounded-lg border border-green-400 
            flex items-center justify-center gap-3 
            bg-white
          "
        >
          {/* GPS 아이콘 */}
          <svg width="20" height="20" stroke="#45A754" fill="none" strokeWidth="2">
            <circle cx="10" cy="10" r="3" />
            <path d="M10 2v2M10 16v2M2 10h2M16 10h2" />
            <circle cx="10" cy="10" r="8" />
          </svg>

          <span className="text-green-600 text-[15px] font-medium">
            내 위치 불러오기
          </span>
        </button>
      </div>

        {/* 검색결과 */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 border-b cursor-pointer active:bg-neutral-gray50"
            >
              <p className="font-semibold text-[15px]">{item.place_name}</p>
              <p className="text-[13px] text-neutral-gray300">
                {item.road_address_name || item.address_name}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}