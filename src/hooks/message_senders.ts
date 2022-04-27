import { Waku, WakuMessage } from "js-waku";
import { encodeMessage as encodeHelloWorld } from "../lib/proto/hello_world";
import { encodeMessage as encodeSharePreKey } from "../lib/proto/share_prekey";
import { HellWorldTopic, SharedPreKeyTopic } from "../lib/topics";
import { useSignalProtocol } from "./signal_hooks";
import useNickName from "./useNickName";
import useWaku from "./waku";

const sendMessage = async (payload: Uint8Array, waku: Waku, topic: string) => {
	if (!waku) return false;

	// wrap it in a waku message
	const wakuMessage = await WakuMessage.fromBytes(payload, topic);
	await waku.relay.send(wakuMessage);

	return true;
};

const useHelloWorldSender = () => {
	// we suppose the dev checks whether waku is available beforehand
	const { waku } = useWaku();
	const { userId, nickName } = useNickName();

	const sendHelloWorld = (message: string) => {
		if (!waku) return;

		const payload = encodeHelloWorld({
			nickName,
			userId,
			timestamp: new Date(),
			text: message
		});

		sendMessage(payload, waku, HellWorldTopic);
	};
	return sendHelloWorld;
};

const useSharePreKeySender = () => {
	const { keyBundle } = useSignalProtocol();
	const { userId } = useNickName();
	const { waku } = useWaku();

	const sendSharedPreKey = () => {
		if (!waku) return;
		if (!keyBundle) return;

		const payload = encodeSharePreKey({
			timestamp: new Date(),
			userId,
			keyBundle
		});

		sendMessage(payload, waku, SharedPreKeyTopic);
	};

	return sendSharedPreKey;
};

export { useHelloWorldSender, useSharePreKeySender };
