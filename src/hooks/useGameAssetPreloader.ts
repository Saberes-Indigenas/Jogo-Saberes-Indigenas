import { useEffect, useMemo, useRef, useState } from "react";

import chaoBororoFloresta from "../assets/chãoBororoFloresta.svg";
import chaoBororo from "../assets/chãoBororo.svg";
import ocaDireitaUrl from "../assets/ocaLadoDireito.svg";
import ocaEsquerdaUrl from "../assets/ocaLadoEsquerdo.svg";
import tree1Url from "../assets/tree1.svg";
import tree2Url from "../assets/tree2.svg";
import tree3Url from "../assets/tree3.svg";
import tree4Url from "../assets/tree4.svg";
import bushUrl from "../assets/bush.svg";
import rockUrl from "../assets/rock.svg";
import pieceForestUrl1 from "../assets/pieceForest1.svg";
import pieceForestUrl2 from "../assets/pieceForest2.svg";
import pieceForestUrl3 from "../assets/pieceForest3.svg";
import pieceForestUrl4 from "../assets/pieceForest4.svg";
import floorParticlesUrl from "../assets/floorparticles.svg";
import floorParticle2Url from "../assets/floorparticle2.svg";

const assetManifest = [
  chaoBororoFloresta,
  chaoBororo,
  ocaDireitaUrl,
  ocaEsquerdaUrl,
  tree1Url,
  tree2Url,
  tree3Url,
  tree4Url,
  bushUrl,
  rockUrl,
  pieceForestUrl1,
  pieceForestUrl2,
  pieceForestUrl3,
  pieceForestUrl4,
  floorParticlesUrl,
  floorParticle2Url,
];

export const useGameAssetPreloader = () => {
  const assetUrls = useMemo(() => [...new Set(assetManifest)], []);
  const [completedCount, setCompletedCount] = useState(0);
  const [isReady, setIsReady] = useState(assetUrls.length === 0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const total = assetUrls.length;

    if (total === 0) {
      setCompletedCount(0);
      setIsReady(true);
      return;
    }

    setCompletedCount(0);
    setIsReady(false);

    const updateProgress = () => {
      if (isCancelled) return;
      setCompletedCount((prev) => {
        const next = prev + 1;
        if (next >= total) {
          setIsReady(true);
        }
        return next;
      });
    };

    const disposers = assetUrls.map((url) => {
      const image = new Image();
      image.decoding = "async";

      const finalize = () => {
        if (isCancelled) return;
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
        }
        rafRef.current = requestAnimationFrame(updateProgress);
      };

      const handleLoad = () => {
        if (typeof image.decode === "function") {
          image
            .decode()
            .catch(() => undefined)
            .finally(finalize);
        } else {
          finalize();
        }
      };

      image.addEventListener("load", handleLoad, { once: true });
      image.addEventListener("error", finalize, { once: true });
      image.src = url;

      return () => {
        image.removeEventListener("load", handleLoad);
        image.removeEventListener("error", finalize);
      };
    });

    return () => {
      isCancelled = true;
      disposers.forEach((dispose) => dispose());
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [assetUrls]);

  const totalAssets = assetUrls.length;
  const progress = totalAssets === 0 ? 1 : Math.min(1, completedCount / totalAssets);

  return {
    isReady,
    progress,
    total: totalAssets,
    loaded: completedCount,
  };
};

export type UseGameAssetPreloaderReturn = ReturnType<typeof useGameAssetPreloader>;
