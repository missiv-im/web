import { getPredefinedBootstrapNodes, Waku } from "js-waku";
import * as React from "react";
import InputMessageBar from "./InputMessageBar"
import { ReactComponent as MainIcon } from "./missive-icon.svg"
import "./App.css"
import { Alert } from "shards-react";
import Conversation from "./Conversation"
import { setMaxListeners } from "process";
// const topic = "/murmur/1/global/proto";

interface Message {
	text: string;
	from: string;
}



function IndicatorStatus(props: any) {
	console.log(props.status)
	return <div>
		<div className="pin" style={{ "background": props.status != "Ready" ? "#c4c4c4" : "rgb(0, 207, 6)" }}></div>
	</div>
}

function Header(props: any) {
	return <header>
		<div className="main-icon-header-container">
			<MainIcon className="main-icon-header" />

		</div>
		<div className="right-header-container">
			<IndicatorStatus status={props.status} />

		</div>
	</header>
}





function Log(props: any) {

	const [leftTime, setLeftTime] = React.useState(0);
	const [visible, setVisible] = React.useState(true);
	React.useEffect(() => {
		console.log(props.message);
		const interval = setInterval(() => {
			setLeftTime(leftTime => leftTime + 1);
			if (leftTime > 5) {
				clearInterval(interval);
				setVisible(false);
			}
		}, 1000);
	});
	return <Alert fade={true} className="log-alert" open={visible}>{props.message + ""}</Alert>

}




function App() {
	const [waku, setWaku] = React.useState<Waku | undefined>();
	const [wakuStatus, setWakuStatus] = React.useState("None");

	React.useEffect(() => {
		if (!!waku) return;
		if (wakuStatus !== "None") return;

		setWakuStatus("Starting");

		Waku.create({ bootstrap: { peers: getPredefinedBootstrapNodes() } }).then((waku) => {
			setWaku(waku);
			setWakuStatus("Connecting");
			waku.waitForRemotePeer().then(() => {
				setWakuStatus("Ready");
			});
		});
	}, [waku, wakuStatus]);
	// gestion des messages
	let initialList: Message[];
	initialList = [];
	// simulation de conversation
	initialList = [{"text":"Hello !", "from":"Pierre"},{"text":"Hello !", "from":"Luc"}]
	let currentUser:string
	// obtention utilisateur (statique pour l'instant)
	currentUser="Pierre";
	const [list, setList] = React.useState(initialList);
	
	
	return (
		<div className="App">
			<Header status={wakuStatus} />
			<div className="App-content">


					<div className="messages-container">
						

						<Conversation messages = {list} currentUser={currentUser} />
						
						

					</div>



			</div>
			
			<InputMessageBar  pushMessage={(value:string)=>setList(list=>[...list, {"text":value, "from":currentUser}])}/>
		</div>
	);
}

export default App;
