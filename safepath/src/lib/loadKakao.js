let kakaoPromise;

export function loadKakao() {
  if (window.kakao && window.kakao.maps) {
    console.log('[loadKakao] already loaded');
    return Promise.resolve(window.kakao);
  }
  if (!kakaoPromise) {
    kakaoPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
      script.async = true;
      script.onload = () => {
        console.log('[loadKakao] script onload');
        window.kakao.maps.load(() => {
            console.log('[loadKakao] kakao.maps.load done'); 
            resolve(window.kakao)
        });
      };
      script.onerror = (e) => {
        console.error('[loadKakao] script onerror', e); 
        reject(new Error('Kakao Maps script failed to load'));
      };
      document.head.appendChild(script);
    });
  }
  return kakaoPromise;
}
