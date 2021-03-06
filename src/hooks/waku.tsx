import { createContext, useContext, useEffect, useState } from "react";
import { getPredefinedBootstrapNodes, Waku } from "js-waku";

export enum ConnectionStatus {
	NotStarted = "Not started",
	Started = "Started",
	Connecting = "Connecting",
	Connected = "Connected"
}

export type WakuContextType = {
	waku: Waku | undefined;
	setWaku: (waku: Waku) => void;
	status: ConnectionStatus;
	setStatus: (status: ConnectionStatus) => void;
};

const WakuContext = createContext<WakuContextType>({
	waku: undefined,
	setWaku: () => undefined,
	status: ConnectionStatus.NotStarted,
	setStatus: () => undefined
});

export const WakuContextProvider = (props: { children: React.ReactNode }) => {
	const [waku, setWaku] = useState<Waku | undefined>();
	const [status, setStatus] = useState(ConnectionStatus.NotStarted);

	return (
		<WakuContext.Provider
			value={{
				waku,
				setWaku,
				status,
				setStatus
			}}>
			{props.children}
		</WakuContext.Provider>
	);
};

const useWaku = () => {
	const ctx = useContext(WakuContext);

	useEffect(() => {
		const initWaku = async () => {
			ctx.setStatus(ConnectionStatus.Started);
			const waku = await Waku.create({
				libp2p: {
					config: {
						pubsub: {
							enabled: true,
							emitSelf: true
						}
					}
				},
				bootstrap: {
					peers: getPredefinedBootstrapNodes("test" as any)
				}
			});
			ctx.setWaku(waku);

			ctx.setStatus(ConnectionStatus.Connecting);
			await waku.waitForRemotePeer();
			ctx.setStatus(ConnectionStatus.Connected);
		};

		// If Waku is already assigned, the job is done
		if (ctx.waku) return;
		// If Waku status not Started, it means we are already starting Waku
		if (ctx.status !== ConnectionStatus.NotStarted) return;
		// else we init the connection
		initWaku();
	}, [ctx]);

	return ctx;
};

export default useWaku;
