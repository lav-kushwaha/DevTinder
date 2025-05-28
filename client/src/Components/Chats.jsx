import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/Constant";
import axios from 'axios';

const Chat = () => {
  const { targetUserId } = useParams();

  // State to store chat messages displayed in the UI
  const [messages, setMessages] = useState([]);

  // State to track the value of the input field for sending a new message
  const [newMessage, setNewMessage] = useState("");
  
  // Getting the current logged-in user's details from Redux store
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  // Ref for auto scroll to bottom
  const messagesEndRef = useRef(null);

  // Fetch chat messages between current user and target user from the database
  const fetchChatMessages = async () => {
    const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
      withCredentials: true,
    });

    // Map messages to display sender's name and message text
    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
      };
    });

    setMessages(chatMessages);
  };

  // On initial render, fetch existing chat messages
  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  // Setup WebSocket connection when userId and targetUserId are available
  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();

    // Notify server that user has joined the chat
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    // Listen for new messages from the server
    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((prevMessages) => [...prevMessages, { firstName, lastName, text }]);
    });

    // Clean up socket connection on component unmount
    return () => socket.disconnect();
  }, [userId, targetUserId]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a new message to the server via WebSocket
  const sendMessage = () => {
    if (!newMessage.trim()) return; // Prevent sending empty messages

    const socket = createSocketConnection();

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName:user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage(""); // Clear input after sending
  };

  return (
    <div
      className="max-w-4xl mx-auto m-4  border border-gray-700 rounded-2xl shadow-lg flex flex-col bg-gray-900 text-white
                 h-[75vh] sm:h-[80vh] md:h-[85vh]"
    >
      
      {/* Header */}
      <div className="p-6 border-b border-gray-700 text-xl font-semibold">
        Chat
      </div>

      {/* Chat Messages Display Area */}
      <div
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
        style={{ scrollbarWidth: 'thin' }}
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-400">No messages yet</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.firstName === user.firstName ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] break-words ${
                  msg.firstName === user.firstName
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                <span className="font-bold">{`${msg.firstName} ${msg.lastName}`}</span>: {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input and Send Button */}
      <div className="p-4 border-t border-gray-700 bg-gray-800 flex flex-col sm:flex-row items-center gap-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          type="text"
          placeholder="Type your message..."
          className="flex-grow bg-gray-700 border border-gray-600 rounded-full px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-full
                     w-full sm:w-auto transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
