import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

const ChatContainer = () => {
  const { getMessageByUserId, selectedUser } = useChatStore();
  useEffect(() => {
    if (selectedUser) getMessageByUserId(selectedUser._id);
  }, [selectedUser]);
  return <div>{selectedUser._id}</div>;
};

export default ChatContainer;
