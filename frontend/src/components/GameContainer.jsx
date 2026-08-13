import GameHeader from "./GameHeader";

import DraughtsBoard from "./DraughtsBoard";

const GameContainer = () => {
  return (
    <>
      <GameHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        <DraughtsBoard />
      </div>
    </>
  );
};

export default GameContainer;
