import React, { useState, useEffect, useCallback } from 'react';
import { Treasure, GameState, ScoreData } from './types';
import { TREASURES } from './constants';
import { TreasureCard } from './components/TreasureCard';
import { GameOverModal } from './components/GameOverModal';

// Fisher-Yates Shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  
  // The items the user has already clicked in this game session
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set());
  
  // The items currently displayed on the board
  const [currentTreasures, setCurrentTreasures] = useState<Treasure[]>([]);

  // Initialize the game
  const startGame = useCallback(() => {
    setScore(0);
    setCollectedIds(new Set());
    setGameState(GameState.PLAYING);
    
    // Pick first treasure randomly
    const randomFirst = TREASURES[Math.floor(Math.random() * TREASURES.length)];
    setCurrentTreasures([randomFirst]);
  }, []);

  // Handle user selection
  const handleTreasureClick = (id: string) => {
    if (gameState !== GameState.PLAYING) return;

    if (collectedIds.has(id)) {
      // User clicked an item they already collected -> GAME OVER
      setGameState(GameState.GAME_OVER);
    } else {
      // User clicked a new item -> SUCCESS
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > bestScore) setBestScore(newScore);

      const newCollected = new Set<string>(collectedIds);
      newCollected.add(id);
      setCollectedIds(newCollected);

      // Check Victory
      if (newCollected.size >= TREASURES.length) {
        setGameState(GameState.VICTORY);
        return;
      }

      // Next Round Preparation
      prepareNextRound(newCollected);
    }
  };

  // Prepare the board for the next round
  const prepareNextRound = (currentCollected: Set<string>) => {
    // 1. Identify all treasures that have already been collected
    const collectedTreasures = TREASURES.filter(t => currentCollected.has(t.id));

    // 2. Identify treasures that have NOT been collected yet
    const availableTreasures = TREASURES.filter(t => !currentCollected.has(t.id));

    if (availableTreasures.length === 0) return; // Should be handled by victory check

    // 3. Pick ONE new treasure from available
    const nextTreasure = availableTreasures[Math.floor(Math.random() * availableTreasures.length)];

    // 4. Combine collected items + the ONE new item
    // Ideally, to make it harder, we show ALL collected items + new item.
    // But if the screen is small, we might need to limit it? 
    // The classic game shows ALL. We will try to show all.
    const nextBoard = [...collectedTreasures, nextTreasure];

    // 5. Shuffle the board so position isn't a clue
    setCurrentTreasures(shuffleArray(nextBoard));
  };

  return (
    <div className="min-h-screen text-white bg-slate-900 ocean-pattern relative flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/20 p-2 rounded-lg">
              <span className="text-2xl">⚓</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bubble text-cyan-300 tracking-wide">Tidal Recall</h1>
          </div>
          
          {gameState === GameState.PLAYING && (
            <div className="flex gap-6 text-sm font-semibold">
              <div className="flex flex-col items-end">
                <span className="text-slate-400 text-xs uppercase">Streak</span>
                <span className="text-cyan-300 text-xl leading-none">{score}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-slate-400 text-xs uppercase">Best</span>
                <span className="text-yellow-400 text-xl leading-none">{bestScore}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 w-full max-w-6xl mx-auto">
        
        {gameState === GameState.START && (
          <div className="text-center max-w-lg space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bubble text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-600 pb-2">
                Deep Dive Memory
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                Treasures will wash ashore one by one. <br/>
                Tap the <strong className="text-white">NEW</strong> treasure that wasn't there before.
                <br/>Don't tap the same one twice!
              </p>
            </div>
            
            <button 
              onClick={startGame}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-cyan-600 font-bubble text-2xl rounded-full hover:bg-cyan-500 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)] focus:outline-none focus:ring-4 focus:ring-cyan-500/30"
            >
              <span className="mr-2">🌊</span> Start Expedition
            </button>
            
            <div className="grid grid-cols-3 gap-4 opacity-50 pointer-events-none grayscale">
              {TREASURES.slice(0, 3).map(t => (
                <div key={t.id} className="text-4xl p-4 bg-white/5 rounded-xl">{t.emoji}</div>
              ))}
            </div>
          </div>
        )}

        {gameState === GameState.PLAYING && (
          <div className="w-full">
            <div className={`grid gap-3 transition-all duration-500 ease-out
              ${currentTreasures.length <= 4 ? 'grid-cols-2 max-w-sm mx-auto' : ''}
              ${currentTreasures.length > 4 && currentTreasures.length <= 9 ? 'grid-cols-3 max-w-md mx-auto' : ''}
              ${currentTreasures.length > 9 && currentTreasures.length <= 16 ? 'grid-cols-4 max-w-lg mx-auto' : ''}
              ${currentTreasures.length > 16 && currentTreasures.length <= 25 ? 'grid-cols-5 max-w-2xl mx-auto' : ''}
              ${currentTreasures.length > 25 ? 'grid-cols-6 max-w-4xl mx-auto' : ''}
            `}>
              {currentTreasures.map((treasure) => (
                <TreasureCard 
                  key={treasure.id} 
                  treasure={treasure} 
                  onClick={handleTreasureClick}
                  disabled={false}
                />
              ))}
            </div>
            <div className="mt-8 text-center text-slate-400 text-sm animate-pulse">
              Spot the new treasure!
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-slate-600 text-xs border-t border-white/5">
        <p>© 2025 Tidal Recall • Find the unique treasure</p>
      </footer>

      {/* Pay Me a Coffee Link - Bottom Left Corner */}
      <a 
        href="https://ko-fi.com/ivanchongth" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 z-50 group"
        aria-label="Support me on Ko-fi"
      >
        <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 hover:bg-slate-700/80 transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <span className="text-orange-400 text-lg">☕</span>
          <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">
            Buy Me a Coffee
          </span>
        </div>
      </a>

      {/* Modals */}
      <GameOverModal 
        score={score} 
        maxScore={TREASURES.length}
        gameState={gameState} 
        onRestart={startGame} 
      />
    </div>
  );
}