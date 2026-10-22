import { useEffect, useState } from "react";
import { isMobileDevice, isPortrait } from "../utils/mobileViewport";
import "../css/MobileFullscreenGate.css";

// Safari antigo só tem as versões com prefixo webkit.
type FullscreenDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
};
type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type LockableOrientation = ScreenOrientation & {
  lock?: (orientation: "landscape") => Promise<void>;
};

const fullscreenDoc = document as FullscreenDocument;

const canFullscreen = () =>
  Boolean(fullscreenDoc.fullscreenEnabled || fullscreenDoc.webkitFullscreenEnabled);

const isFullscreen = () =>
  Boolean(fullscreenDoc.fullscreenElement || fullscreenDoc.webkitFullscreenElement);

async function enterLandscapeFullscreen() {
  const root = document.documentElement as FullscreenElement;
  try {
    if (root.requestFullscreen) {
      await root.requestFullscreen({ navigationUI: "hide" });
    } else {
      await root.webkitRequestFullscreen?.();
    }
  } catch (error) {
    console.warn("Não foi possível entrar em tela cheia", error);
    return;
  }

  // Só funciona em tela cheia, e não existe no iPhone: aí o aviso de girar resolve.
  try {
    await (screen.orientation as LockableOrientation | undefined)?.lock?.("landscape");
  } catch {
    // ignora: o celular continua mostrando o aviso enquanto estiver em pé
  }
}

/**
 * No celular, cobre o jogo até ele estar em tela cheia e deitado.
 * Sem suporte a tela cheia (iPhone), cobre só enquanto estiver em pé.
 */
export function MobileFullscreenGate() {
  const [isMobile] = useState(isMobileDevice);
  const [portrait, setPortrait] = useState(isPortrait);
  const [fullscreen, setFullscreen] = useState(isFullscreen);

  useEffect(() => {
    if (!isMobile) return;

    const update = () => {
      setPortrait(isPortrait());
      setFullscreen(isFullscreen());
    };

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    document.addEventListener("fullscreenchange", update);
    document.addEventListener("webkitfullscreenchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      document.removeEventListener("fullscreenchange", update);
      document.removeEventListener("webkitfullscreenchange", update);
    };
  }, [isMobile]);

  if (!isMobile) return null;

  const showFullscreenButton = canFullscreen() && !fullscreen;
  if (!showFullscreenButton && !portrait) return null;

  return (
    <div className="mobile-gate" role="dialog" aria-modal="true">
      <div className="mobile-gate__phone" aria-hidden="true">
        <span className="mobile-gate__phone-screen" />
      </div>
      <h1 className="mobile-gate__title">Jogue com o celular deitado</h1>
      {showFullscreenButton ? (
        <button
          type="button"
          className="mobile-gate__button"
          onClick={enterLandscapeFullscreen}
        >
          Jogar em tela cheia
        </button>
      ) : (
        <p className="mobile-gate__hint">Gire o celular para começar.</p>
      )}
    </div>
  );
}
