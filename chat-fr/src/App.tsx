import { useRef, useState } from "react";
import useSocket from "../components/useSocket"
import "./App.css";

function App() {
	const [messages, setMessages] = useState<string[]>(["hiii","ghf"]);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const { socket, loading, error} = useSocket("ws://localhost:8080")
	 
	const sendMessage = () => {
		const message = inputRef.current?.value;
		if (message && socket) {
			socket.send(
				JSON.stringify({
					type: "chat",
					payload: {
						message: message,
					}
				})
			)
			if (inputRef.current) { 
				inputRef.current.value = ""; 
			}
		}
	}

	if (socket) {
		socket.onmessage = (event: MessageEvent) => {
			setMessages((prevMessages) => [...prevMessages, event.data]);
		};
	}
     
	return (
		<div className="h-screen bg-black ">
			<br />
			<div className="h-[89vh]">
				{messages.map((message, index) => (
					<div key={index} className="m-8 p-1">
						<span className="bg-white text-black rounded px-4 py-4">{message}</span>
					</div>
				))}
			</div>
			<div className="w-full bg-white flex"> 
				<input ref={inputRef} className="flex-1 p-4" /> 
				<button onClick={sendMessage} className="bg-purple-700 text-white p-4"> 
					Send Message 
				</button> 
			</div>
				{loading && <p>Loading...</p>} 
				{error && <p>Error: {error.message}</p>} 
		</div>	
	);
}

export default App;
