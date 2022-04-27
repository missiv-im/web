import {
	KeyHelper,
	SignedPublicPreKeyType,
	PreKeyType,
	DeviceType
} from "@privacyresearch/libsignal-protocol-typescript";
import { SignalProtocolStore } from "./store";

// to be called on client installation/registration
const createID = async (name: string, store: SignalProtocolStore) => {
	const registrationId = KeyHelper.generateRegistrationId();
	// store somewhere durable and safe "registrationId" => registrationId
	store.put("registrationId", registrationId);

	const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
	// store somewhere "identityKey" => identityKeyPair
	store.put("identityKey", identityKeyPair);

	const signedPreKeyId = Math.floor(10000 * Math.random());
	const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, signedPreKeyId);
	store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);

	const publicSignedPreKey: SignedPublicPreKeyType = {
		keyId: signedPreKeyId,
		publicKey: signedPreKey.keyPair.pubKey,
		signature: signedPreKey.signature
	};

	// generating one time use prekey and signed prekey
	const baseKeyId = Math.floor(10000 * Math.random());
	const preKey = await KeyHelper.generatePreKey(baseKeyId);
	store.storePreKey(baseKeyId, preKey.keyPair);

	const publicPreKey: PreKeyType = {
		keyId: preKey.keyId,
		publicKey: preKey.keyPair.pubKey
	};

	// Now we register this with the server so all users can see them
	// this is the object sent to the server
	return {
		registrationId,
		signedPreKey: publicSignedPreKey,
		preKey: publicPreKey,
		identityKey: identityKeyPair.pubKey
	} as DeviceType;
};

export default createID;
