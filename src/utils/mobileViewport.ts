import Konva from "konva";

// O layout do jogo foi desenhado para telas de PC. No celular, a página vira uma
// moldura (MobileShell) com o jogo num iframe do tamanho de uma tela de PC,
// reduzido para caber. Dentro do iframe tudo continua em pixels de PC (vw/vh,
// clientX, getBoundingClientRect, Konva), e o navegador converte o toque.
// Não dá para usar a meta viewport: em tela cheia o Chrome força a escala 1.
const VIRTUAL_HEIGHT = 760;
// Acima do breakpoint de 1100px, para nunca cair no layout empilhado.
const MIN_VIRTUAL_WIDTH = 1180;

export const EMBED_PARAM = "embed";

export const isMobileDevice = () =>
  window.matchMedia("(pointer: coarse)").matches &&
  Math.min(window.screen.width, window.screen.height) < 900;

/** O jogo está rodando dentro da moldura do celular. */
export const isEmbedded = () =>
  new URLSearchParams(window.location.search).has(EMBED_PARAM);

export const isPortrait = () => window.innerHeight > window.innerWidth;

// Proporções da aldeia no canvas. No celular a tela inteira é reduzida, então
// a aldeia ocupa mais a altura e as cabanas e os nomes dos clãs ficam maiores.
export const stageTuning = isEmbedded()
  ? { radius: 0.42, centerY: 0.545, hutRadius: 0.135, hutFont: 0.5, labelWidth: 4.8, sun: 0.4 }
  : { radius: 0.37, centerY: 0.56, hutRadius: 0.105, hutFont: 0.55, labelWidth: 3.2, sun: 0.75 };

/** Tamanho da "tela de PC" do iframe e a escala para caber na tela real. */
export function getVirtualScreen(realWidth: number, realHeight: number) {
  const ratio = realWidth / realHeight;
  let width = Math.round(VIRTUAL_HEIGHT * ratio);
  let height = VIRTUAL_HEIGHT;
  if (width < MIN_VIRTUAL_WIDTH) {
    width = MIN_VIRTUAL_WIDTH;
    height = Math.round(MIN_VIRTUAL_WIDTH / ratio);
  }
  return { width, height, scale: realWidth / width };
}

/**
 * Dentro do iframe, o canvas do Konva usaria o devicePixelRatio inteiro sem
 * saber que a página está reduzida: desenharia ~2x mais pixels que a tela mostra.
 */
export function setupEmbeddedCanvas() {
  const screenWidth = Math.max(window.screen.width, window.screen.height);
  const realRatio = (window.devicePixelRatio * screenWidth) / window.innerWidth;
  Konva.pixelRatio = Math.min(2, Math.max(1, realRatio));
  // Ativa os tamanhos maiores do modo celular (css/MobileEmbed.css).
  document.documentElement.classList.add("mobile-embed");
}
