import { useEffect, useState } from "react";
import useWaku from "./waku";

const useWakuPeersNumber = () => {
	const { waku } = useWaku();
	const [storePeers, setStorePeers] = useState(0);
	const [relayPeers, setRelayPeers] = useState(0);

	useEffect(() => {
		if (!waku) return;

		// Update relay peer count on heartbeat
		waku.relay.on("gossipsub:heartbeat", () => {
			setRelayPeers(waku.relay.getPeers().size);
		});

		// Update store peer when new peer connected & identified
		waku.libp2p.peerStore.on("change:protocols", async () => {
			let counter = 0;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for await (const _ of waku.store.peers) {
				counter++;
			}
			setStorePeers(counter);
		});
	}, [waku]);

	return { storePeers, relayPeers };
};

export default useWakuPeersNumber;
