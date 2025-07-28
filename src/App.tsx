// src/App.tsx

import React, { useState, useEffect } from 'react';
import type { GameData } from './types';
import GameStage from './components/gameStage';

const App: React.FC = () => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // O ficheiro está em /public, por isso o fetch é a partir da raiz.
        const response = await fetch('../game-data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: GameData = await response.json();
        setGameData(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // O array vazio [] garante que o efeito corre apenas uma vez.

  if (isLoading) {
    return <div>Carregando dados do jogo...</div>;
  }

  if (error) {
    return <div>Erro ao carregar dados: {error}</div>;
  }

  if (!gameData) {
    return <div>Nenhum dado de jogo encontrado.</div>;
  }

  return (
    <div className="app-container">
        <GameStage clans={gameData.clans} initialItems={gameData.items}/>
    </div>
  );
};

export default App;