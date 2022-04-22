// const topic = "/murmur/1/global/proto";

import { useWaku, WakuContextProvider } from "./hooks/waku";
import { useWakuPeersNumber } from "./hooks/waku_peers_number";

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
