// const topic = "/murmur/1/global/proto";

import { WakuMessage } from "js-waku";
import { useCallback, useState } from "react";
import useHelloWorldSender, { contentTopic } from "./hooks/hello_world_sender";
import useMessageReceiver from "./hooks/receive_message";
import useWaku, { ConnectionStatus, WakuContextProvider } from "./hooks/waku";
import useWakuPeersNumber from "./hooks/waku_peers_number";
import HelloWorldMessage from "./lib/proto/hello_world";

interface MessageType {
	text: string;
	timestamp: Date;
}

const RelayInfos = () => {
	const { status } = useWaku();
	const { relayPeers, storePeers } = useWakuPeersNumber();

	return (
		<>
			<p>Relay status: {status.valueOf()}</p>
			<p>Nb relay peers: {relayPeers}</p>
			<p>Nb store peers: {storePeers}</p>
		</>
	);
};

const MessagesList = () => {
	const [messages, setMessages] = useState<MessageType[]>([]);

	const processMessages = useCallback(
		(wakuMessage: WakuMessage) => {
			if (!wakuMessage.payload) return;

			const { text, timestamp } = HelloWorldMessage.toObject(HelloWorldMessage.decode(wakuMessage.payload));
			const time = new Date();
			time.setTime(timestamp);
			const message = { text, timestamp: time };

			console.log(message);

			const updatedMessages = messages.concat(message);
			setMessages(updatedMessages);
		},
		[messages]
	);
	useMessageReceiver([contentTopic], processMessages);

	return (
		<div>
			{messages.map(({ text, timestamp }) => {
				return (
					<div key={timestamp.getTime()}>
						<p>{`${timestamp} -> ${text}`}</p>
					</div>
				);
			})}
		</div>
	);
};

const MessageSender = () => {
	const [inputValue, setInputValue] = useState("");
	const sendHelloWorld = useHelloWorldSender();
	const { status } = useWaku();

	const send = async () => {
		if (status !== ConnectionStatus.Connected) return;

		const timestamp = new Date();
		const message = inputValue;
		await sendHelloWorld(message, timestamp);
		setInputValue("");
	};

	return (
		<div>
			<input type="text" value={inputValue} onChange={(evt) => setInputValue(evt.target.value)} />
			<button onClick={send}>Send</button>
		</div>
	);
};

function App() {
	return (
		<WakuContextProvider>
			<div className="App">
				<header className="App-header">
					<RelayInfos />
					<hr />
					<p>Messages</p>
					<MessagesList />
					<hr />
					<MessageSender />
				</header>
			</div>
		</WakuContextProvider>
	);
}

export default App;
