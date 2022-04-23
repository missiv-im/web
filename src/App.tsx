import * as React from "react";
import InputMessageBar from "./InputMessageBar";
import { ReactComponent as MainIcon } from "./missive-icon.svg";
import "./App.css";
import Conversation from "./Conversation";
import Navigation from "./Navigation";
import useWaku, { ConnectionStatus } from "./hooks/waku";
import useMessageRetriever from "./hooks/useMessagesRetriever";
import useHelloWorldSender, { contentTopic } from "./hooks/hello_world_sender";
import HelloWorldMessage from "./lib/proto/hello_world";
import { WakuMessage } from "js-waku";
import useWakuPeersNumber from "./hooks/waku_peers_number";

// const topic = "/murmur/1/global/proto";

interface Message {
	timestamp: Date;
	text: string;
}

const decodeMessage = (msg: WakuMessage) => {
	if (!msg.payload) return;

	const { text, timestamp } = HelloWorldMessage.toObject(HelloWorldMessage.decode(msg.payload));
	const time = new Date();
	time.setTime(timestamp);
	const message: Message = { text, timestamp: time };

	return message;
};

function IndicatorStatus() {
	const { status } = useWaku();

	return (
		<div>
			<div
				className="pin"
				style={{
					background: status !== ConnectionStatus.Connected ? "#c4c4c4" : "rgb(0, 207, 6)"
				}}></div>
		</div>
	);
}

function Header() {
	return (
		<header>
			<div className="main-icon-header-container">
				<MainIcon className="main-icon-header" />
			</div>
			<div className="right-header-container">
				<IndicatorStatus />
			</div>
		</header>
	);
}

interface TopicInterface {
	title: string;
}

function App() {
	const { messages } = useMessageRetriever<Message>([contentTopic], decodeMessage);
	const { relayPeers, storePeers } = useWakuPeersNumber();
	const sendHelloWorld = useHelloWorldSender();

	console.log(messages);

	React.useEffect(() => {
		console.log(`Relay: ${relayPeers}, Store: ${storePeers}`);
	}, [relayPeers, storePeers]);

	// simulation de conversation
	let currentUser: string;
	// obtention utilisateur (statique pour l'instant)
	currentUser = "Pierre";

	const initialTopics: TopicInterface[] = [
		{
			title: "Louis"
		}
	];
	const [topics] = React.useState(initialTopics);

	return (
		<div className="App">
			<Header />

			<div className="App-content">
				<div className="navigation-container col-lg-2">
					<Navigation topics={topics} />
				</div>

				<div className="messages-container col-lg-10">
					<Conversation messages={messages} currentUser={currentUser} />
				</div>
			</div>

			<InputMessageBar pushMessage={(value: string) => sendHelloWorld(value, new Date())} />
		</div>
	);
}

export default App;
