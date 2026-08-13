import { useChatStore } from "../store/useChatStore";

const ActiveTabSwitch = () => {
  const { activeTab, setActiveTab } = useChatStore();
  return (
    <div className="tabs tabs-box bg-slate-800/50 p-1.5 m-2 rounded-xl">
      <button
        type="button"
        onClick={() => setActiveTab("chats")}
        className={`tab rounded-lg transition-all ${
          activeTab === "chats"
            ? "bg-cyan-500/20 text-cyan-400"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        Chats
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("contacts")}
        className={`tab rounded-lg transition-all ${
          activeTab === "contacts"
            ? "bg-cyan-500/20 text-cyan-400"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        Contacts
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("game")}
        className={`tab rounded-lg transition-all ${
          activeTab === "game"
            ? "bg-cyan-500/20 text-cyan-400"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        Jeux
      </button>
    </div>
  );
};

export default ActiveTabSwitch;
