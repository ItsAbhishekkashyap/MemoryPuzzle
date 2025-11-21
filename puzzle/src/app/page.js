"use client";

import { useState, useEffect } from "react";
import Board from "@/component/Board";
import ImageUploader from "@/component/ImageUploader";
import NameModal from "@/component/NameModal";

const DEFAULT_ASSETS = ["🔥","🔥","⚡","⚡","🎲","🎲","🌙","🌙"];

export default function Home() {
  const [playerName, setPlayerName] = useState("");
  const [hasEnteredName, setHasEnteredName] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showStartPopup, setShowStartPopup] = useState(false);

  // --- SAVE / LOAD ---
  const loadSavedGame = async (name) => {
    try {
      const res = await fetch("/api/load", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_name: name }),
      });
      const json = await res.json();
      if (json.success && json.data?.state) {
        const saved = json.data.state;
        if (saved.cards?.length === 16) {
          setCards(saved.cards);
          setMatched(saved.matched);
          setMoves(saved.moves);
          setUploadedImages(saved.uploadedImages || []);
          return true;
        }
      }
    } catch (err) {
      console.error("Supabase load error:", err);
    }
    return false;
  };

  const saveGame = async (
    currentCards = cards,
    currentMatched = matched,
    currentMoves = moves
  ) => {
    if (!playerName) return;
    try {
      await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    } catch (err) {
      console.error("Supabase save error:", err);
    }
  };

  // --- DECK BUILD ---
  const buildDeck = (assets) => {
    const duplicated = [...assets, ...assets];
    const shuffled = duplicated
      .sort(() => Math.random() - 0.5)
      .map((src, index) => ({ id: index, src, isFlipped: false, isMatched: false }));

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameOver(false);
    setTimeout(() => saveGame(shuffled, [], 0), 100);
  };

  // --- HANDLE NAME ---
  const handleNameConfirm = async (name) => {
    setPlayerName(name);
    setHasEnteredName(true);
    const loaded = await loadSavedGame(name);
    if (!loaded) buildDeck(DEFAULT_ASSETS);
  };

  // --- HANDLE UPLOAD ---
  const handleImagesUploaded = (urls) => {
    setUploadedImages(urls);
    if (urls.length === 8) setShowStartPopup(true);
  };

  const startGame = () => {
    setShowStartPopup(false);
    if (uploadedImages.length === 8) buildDeck(uploadedImages);
    else buildDeck(DEFAULT_ASSETS);
  };

  const handleEmojiClick = () => {
    setUploadedImages([]);
    setShowStartPopup(false);
    buildDeck(DEFAULT_ASSETS);
  };

  // --- CARD LOGIC ---
  const handleCardClick = (index) => {
    if (flipped.includes(index) || matched.includes(index)) return;
    if (flipped.length === 2) return;

    const updated = [...flipped, index];
    setFlipped(updated);

    if (updated.length === 2) {
      setMoves((m) => m + 1);
      setTimeout(() => {
        const [a, b] = updated;
        if (cards[a].src === cards[b].src) setMatched((prev) => [...prev, a, b]);
        setFlipped([]);
        saveGame();
      }, 800);
    }
  };

  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) setGameOver(true);
  }, [matched, cards]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-950 text-white p-6 font-inter flex flex-col items-center">
      {!hasEnteredName && <NameModal onConfirm={handleNameConfirm} />}
      <header className="w-full max-w-4xl flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Memory Puzzle Game</h1>
          <p className="text-gray-400 text-sm">Player: <span className="font-semibold">{playerName}</span></p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="px-3 py-1 rounded glass">Moves: <span className="font-bold">{moves}</span></div>
          <div className="px-3 py-1 rounded glass">Progress: <span className="font-bold">{cards.length ? Math.round((matched.length / cards.length) * 100) : 0}%</span></div>
          <button onClick={handleEmojiClick} className="px-3 py-1 bg-gray-600 rounded">Use Emojis</button>
        </div>
      </header>

      <section className="w-full max-w-4xl glass p-6 rounded-xl border border-white/10 mb-8">
        <h2 className="text-xl font-semibold mb-2">Upload Custom Images</h2>
        <p className="text-gray-300 text-sm mb-3">Upload exactly <b>8 images</b> for a full custom game.</p>
        <ImageUploader onComplete={handleImagesUploaded} />
      </section>

      <main className="w-full max-w-4xl">
        <Board cards={cards} flipped={flipped} matched={matched} onCardClick={handleCardClick} />
      </main>

      <footer className="mt-6 text-gray-400 text-sm">
        {gameOver ? <span className="text-green-400">🎉 You finished the game!</span> : "Match all pairs to win!"}
      </footer>

      {showStartPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-xl text-center">
            <h2 className="text-xl font-bold">Ready to Start?</h2>
            <button className="mt-4 px-6 py-2 bg-emerald-600 rounded-lg" onClick={startGame}>Start Game</button>
          </div>
        </div>
      )}
    </div>
  );
}