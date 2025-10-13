import { useId } from "react";

type TexturaDeEsteiraProps = {
  className?: string;
  tone?: "sand" | "clay";
};

const toneMap: Record<NonNullable<TexturaDeEsteiraProps["tone"]>, string> = {
  sand: "rgba(15, 15, 15, 0.18)",
  clay: "rgba(15, 15, 15, 0.26)",
};

const TexturaDeEsteira = ({ className = "", tone = "sand" }: TexturaDeEsteiraProps) => {
  const patternId = useId();
  const strokeColor = toneMap[tone];

  return (
    <svg
      aria-hidden="true"
      className={`hud-texture ${className}`.trim()}
      focusable="false"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id={`esteira-${patternId}`}
          patternUnits="userSpaceOnUse"
          width="18"
          height="18"
        >
          <path
            d="M0 9L9 0M9 18l9-9M0 0l18 18"
            fill="none"
            stroke={strokeColor}
            strokeLinecap="round"
            strokeWidth="1.2"
          />
          <path
            d="M-3 9l6-6M6 18l6-6M12 6l6-6M15 21l6-6"
            fill="none"
            stroke={strokeColor}
            strokeLinecap="round"
            strokeWidth="0.9"
            opacity="0.55"
          />
        </pattern>
      </defs>
      <rect width="100" height="100" fill={`url(#esteira-${patternId})`} />
    </svg>
  );
};

export default TexturaDeEsteira;
