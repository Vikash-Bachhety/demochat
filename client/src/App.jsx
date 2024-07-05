import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

function App() {
  const [message, setMessage] = useState("");
  const [recieveMessages, setReciveMessages] = useState([]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", { message });
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setReciveMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 bg-blue-500 text-white">
          <h1 className="text-lg font-semibold">Chat Application</h1>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {recieveMessages.map((msg, index) => (
            <div
              key={index}
              className="p-2 my-2 bg-green-100 rounded-md"
            >
              {msg}
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
