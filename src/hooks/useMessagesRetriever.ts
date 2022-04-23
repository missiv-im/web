import { WakuMessage } from "js-waku";
import { useCallback, useEffect, useState } from "react";
import { fetchStoredMessages } from "../lib/waku_utils";
import { useMessageReceiver } from "./useMessageReceiver";
import useWaku, { ConnectionStatus } from "./waku";
import useWakuPeersNumber from "./waku_peers_number";

const useMessageRetriever = <Type>(topics: string[], messageDecoder: (msg: WakuMessage) => Type | undefined) => {
	const { waku, status } = useWaku();
	const { storePeers } = useWakuPeersNumber();
	const [messages, setMessages] = useState<Type[]>([]);
	const [historicalMessagesRetrieved, setHistoricalMessagesRetrieved] = useState(false);

	const addMessage = useCallback(
		(msg: Type) => {
			setMessages(messages.concat(msg));
		},
		[messages]
	);

	// setup histo message query
	useEffect(() => {
		if (historicalMessagesRetrieved) return;
		if (!waku) return;
		if (status !== ConnectionStatus.Connected) return;
		if (storePeers === 0) return;

		const processStoreMessage = async (wm: WakuMessage[]) => {
			const histoMessages = wm.map(messageDecoder).filter((msg) => msg !== undefined) as Type[];

			console.log(histoMessages);

			setMessages(messages.concat(histoMessages));
		};

		fetchStoredMessages(waku, topics, processStoreMessage).then((returnValue) => {
			if (returnValue !== -1) {
				setHistoricalMessagesRetrieved(true);
			}
		});
	}, [waku, status, historicalMessagesRetrieved, messages, messageDecoder, topics, storePeers]);

	// setup listener for new messages
	const processMessages = useCallback(
		(wakuMessage: WakuMessage) => {
			const msg = messageDecoder(wakuMessage);
			if (!msg) return;

			addMessage(msg);
		},
		[addMessage, messageDecoder]
	);
	useMessageReceiver(topics, processMessages);

	return { messages, addMessage, setMessages };
};

export default useMessageRetriever;
