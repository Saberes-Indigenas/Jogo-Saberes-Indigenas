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
    const imagePromises: Promise<void>[] = [];
    const images = new Map<string, HTMLImageElement>();

    // Remove URLs duplicadas para evitar carregamentos desnecessários
    const uniqueUrls = [...new Set(urls)];

    uniqueUrls.forEach((url) => {
      const promise = new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          images.set(url, img);
          resolve();
        };
        img.onerror = () => {
          console.error(`Falha ao carregar a imagem: ${url}`);
          // Resolve mesmo em caso de erro para não bloquear o carregamento das outras
          resolve();
        };
      });
      imagePromises.push(promise);
    });

    Promise.all(imagePromises).then(() => {
      if (isMounted) {
        setLoadedImages(images);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false; // Cleanup para evitar atualizações em componentes desmontados
    };
  }, [urls]); // Executa apenas se a lista de URLs mudar

  return { loadedImages, isLoading };
};
