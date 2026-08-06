import { useAuthStore } from "../store/useAuthStore";

const ChatPage = () => {
  const { logout } = useAuthStore();
  return (
    <div className="z-10">
      <h1>ChatPage</h1>
      <button onClick={logout} className="btn btn-accent z-10">
        Logout
      </button>
    </div>
  );
};

export default ChatPage;
