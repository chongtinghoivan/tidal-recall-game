import React, { useMemo } from 'react';
import { GameState } from '../types';

interface GameOverModalProps {
  score: number;
  maxScore: number;
  gameState: GameState;
  onRestart: () => void;
}

const LOW_SCORE_MESSAGES = [
  "Arr, a bilge rat could do better than that!",
  "Ye be a landlubber if I ever saw one!",
  "Avast! Me grandmother finds more treasure in her sleep!",
  "Scupper that! Ye barely dipped your toes in the water!",
  "Shiver me timbers, that was a short voyage!"
];

const MED_SCORE_MESSAGES = [
  "Not bad, sailor. Ye've got a decent eye for loot!",
  "A fine haul, but there be more gold in them depths!",
  "Ye've got the makings of a true pirate, keep at it!",
  "Steady as she goes! Ye're finding your sea legs.",
  "Blimey! A respectable chest of treasures ye found."
];

const HIGH_SCORE_MESSAGES = [
  "Splice the mainbrace! Ye're a legend of the seven seas!",
  "Great barnacles! That's a haul fit for a King!",
  "Ye've cleaned out the ocean floor, ye salty dog!",
  "Arr, the legends weren't lyin' about your sharp eyes!",
  "By Poseidon's beard! A master of the tides ye be!"
];

export const GameOverModal: React.FC<GameOverModalProps> = ({ score, maxScore, gameState, onRestart }) => {
  const message = useMemo(() => {
    if (gameState === GameState.VICTORY) {
      return "Ye've found every single treasure in the deep! The ocean has no more secrets for ye!";
    }
    
    const percentage = score / maxScore;
    let pool = LOW_SCORE_MESSAGES;
    if (percentage > 0.7) pool = HIGH_SCORE_MESSAGES;
    else if (percentage > 0.3) pool = MED_SCORE_MESSAGES;
    
    return pool[Math.floor(Math.random() * pool.length)];
  }, [score, maxScore, gameState]);

  if (gameState !== GameState.GAME_OVER && gameState !== GameState.VICTORY) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-8 text-center shadow-2xl shadow-cyan-900/20 relative overflow-hidden">
        
        {/* Background decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none" />

        <h2 className={`font-bubble text-4xl mb-2 relative z-10 ${gameState === GameState.VICTORY ? 'text-yellow-400' : 'text-red-400'}`}>
          {gameState === GameState.VICTORY ? 'Treasure Master!' : 'Game Over!'}
        </h2>

        <div className="my-6 relative z-10">
          <div className="text-6xl font-bold text-white mb-2">{score}</div>
          <div className="text-slate-400 text-sm uppercase tracking-widest font-semibold">Treasures Found</div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 mb-8 min-h-[80px] flex items-center justify-center border border-white/5 relative z-10">
           <p className="text-lg text-cyan-100 italic">"{message}"</p>
        </div>

        <button
          onClick={onRestart}
          className="relative z-10 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-900/50"
        >
          {gameState === GameState.VICTORY ? 'Play Again' : 'Try Again'}
        </button>
      </div>
    </div>
  );
};