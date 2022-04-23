import { Waku, WakuMessage } from "js-waku";

export const fetchStoredMessages = (waku: Waku, topics: string[], message_processor: (m: WakuMessage[]) => void) => {
	// set start time to one week ago
	const startTime = new Date();
	startTime.setTime(startTime.getTime() - 7 * 24 * 60 * 60 * 1000);

	const res = waku.store
		.queryHistory(topics, {
			callback: message_processor,
			timeFilter: { startTime, endTime: new Date() }
		})
		.then((res) => res.length)
		.catch(() => -1);

	return res;
};
