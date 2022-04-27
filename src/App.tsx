import * as React from "react";
import InputMessageBar from "./InputMessageBar";
import { ReactComponent as MainIcon } from "./missive-icon.svg";
import "./App.css";
import Conversation from "./Conversation";
import Navigation from "./Navigation";
import useWaku, { ConnectionStatus } from "./hooks/waku";
import useMessageRetriever from "./hooks/useMessagesRetriever";
import { useHelloWorldSender } from "./hooks/message_senders";
import { decodeMessage as decodeSharedPreKey, SharePreKeyMessage } from "./lib/proto/share_prekey";
import { SharedPreKeyTopic } from "./lib/topics";

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

	if (messages.length == 0) return <></>;

	return (
		<>
			<p>KeyMessages: </p>
			{messages.map((msg) => {
				return msg.userId;
			})}
		</>
	);
};

interface TopicInterface {
	title: string;
}

function App() {
	const sendHelloWorld = useHelloWorldSender();

	console.log("Rendering app.ts");

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
					<Conversation />
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
