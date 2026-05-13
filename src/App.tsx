import { useState, useEffect } from "react";
import type { GameData } from "./types";
import { GameStage } from "./components/game-stage";
import "./css/App.css";

export function App() {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/game-data.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: GameData = await response.json();
        setGameData(data);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Erro desconhecido ao carregar dados.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

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
      <GameStage clans={gameData.clans} initialItems={gameData.items} />
    </div>
  );
}
