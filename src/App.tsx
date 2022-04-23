import { getPredefinedBootstrapNodes, Waku } from "js-waku";
import * as React from "react";
import InputMessageBar from "./InputMessageBar"

import "./App.css"
import { Alert } from "shards-react";
// const topic = "/murmur/1/global/proto";

function Header(){
	return <header></header>
}

function Log(props:any){
	
	const [leftTime, setLeftTime] = React.useState(0);
	const [visible, setVisible] = React.useState(true);
	React.useEffect(() => {
		console.log(props.message);
		const interval = setInterval(() => {
		  setLeftTime(leftTime=> leftTime + 1);
		  if (leftTime >5){
			clearInterval(interval);
			setVisible(false)	;
		  }
		}, 1000);
	});
		return <Alert fade={true} className="log-alert" open={visible}>{props.message+""}</Alert>
	
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

	return (
		<div className="App">
			<Header />
			<div className="App-content">
			
			<div className="App-header">
				
				<Log message={"Waku node's status: "+ wakuStatus}/>
				<Log message={"Nb peers:" + (waku ? waku!.relay.getPeers().size : "") + ""}/>
				
				
				
			</div>
			</div>
			
			<InputMessageBar />
		</div>
	);
}

export default App;
