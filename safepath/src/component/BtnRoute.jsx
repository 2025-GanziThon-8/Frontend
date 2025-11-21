//src/component/BtnRoute.jsx
import iconTarget from '../assets/icon/icon_target.svg';

export default function BtnRoute({
  children = '내 위치 불러오기',
  onClick,
  disabled = false,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`font-pretendard text-primary-green bg-neutral-white
                  w-[356px] h-[44px] rounded-lg border border-primary-green
                  flex items-center justify-center gap-2
                  text-medium-16
                  transition hover:bg-primary-green/5 active:scale-[0.99]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green/30
                  ${className}`}
    >
      <img
        src={iconTarget}
        alt=""                
        aria-hidden="true"
        className="w-5 h-5 select-none"
        draggable="false"
      />
      <span>{children}</span>
    </button>
  );
}
