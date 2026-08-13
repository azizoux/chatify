import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import { XIcon } from "lucide-react";

const GameHeader = () => {
  const { selectedGameAdversor, setSelectedGameAdversor } = useGameStore();

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedGameAdversor(null);
    };
    window.addEventListener("keydown", handleEscKey);
    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [selectedGameAdversor]);
  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
  border-slate-700/50 max-h-21 flex-1"
    >
      <div className="flex items-center space-x-3">
        <div className={`avatar avatar-online`}>
          <div className="w-12 rounded-full">
            <img
              src={selectedGameAdversor?.profilePic || "/avatar.png"}
              alt={selectedGameAdversor.fullName}
            />
          </div>
        </div>
        <div>
          <h3 className="text-slate-200 font-medium">
            {selectedGameAdversor.fullName}
          </h3>
          <p className="text-sky-400 text-sm">Online</p>
        </div>
      </div>
      <button
        className="mr-4 cursor-pointer"
        onClick={() => setSelectedGameAdversor(null)}
      >
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors" />
      </button>
    </div>
  );
};

export default GameHeader;
