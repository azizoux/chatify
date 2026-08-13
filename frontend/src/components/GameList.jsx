import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import UserLoadingSkeleton from "./UserLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

const GameList = () => {
  const {
    getMyGames,
    myGames,
    setSelectedGame,
    isGameLoading,
    setSelectedGameAdversor,
  } = useGameStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMyGames();
  }, [getMyGames]);

  if (isGameLoading) return <UserLoadingSkeleton />;
  if (myGames.length === 0) return <NoChatsFound />;

  return (
    <>
      {myGames.map((game) => (
        <div
          key={game.id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20
    transition-colors"
          onClick={() => {
            setSelectedGameAdversor(game);
            setSelectedGame(game);
          }}
        >
          <div className="flex items-center gap-3">
            {/* TODO: FIX THIS ONLINE STATUS AND MAKE IT WORK WITH SOCKET */}
            <div className={`avatar avatar-online `}>
              <div className="size-12 rounded-full">
                <img
                  src={
                    game.users[game.users[0].id === authUser._id ? 1 : 0]
                      .profilePic || "/avatar.png"
                  }
                  alt={
                    game.users[game.users[0].id === authUser._id ? 1 : 0]
                      .username
                  }
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {game.users[game.users[0].id === authUser._id ? 1 : 0].username}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
};

export default GameList;
