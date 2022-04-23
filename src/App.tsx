// const topic = "/murmur/1/global/proto";

import { WakuMessage } from "js-waku";
import { useState } from "react";
import useHelloWorldSender, { contentTopic } from "./hooks/hello_world_sender";
import useMessageRetriever from "./hooks/useMessagesRetriever";
import useWaku, { ConnectionStatus, WakuContextProvider } from "./hooks/waku";
import useWakuPeersNumber from "./hooks/waku_peers_number";
import HelloWorldMessage from "./lib/proto/hello_world";

interface MessageType {
	text: string;
	timestamp: Date;
}

const decodeMessage = (msg: WakuMessage) => {
	if (!msg.payload) return;

	const { text, timestamp } = HelloWorldMessage.toObject(HelloWorldMessage.decode(msg.payload));
	const time = new Date();
	time.setTime(timestamp);
	const message: MessageType = { text, timestamp: time };

	return message;
};

const MessagesList = () => {
	const { messages } = useMessageRetriever<MessageType>([contentTopic], decodeMessage);

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
