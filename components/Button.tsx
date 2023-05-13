import type { MouseEventHandler } from "react";

type ButtonProps = {
  disabled: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
};

export default function Button({ disabled, onClick, text }: ButtonProps) {
  return (
    <button
      className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:pointer-events-none"
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
