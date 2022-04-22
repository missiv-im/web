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
	setWaku: () => {},
	status: ConnectionStatus.NotStarted,
	setStatus: () => {}
});

export const WakuContextProvider = (props: any) => {
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

export const useWaku = () => {
	const ctx = useContext(WakuContext);

	console.log("useWaku");

	useEffect(() => {
		const initWaku = async () => {
			ctx.setStatus(ConnectionStatus.Started);
			const waku = await Waku.create({
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
		if (!!ctx.waku) return;
		// If Waku status not Started, it means we are already starting Waku
		if (ctx.status !== ConnectionStatus.NotStarted) return;

		initWaku();
	}, [ctx]);

	return ctx;
};
