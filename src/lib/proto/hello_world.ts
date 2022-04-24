import { WakuMessage } from "js-waku";
import protobuf from "protobufjs";

interface HelloWorldMessage {
	timestamp: Date;
	userId: string;
	nickName: string;
	text: string;
}

const HelloWorldMessageProto = new protobuf.Type("HelloWorldMessage")
	.add(new protobuf.Field("timestamp", 1, "uint64"))
	.add(new protobuf.Field("userId", 2, "string"))
	.add(new protobuf.Field("nickName", 3, "string"))
	.add(new protobuf.Field("text", 4, "string"));

const decodeMessage = (msg: WakuMessage): HelloWorldMessage | undefined => {
	if (!msg.payload) return;

	const { text, timestamp, userId, nickName } = HelloWorldMessageProto.toObject(
		HelloWorldMessageProto.decode(msg.payload)
	);

	const time = new Date();
	time.setTime(timestamp);

	const message: HelloWorldMessage = { text, timestamp: time, userId, nickName };

	return message;
};

const encodeMessage = (msg: HelloWorldMessage): Uint8Array => {
	// change the timestamp time to a number
	const formattedMessage = {
		...msg,
		timestamp: msg.timestamp.getTime()
	};

	// encode with protobuf
	const protoMsg = HelloWorldMessageProto.create(formattedMessage);
	const payload = HelloWorldMessageProto.encode(protoMsg).finish();

	return payload;
};

export { type HelloWorldMessage, decodeMessage, encodeMessage };
export default HelloWorldMessageProto;
