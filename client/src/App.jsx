import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("https://demochat-production.up.railway.app");
// const socket = io.connect("http://localhost:3000");

function App() {
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [receiveMessages, setReceiveMessages] = useState([]);
  const [userId, setUserId] = useState("");

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", { message, userId });
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("message", (msg) => {
      setNote(msg.message);
      setUserId(msg.id);
    });

    socket.on("receive_message", (data) => {
      setReceiveMessages((prevMessages) => [...prevMessages, data]);
    });

    // socket.on("user_left", (data) => {
    //   setReceiveMessages((prevMessages) => [
    //     ...prevMessages,
    //     { message: data.message, system: true },
    //   ]);
    // });

    return () => {
      socket.off("message");
      socket.off("receive_message");
      socket.off("user_left");
    };
  }, [socket]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 bg-blue-500 text-white">
          <h1 className="text-lg font-semibold">Chat Application</h1>
        </div>
        <p className="text-slate-500 mx-auto">{note}</p>
        <div className="flex-1 p-4 relative bg-slate-700">
          {receiveMessages.map((msg, index) => (
            <div
            key={index}
            className={`my-2 p-1.5 rounded-xl max-w-48 ${
              msg.userId === userId ? "bg-green-100 ml-auto" : "bg-blue-100 mr-auto"
            }`}
          >
              {msg.message}
            </div>
          ))}
        </div>
        <div className="p-4 bg-blue-100 border-t border-gray-200">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={sendMessage}
            className="w-full mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
