// const topic = "/murmur/1/global/proto";

import { useWaku, WakuContextProvider } from "./client";

const RelayInfos = () => {
	const { waku, status } = useWaku();
	console.log(waku, status);

	return (
		<>
			<p>Relay status: {status ? status.valueOf() : "Undefined"}</p>
			<p>Nb peers: {waku ? waku!.relay.getPeers().size : "N/A"}</p>
		</>
	);
};

function App() {
	return (
		<WakuContextProvider>
			<div className="App">
				<header className="App-header">
					<RelayInfos />
				</header>
			</div>
		</WakuContextProvider>
	);
}

export default App;
