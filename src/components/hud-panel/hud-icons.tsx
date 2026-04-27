import type { ComponentPropsWithoutRef } from "react";

import basketSvg from "../../assets/hud/basket.svg?raw";
import featherSvg from "../../assets/hud/feather.svg?raw";
import streakSvg from "../../assets/hud/streak.svg?raw";
import villageSvg from "../../assets/hud/village.svg?raw";

import "../../css/HudIcons.css";

type InlineHudIconProps = ComponentPropsWithoutRef<"span"> & {
  svg: string;
};

export function InlineHudIcon({
  svg,
  className = "",
  ...spanProps
}: InlineHudIconProps) {
  return (
    <span
      aria-hidden="true"
      role="img"
      className={["hud-icon", className].filter(Boolean).join(" ")}
      dangerouslySetInnerHTML={{ __html: svg }}
      {...spanProps}
    />
  );
}

export function BasketIcon() {
  return <InlineHudIcon svg={basketSvg} className="hud-icon--basket" />;
}

export function FeatherIcon() {
  return <InlineHudIcon svg={featherSvg} className="hud-icon--feather" />;
}

export function StreakIcon() {
  return <InlineHudIcon svg={streakSvg} className="hud-icon--streak" />;
}

export function VillageIcon() {
  return <InlineHudIcon svg={villageSvg} className="hud-icon--village" />;
}
