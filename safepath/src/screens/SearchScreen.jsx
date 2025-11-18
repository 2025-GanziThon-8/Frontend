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

  return (
    <div className="min-h-screen w-full bg-[#F1F6EE] flex justify-center">
      <div className="w-[390px] min-h-screen bg-white flex flex-col">

        {/* 검색바 */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-2 mt-2">
            <button onClick={() => navigate(-1)}>
              <svg width="24" height="24">
                <path d="M15 19l-7-7 7-7" stroke="#000" strokeWidth="2" fill="none"/>
              </svg>
            </button>

            <input
              type="text"
              className="flex-1 border rounded-lg px-3 py-2 text-[14px]"
              placeholder={
                type === "from"
                  ? "출발지를 입력해주세요"
                  : type === "to"
                  ? "도착지를 입력해주세요"
                  : "경유지를 입력해주세요"
              }
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              autoFocus
            />

            <button className="text-primary-green font-semibold">검색</button>
          </div>
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