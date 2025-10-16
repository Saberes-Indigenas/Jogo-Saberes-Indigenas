import type { ComponentPropsWithoutRef } from "react";

import basketSvg from "../../assets/hud/basket.svg?raw";
import featherSvg from "../../assets/hud/feather.svg?raw";
import streakSvg from "../../assets/hud/streak.svg?raw";
import villageSvg from "../../assets/hud/village.svg?raw";

import "./HudIcons.css";

type InlineHudIconProps = ComponentPropsWithoutRef<"span"> & {
  svg: string;
};

const InlineHudIcon = ({ svg, className = "", ...spanProps }: InlineHudIconProps) => (
  <span
    aria-hidden="true"
    role="img"
    className={["hud-icon", className].filter(Boolean).join(" ")}
    dangerouslySetInnerHTML={{ __html: svg }}
    {...spanProps}
  />
);

export const BasketIcon = () => <InlineHudIcon svg={basketSvg} className="hud-icon--basket" />;

export const FeatherIcon = () => <InlineHudIcon svg={featherSvg} className="hud-icon--feather" />;

export const StreakIcon = () => <InlineHudIcon svg={streakSvg} className="hud-icon--streak" />;

export const VillageIcon = () => <InlineHudIcon svg={villageSvg} className="hud-icon--village" />;

export default InlineHudIcon;
