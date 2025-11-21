export default function BtnLong({
  children = '계속',
  onClick,
  disabled = false,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`font-pretendard bg-primary-green text-neutral-white
                  w-[370px] h-[53px] rounded-2xl px-6
                  text-medium-16 tracking-[0.04em]
                  shadow-sm transition
                  hover:bg-primary-mint/90 active:scale-[0.99]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green/40
                  ${className}`}
    >
      {children}
    </button>
  );
}
