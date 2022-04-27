import { DeviceType } from "@privacyresearch/libsignal-protocol-typescript";
import { WakuMessage } from "js-waku";
import protobuf from "protobufjs";

interface SharePreKeyMessage {
	timestamp: Date;
	userId: string;
	keyBundle: DeviceType;
}

// eslint-disable-next-line
const PreKeyProto = new protobuf.Type("PreKeyProto")
	.add(new protobuf.Field("keyId", 1, "number"))
	.add(new protobuf.Field("publicKey", 2, "Uint8Array"));

// eslint-disable-next-line
const SignedPreKeyProto = new protobuf.Type("SignedPreKeyProto")
	.add(new protobuf.Field("keyId", 1, "number"))
	.add(new protobuf.Field("publicKey", 2, "Uint8Array"))
	.add(new protobuf.Field("signature", 3, "Uint8Array"));

// eslint-disable-next-line
const DeviceTypeProto = new protobuf.Type("DeviceType")
	.add(new protobuf.Field("registrationId", 1, "number"))
	.add(new protobuf.Field("signedPreKey", 2, "SignedPreKeyProto"))
	.add(new protobuf.Field("preKey", 3, "PreKeyProto"))
	.add(new protobuf.Field("identityKey", 4, "Uint8Array"));

const SharePreKeyMessageProto = new protobuf.Type("SharePreKeyMessage")
	.add(new protobuf.Field("timestamp", 1, "uint64"))
	.add(new protobuf.Field("userId", 2, "string"))
	.add(new protobuf.Field("keyBundle", 4, "DeviceTypeProto"));

const decodeMessage = (msg: WakuMessage): SharePreKeyMessage | undefined => {
	if (!msg.payload) return;

	const { timestamp, userId, keyBundle } = SharePreKeyMessageProto.toObject(
		SharePreKeyMessageProto.decode(msg.payload)
	);

	const time = new Date();
	time.setTime(timestamp);

	const message: SharePreKeyMessage = { timestamp: time, userId, keyBundle };

	return message;
};

const encodeMessage = (msg: SharePreKeyMessage): Uint8Array => {
	// change the timestamp time to a number
	const formattedMessage = {
		...msg,
		timestamp: msg.timestamp.getTime()
	};

	// encode with protobuf
	const protoMsg = SharePreKeyMessageProto.create(formattedMessage);
	const payload = SharePreKeyMessageProto.encode(protoMsg).finish();

	return payload;
};

const stringify = (msg: SharePreKeyMessage): string => {
	const { keyBundle, timestamp, userId } = msg;
	const { identityKey, registrationId, signedPreKey, preKey } = keyBundle;
	const { keyId, publicKey, signature } = signedPreKey;

	const formatted = {
		timestamp,
		userId,
		keyBundle: {
			registrationId,
			identityKey: Array.from(new Uint8Array(identityKey)),
			preKey: {
				keyId: preKey?.keyId,
				publicKey: preKey ? Array.from(new Uint8Array(preKey.publicKey)) : undefined
			},
			signedPreKey: {
				keyId,
				publicKey: Array.from(new Uint8Array(publicKey)),
				signature: Array.from(new Uint8Array(signature))
			}
		}
	};

	return JSON.stringify(formatted);
};

const parse = (msg_str: string): SharePreKeyMessage => {
	return JSON.parse(msg_str);
};

export { type SharePreKeyMessage, decodeMessage, encodeMessage, stringify, parse };
export default SharePreKeyMessageProto;
