// import { disconnect } from "mongoose";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("https://demochat-production.up.railway.app");
// const socket = io.connect("http://localhost:3000");

function App() {
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [receiveMessages, setReceiveMessages] = useState([]);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [enteredName, setEnteredName] = useState(false);
  const [disconnectMsg, setDisconnectMsg] = useState("");

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", { message, userId, username });
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
   
    socket.on("user_left", (data) => {
      setDisconnectMsg(username+data.message);
    });

    return () => {
      socket.off("message");
      socket.off("receive_message");
      socket.off("user_left");
    };
  }, []);

  const enterName = () => {
    if (username.trim() !== "") {
      setEnteredName(true);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800 p-4">
      {!enteredName ? (
        <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-xl font-semibold mb-4 text-gray-700">Enter Your Name</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 mb-4"
          />
          <button
            onClick={enterName}
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 bg-blue-500 text-white">
            <h1 className="text-lg font-semibold">Gapshap</h1>
            <p className="text-sm">Hello, {username}</p>
            <p>{disconnectMsg}</p>
          </div>
          <p className="text-slate-500 mx-auto">{note}</p>
          <div className="flex-1 max-h-80 md:max-h-96 p-4 relative bg-slate-700 overflow-y-auto">
            {receiveMessages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 px-2 p-1.5 rounded-xl max-w-[45%] break-words ${
                  msg.userId === userId ? "bg-teal-100 ml-auto" : "bg-yellow-50 mr-auto text-wrap"
                }`}
              >
                <p className="text-xs text-gray-500">{msg.username}</p>
                <p>{msg.message}</p>
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
      )}
    </div>
  );
}

export default App;
