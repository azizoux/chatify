import ActiveTabSwitch from "../components/ActiveTabSwitch";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ChatContainer from "../components/ChatContainer";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import GameContainer from "../components/GameContainer";
import GameList from "../components/GameList";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import NoGamePlaceholder from "../components/NoGamePlaceholder";
import ProfileHeader from "../components/ProfileHeader";
import { useChatStore } from "../store/useChatStore";
import { useGameStore } from "../store/useGameStore";

const ChatPage = () => {
  const { activeTab, selectedUser } = useChatStore();
  const { selectedGame, selectedGameAdversor } = useGameStore();
  return (
    <div className="relative w-full max-w-6xl h-screen p-8">
      <BorderAnimatedContainer>
        {/* LEFT SIDE  */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? (
              <ChatsList />
            ) : activeTab === "game" ? (
              <GameList />
            ) : (
              <ContactList />
            )}
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {(activeTab === "chats" || activeTab === "contacts") &&
            (selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />)}
          {activeTab === "game" &&
            (selectedGame && selectedGameAdversor ? (
              <GameContainer />
            ) : (
              <NoGamePlaceholder />
            ))}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
};

export default ChatPage;
