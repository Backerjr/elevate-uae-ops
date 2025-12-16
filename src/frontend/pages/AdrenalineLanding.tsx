import type { ReactNode, MouseEventHandler } from "react";

type ButtonPrimaryProps = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

const ButtonPrimary = ({
  children,
  onClick,
  className = "",
}: ButtonPrimaryProps) => (
  <button
    onClick={onClick}
    className={`bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider py-4 px-8 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 ${className}`}
  >
    {children}
  </button>
);

export default ButtonPrimary;
