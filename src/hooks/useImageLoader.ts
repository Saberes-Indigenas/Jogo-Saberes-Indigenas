/* Arquivo: src/hooks/useImageLoader.ts */

import { useState, useEffect } from "react";

// Este hook gerencia o carregamento de múltiplas imagens.
// Retorna um mapa com as imagens carregadas e um status de carregamento.
export const useImageLoader = (urls: string[]) => {
  const [loadedImages, setLoadedImages] = useState<
    Map<string, HTMLImageElement>
  >(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const uniqueUrls = [...new Set(urls)].filter(Boolean);
    if (uniqueUrls.length === 0) {
      setLoadedImages(new Map());
      setIsLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);
    const images = new Map<string, HTMLImageElement>();
    const disposers: Array<() => void> = [];

    const imagePromises = uniqueUrls.map(
      (url) =>
        new Promise<void>((resolve) => {
          let resolved = false;
          const safeResolve = () => {
            if (resolved) return;
            resolved = true;
            resolve();
          };

          const img = new Image();
          img.decoding = "async";

          const finalize = () => {
            if (!isMounted) {
              safeResolve();
              return;
            }

            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
              images.set(url, img);
            }
            safeResolve();
          };

          const handleLoad = () => {
            img.removeEventListener("load", handleLoad);
            img.removeEventListener("error", handleError);
            if (typeof img.decode === "function") {
              img
                .decode()
                .catch(() => undefined)
                .finally(finalize);
            } else {
              finalize();
            }
          };

          const handleError = () => {
            console.error(`Falha ao carregar a imagem: ${url}`);
            img.removeEventListener("load", handleLoad);
            img.removeEventListener("error", handleError);
            finalize();
          };

          img.addEventListener("load", handleLoad, { once: true });
          img.addEventListener("error", handleError, { once: true });
          img.src = url;

          disposers.push(() => {
            img.removeEventListener("load", handleLoad);
            img.removeEventListener("error", handleError);
          });

          if (img.complete && img.naturalWidth !== 0) {
            handleLoad();
          }
        })
    );

    Promise.all(imagePromises).then(() => {
      if (!isMounted) {
        return;
      }
      setLoadedImages(images);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      disposers.forEach((dispose) => dispose());
    };
  }, [urls]); // Executa apenas se a lista de URLs mudar

  return { loadedImages, isLoading };
};
