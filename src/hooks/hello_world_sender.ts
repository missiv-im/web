import { Waku, WakuMessage } from "js-waku";
import { encodeMessage } from "../lib/proto/hello_world";
import useNickName from "./useNickName";
import useWaku from "./waku";

export const contentTopic = "/missive/1/test/hello_world_2/proto";

const sendMessage = async (payload: Uint8Array, waku: Waku) => {
	if (!waku) return false;

	// wrap it in a waku message
	const wakuMessage = await WakuMessage.fromBytes(payload, contentTopic);
	await waku.relay.send(wakuMessage);

	return true;
};

const useHelloWorldSender = () => {
	// we suppose the dev checks whether waku is available beforehand
	const { waku } = useWaku();
	const { userId, nickName } = useNickName();

	const sendHelloWorld = (message: string) => {
		const payload = encodeMessage({
			nickName,
			userId,
			timestamp: new Date(),
			text: message
		});

		sendMessage(payload, waku!);
	};
	return sendHelloWorld;
};

export default useHelloWorldSender;
