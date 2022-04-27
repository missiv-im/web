import * as React from "react";
import InputMessageBar from "./InputMessageBar";
import { ReactComponent as MainIcon } from "./missive-icon.svg";
import "./App.css";
import Conversation from "./Conversation";
import Navigation from "./Navigation";
import useWaku, { ConnectionStatus } from "./hooks/waku";
import useMessageRetriever from "./hooks/useMessagesRetriever";
import { useHelloWorldSender } from "./hooks/message_senders";
import { decodeMessage as decodeHelloWorld, HelloWorldMessage } from "./lib/proto/hello_world";
import { decodeMessage as decodeSharedPreKey, SharePreKeyMessage } from "./lib/proto/share_prekey";
import useNickName from "./hooks/useNickName";
import { HellWorldTopic, SharedPreKeyTopic } from "./lib/topics";

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

const CompoLogger = () => {
	const { messages } = useMessageRetriever<SharePreKeyMessage>([SharedPreKeyTopic], decodeSharedPreKey);

	console.log("PreKeyMsg:", messages);

	return <></>;
};

interface TopicInterface {
	title: string;
}

function App() {
	const { messages } = useMessageRetriever<HelloWorldMessage>([HellWorldTopic], decodeHelloWorld);
	const { userId } = useNickName();
	const sendHelloWorld = useHelloWorldSender();

	const initialTopics: TopicInterface[] = [
		{
			title: "Louis"
		}
	];
	const [topics] = React.useState(initialTopics);

	console.log("Rendering app.tsx");

	return (
		<div className="App">
			<Header />

			<div className="App-content">
				<div className="navigation-container col-lg-2">
					<Navigation topics={topics} />
				</div>

				<div className="messages-container col-lg-10">
					<Conversation messages={messages} currentUser={userId} />
				</div>
			</div>

			<InputMessageBar
				pushMessage={(value: string) => {
					sendHelloWorld(value);
				}}
			/>
			<CompoLogger />
		</div>
	);
}

export default App;
