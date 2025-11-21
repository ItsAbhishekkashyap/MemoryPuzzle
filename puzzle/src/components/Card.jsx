export default function Card({ isFlipped, isMatched, src, onClick }) {
  const isEmoji = !src.startsWith("http"); // detect emoji (or any non-URL string)

  return (
    <div
      className="w-24 h-24 cursor-pointer perspective card-anim"
      onClick={onClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d
          ${isFlipped || isMatched ? "rotate-y-180" : ""}
          ${isMatched ? "matched-glow" : ""}
        `}
      >
        {/* FRONT */}
        <div className="absolute w-full h-full backface-hidden glass rounded-xl flex items-center justify-center text-3xl border border-white/10">
          ?
        </div>

        {/* BACK */}
        <div className="absolute w-full h-full rotate-y-180 backface-hidden rounded-xl flex items-center justify-center overflow-hidden">
          {isEmoji ? (
            <span className="text-4xl">{src}</span> // render emoji as text
          ) : (
            <img
              src={src}
              alt="card"
              className="object-cover w-full h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
