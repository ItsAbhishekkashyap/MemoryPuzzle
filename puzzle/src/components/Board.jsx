import Card from "./Card";


export default function Board({ cards, flipped, matched, onCardClick }) {
  return (
    <div className="grid grid-cols-4 gap-5 place-items-center mt-6">
      {cards.map((card, index) => (
        <Card
          key={index}
          src={card.src}
          isFlipped={flipped.includes(index)}
          isMatched={matched.includes(index)}
          onClick={() => onCardClick(index)}
        />
      ))}
    </div>
  );
}