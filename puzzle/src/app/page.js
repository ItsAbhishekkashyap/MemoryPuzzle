"use client"

import { useState, useEffect } from "react"
import Board from "@/components/Board"
import ImageUploader from "@/components/ImageUploader"
import NameModal from "@/components/NameModal"
import { Upload, Loader2, AlertCircle, User, ArrowRight } from 'lucide-react'


const DEFAULT_ASSETS = ['🦄', '🤖', '👻', '👽', '👾', '🐲', '🦕', '🐢']
export default function Home() {
  const [playerName, setPlayerName] = useState("")
  const [hasEnteredName, setHasEnteredName] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showStartPopup, setShowStartPopup] = useState(true)



  const loadSavedGame = async (name) => {
    try {
      const res = await fetch("/api/load", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ player_name: name }),
      });

      const json = await res.json();
      if (json.success && json.data?.state) {
        const saved = json.data.state;
        if (saved.cards?.length === 16) {
          setCards(saved.cards);
          setFlipped(saved.flipped);
          setMatched(saved.matched);
          setMoves(saved.moves);
          setGameOver(saved.gameOver);
          return true;
        }
      }
    } catch (err) {
      console.error("Load Game Error:", err);

    }
    return false;
  }

  const saveGame = async (
    currentCards = cards,

    currentMatched = matched,
    currentMoves = moves,

  ) => {
    if (!playerName) return;
    try {
      await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          player_name: playerName,
          state: {
            cards: currentCards,
            matched: currentMatched,
            moves: currentMoves,
            uploadedImages,
          },
        }),
      });
    } catch (error) {
      console.error("Supabase save error", err);

    }
  }

  const buildDeck = (assets) => {
    const duplicated = [...assets, ...assets];
    const shuffled = duplicated
      .sort(() => Math.random() - 0.5)
      .map((src, index) => ({ id: index, src, isFlipped: false, isMatched: false }))

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameOver(false);
    setTimeout(() => saveGame(shuffled, [], 0), 100);
  };

  const handleNameConfirm = async (name) => {
    setPlayerName(name)
    setHasEnteredName(true)
    const loaded = await loadSavedGame(name);
    if (!loaded) buildDeck(DEFAULT_ASSETS);
  };


  const handleImagesUploaded = (urls) => {
    setUploadedImages(urls);
    if (urls.length === 8) setShowStartPopup(true);
  };

  const startGame = () => {
    setShowStartPopup(false);
    if (uploadedImages.length === 8) buildDeck(uploadedImages);
    else buildDeck(DEFAULT_ASSETS);
  };

  const handleCardClick = (index) => {
    if (flipped.includes(index) || matched.includes(index)) return;
    if (flipped.length === 2) return;

    const updated = [...flipped, index];
    setFlipped(updated);

    if (updated.length === 2) {
      setMoves((m) => m + 1);
      setTimeout(() => {
        const [a, b] = updated;
        if (cards[a].src === cards[b].src) setMatched((prev) => [...prev, a, b])
        setFlipped([]);
        saveGame();
      }, 800);

    }


  };

  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) setGameOver(true);
  }, [matched, cards])



  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-slate-50 gap-8 font-sans">

    {!hasEnteredName && <NameModal
        isOpen={showStartPopup}
        onConfirm={handleNameConfirm}
      /> }
      

      {/* Header Stats */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm gap-4">
        <h1 className="text-2xl font-bold text-indigo-600">Memory Game</h1>
        <div className="flex gap-6 font-medium text-slate-600 text-sm md:text-base">
          <span className="bg-slate-100 px-3 py-1 rounded-full">Player: <span className="text-black font-bold">{playerName || 'Guest'}</span></span>
          <span className="bg-slate-100 px-3 py-1 rounded-full">Moves: <span className="text-black font-bold">{moves}</span></span>
          <span className="bg-slate-100 px-3 py-1 rounded-full">Matches: <span className="text-black font-bold">{matched.length / 2} / {cards.length / 2}</span></span>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl items-start">

        {/* Sidebar: Settings & Uploads */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="font-bold text-lg mb-4 text-slate-800">Setup Game</h2>
            <div className="mb-4">
              <p className="text-sm text-slate-500 mb-2">Upload your own images (optional):</p>
              <ImageUploader onComplete={handleImagesUploaded} />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm text-slate-500 mb-4">
                <span>Custom Images:</span>
                <span className="font-medium text-slate-700">{uploadedImages.length}</span>
              </div>
              <button
                onClick={startGame}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200"
              >
                {cards.length === 0 ? 'Start New Game' : 'Restart Game'}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-indigo-50 p-6 rounded-xl text-sm text-indigo-900">
            <h3 className="font-bold mb-2">How to play:</h3>
            <ul className="list-disc pl-4 space-y-1 opacity-80">
              <li>Enter your name to begin.</li>
              <li>Upload images to use them as cards, or use default emojis.</li>
              <li>Click &#34;Start Game&#34; to shuffle the deck.</li>
              <li>Find all matching pairs in fewer moves!</li>
            </ul>
          </div>
        </div>

        {/* Main Board */}
        <div className="w-full lg:w-2/3 order-1 lg:order-2">
          {cards.length > 0 ? (
            <div className="animate-in fade-in duration-500">
              <Board
                cards={cards}
                flipped={flipped}
                matched={matched}
                onCardClick={handleCardClick}
              />
            </div>
          ) : (
            <div className="h-96 bg-white rounded-xl border-2 border-dashed border-slate-300 flex flex-col gap-4 items-center justify-center text-slate-400">
              <div className="bg-slate-100 p-4 rounded-full">
                <span className="text-4xl">🎮</span>
              </div>
              <p>Press &#34;Start Game&#34; to deal the cards</p>
            </div>
          )}

          {gameOver && (
            <div className="mt-6 p-6 bg-green-100 border border-green-200 text-green-800 rounded-xl text-center animate-in zoom-in duration-300 shadow-sm">
              <h3 className="text-2xl font-bold mb-1">🎉 Congratulations, {playerName}!</h3>
              <p>You completed the game in <span className="font-bold text-xl">{moves}</span> moves.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}