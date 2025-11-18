// src/lib/loadKakao.js
let kakaoPromise;

export function loadKakao() {
  if (window.kakao && window.kakao.maps) {
    console.log('[loadKakao] already loaded'); // ✅ LOG
    return Promise.resolve(window.kakao);
  }
  if (!kakaoPromise) {
    kakaoPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      // autoload=false 로 붙이고, 로드 후 kakao.maps.load(...) 호출
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
      script.async = true;
      script.onload = () => {
        console.log('[loadKakao] script onload'); // ✅ LOG
        window.kakao.maps.load(() => {
            console.log('[loadKakao] kakao.maps.load done'); // ✅ LOG
            resolve(window.kakao)
        });
      };
      script.onerror = (e) => {
        console.error('[loadKakao] script onerror', e); // ❌ LOG
        reject(new Error('Kakao Maps script failed to load'));
      };
      document.head.appendChild(script);
    });
  }
  return kakaoPromise;
}
