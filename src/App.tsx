import { getPredefinedBootstrapNodes, Waku } from "js-waku";
import * as React from "react";

// const topic = "/murmur/1/global/proto";

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
			<header className="App-header">
				<p>Waku node's status: {wakuStatus}</p>
				<p>Nb peers: {waku ? waku!.relay.getPeers().size : ""}</p>
			</header>
		</div>
	);
}

export default App;
