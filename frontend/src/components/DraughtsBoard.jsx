import { getEmptyCases, getNearCases, isEmpty } from "../lib/agrah";
import { useGameStore } from "../store/useGameStore";

const DraughtsBoard = () => {
  const {
    selectedGame,
    fillCell,
    toggleSelectCell,
    selectedCell,
    moveCell,
    checkValidMove,
    unCheckValidMove,
  } = useGameStore();

  // useEffect(() => {
  //   console.log("selectedGame:", selectedGame.pions);

  // }, [selectedGame]);

  const handleClick = (cell) => {
    console.log("cell:", cell.id);
    console.log("selectedCell:", selectedCell);
    console.log("Near Empty:", getEmptyCases(cell.id, selectedGame));

    // Filling poins party
    if (selectedGame.party.isFilling) {
      if (!isEmpty(cell.id, selectedGame)) {
        console.log("Case deja occupé:", cell.id);
        return;
      }
      fillCell(cell);
    }
    // Moving pions party
    else if (selectedGame.party.isMoving) {
      if (isEmpty(cell.id, selectedGame) && !selectedCell) {
        console.log("Case est vide:", cell.id);
        return;
      }
      if (getEmptyCases(cell.id, selectedGame).length === 0) {
        console.log("Can't move:", cell.id);
        return;
      }
      if (!selectedCell || selectedCell.id === cell.id) {
        toggleSelectCell(cell);
        checkValidMove(cell);
        return;
      }
      moveCell(cell);
      unCheckValidMove();
    }
    console.log("Empty case near:", getEmptyCases(cell.id, selectedGame));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 max-h-210">
      <div className="grid grid-cols-5 gap-2">
        {selectedGame.pions.map((cell) => (
          <button
            key={cell.id}
            className={`
                aspect-square
                rounded-full
                border-4
                ${
                  cell.ownerId === 0
                    ? "border-slate-600 bg-slate-800 hover:border-slate-500 hover:bg-slate-700"
                    : cell.ownerId === 1
                      ? "border-rose-400 bg-rose-600/70 hover:border-rose-300 hover:bg-rose-500/80"
                      : "border-cyan-400 bg-cyan-600/70 hover:border-cyan-300 hover:bg-cyan-500/80"
                }

                shadow-lg
                transition-all duration-200
                hover:scale-105
                flex items-center justify-center
                cursor-pointer

                ${cell.isSelected ? "ring-4 ring-yellow-300 scale-105" : ""}

                ${cell.isValidMove ? "ring-4 ring-emerald-400 animate-pulse" : ""}
            `}
            onClick={() => handleClick(cell)}
          >
            {cell.id}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DraughtsBoard;
