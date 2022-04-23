import { Waku, WakuMessage } from "js-waku";
import HelloWorldMessage from "../lib/proto/hello_world";
import useWaku from "./waku";

export const contentTopic = "/missive/1/test/hello_world/proto";

const sendMessage = async (message: string, timestamp: Date, waku: Waku) => {
	if (!waku) return false;

	const time = timestamp.getTime();

	// encode with protobuf
	const protoMsg = HelloWorldMessage.create({
		timestamp: time,
		text: message
	});
	const payload = HelloWorldMessage.encode(protoMsg).finish();

	// wrap it in a waku message
	const wakuMessage = await WakuMessage.fromBytes(payload, contentTopic);
	await waku.relay.send(wakuMessage);

	return true;
};

const useHelloWorldSender = () => {
	// we suppose the dev checks whether waku is available beforehand
	const { waku } = useWaku();

	const sendHelloWorld = (message: string, timestamp: Date) => sendMessage(message, timestamp, waku!);
	return sendHelloWorld;
};

export default useHelloWorldSender;
