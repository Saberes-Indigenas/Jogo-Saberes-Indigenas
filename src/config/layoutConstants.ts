// --- CONFIGURAÇÕES GERAIS DO JOGO ---
export const TAMANHO_LOTE = 5; // Itens por rodada

// --- DIMENSÕES DO LAYOUT ---
export const ITEM_TRAY_WIDTH = 200; // Largura da barra lateral de itens
export const HEADER_HEIGHT = 70;    // Altura aproximada do cabeçalho

// --- CÁLCULOS DA ÁREA DE JOGO ---
// Calcula a área disponível para o palco com base no tamanho da janela e nas barras
export const GAME_AREA_WIDTH = window.innerWidth - ITEM_TRAY_WIDTH;
export const GAME_AREA_HEIGHT = window.innerHeight;

// --- CÁLCULOS DO PALCO (BORoro) ---
// O centro do palco (pátio)
export const CENTRO_X = GAME_AREA_WIDTH / 2;
export const CENTRO_Y = GAME_AREA_HEIGHT / 2;

// O raio do círculo principal, ajustado para caber na área disponível
export const RAIO_PALCO = Math.min(GAME_AREA_WIDTH, GAME_AREA_HEIGHT) * 0.45;