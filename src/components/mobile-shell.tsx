import { useEffect, useState } from "react";
import { EMBED_PARAM, getVirtualScreen } from "../utils/mobileViewport";
import { MobileFullscreenGate } from "./mobile-fullscreen-gate";
import "../css/MobileShell.css";

const readScreen = () => getVirtualScreen(window.innerWidth, window.innerHeight);

/**
 * Moldura do celular: o jogo roda num iframe com tamanho de tela de PC,
 * reduzido para caber na tela deitada (ver utils/mobileViewport.ts).
 */
export function MobileShell() {
  const [virtualScreen, setVirtualScreen] = useState(readScreen);

  useEffect(() => {
    const update = () => setVirtualScreen(readScreen());
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  const gameUrl = `${window.location.pathname}?${EMBED_PARAM}=1`;

  return (
    <div className="mobile-shell">
      <iframe
        className="mobile-shell__game"
        src={gameUrl}
        title="Jogo Saberes Indígenas"
        allow="autoplay; fullscreen"
        style={{
          width: virtualScreen.width,
          height: virtualScreen.height,
          transform: `scale(${virtualScreen.scale})`,
        }}
      />
      <MobileFullscreenGate />
    </div>
  );
}
