import { useEffect, useState } from "react";

const width = 8;
const candyColors = [
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "yellow"
];

function CandyCrush() {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);

  const createBoard = () => {
    const randomColors = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColors.push(randomColor);
    }
    setCurrentColorArrangement(randomColors);
  };

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === "";

      if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        columnOfThree.forEach(square => currentColorArrangement[square] = "");
        setScoreDisplay(score => score + 3);
        return true;
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === "";
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

      if (notValid.includes(i)) continue;

      if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
        rowOfThree.forEach(square => currentColorArrangement[square] = "");
        setScoreDisplay(score => score + 3);
        return true;
      }
    }
  };

  const moveIntoSquareBelow = () => {
    // Önce yukarıdan aşağı taşı
    for (let i = 0; i < 56; i++) {
      if (currentColorArrangement[i + width] === "") {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = "";
      }
    }
    // Sonra boş yerlere yeni şeker ekle
    for (let i = 0; i < 64; i++) {
      if (currentColorArrangement[i] === "") {
        let randomNumber = Math.floor(Math.random() * candyColors.length);
        currentColorArrangement[i] = candyColors[randomNumber];
      }
    }
  };

  const dragStart = (e) => {
    setSquareBeingDragged(e.target);
  };

  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  };

  const dragEnd = () => {
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute("data-id"));
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute("data-id"));

    const newArrangement = [...currentColorArrangement];
    newArrangement[squareBeingReplacedId] = currentColorArrangement[squareBeingDraggedId];
    newArrangement[squareBeingDraggedId] = currentColorArrangement[squareBeingReplacedId];

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId + 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + width,
    ];

    if (validMoves.includes(squareBeingReplacedId)) {
      setCurrentColorArrangement(newArrangement);
    }
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);
    return () => clearInterval(timer);
  }, [currentColorArrangement]);

  return (
    <div className="game">
      <div className="score">Score: {scoreDisplay}</div>
      <div className="board">
        {currentColorArrangement.map((color, index) => (
          <div
            key={index}
            style={{ backgroundColor: color }}
            className="candy"
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
    </div>
  );
}

export default CandyCrush;