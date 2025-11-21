import addIcon from '../assets/icon/icon_add.svg';

export default function AddRoute({
  children = '경유지 추가하기',
  onClick,
  disabled = false,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2
                  font-pretendard text-neutral-gray300 text-medium-14 leading-6
                  transition hover:text-neutral-black/80
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green/30
                  ${className}`}
      aria-label={typeof children === 'string' ? children : '경유지 추가하기'}
    >
      <img
        src={addIcon}
        alt=""
        aria-hidden="true"
        className="w-[14px] h-[14px] select-none"
        draggable="false"
      />
      <span>{children}</span>
    </button>
  );
}
