import { WakuMessage } from "js-waku";
import { useEffect } from "react";
import useWaku from "../hooks/waku";

export const useMessageReceiver = (topics: string[], message_processor: (m: WakuMessage) => void) => {
	const { waku, status } = useWaku();

	useEffect(() => {
		if (!waku) return;

		waku.relay.addObserver(message_processor, topics);

		// cleanup
		return () => {
			waku.relay.deleteObserver(message_processor, topics);
		};
	}, [waku, status, message_processor, topics]);
};
