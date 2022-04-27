import { SignalProtocolAddress, SessionBuilder, SessionCipher } from "@privacyresearch/libsignal-protocol-typescript";
import createID from "./createid";
import { SignalProtocolStore } from "./store";

const testSignal = async () => {
	const addressStore = new Map<string, SignalProtocolAddress>();
	const aliceStore = new SignalProtocolStore();
	const bobStore = new SignalProtocolStore();

	/* ----------------------------------- */

	// Creating IDs
	console.log("[+] Creating IDs");
	const aliceAddress = new SignalProtocolAddress("alice", 1);
	addressStore.set("alice", aliceAddress);
	const aliceKeyBundle = await createID("alice", aliceStore);

	const bobAddress = new SignalProtocolAddress("bob", 1);
	addressStore.set("bob", bobAddress);
	const bobKeyBundle = await createID("bob", bobStore);

	/* ----------------------------------- */

	// creating a session : Alice -> Bob
	console.log("[+] Creating a session Alice --> Bob");
	const aliceSessionBuilder = new SessionBuilder(aliceStore, bobAddress);
	// Process a prekey fetched from the server. Returns a promise that resolves
	// once a session is created and saved in the store, or rejects if the
	// identityKey differs from a previously seen identity for this address.
	console.log("[+] Processing bob's key bundle");
	await aliceSessionBuilder.processPreKey(bobKeyBundle!);

	console.log("[+] Creating session cipher");
	const aliceSessionCipher = new SessionCipher(aliceStore, bobAddress);
	const cipherText = await aliceSessionCipher.encrypt(new TextEncoder().encode("Hello bob!").buffer);

	console.log("=> Encrypted message: ", cipherText);

	/* ----------------------------------- */

	console.log("[+] Creating a session Bob --> Alice");
	const bobSessionBuilder = new SessionBuilder(bobStore, aliceAddress);
	console.log("[+] Processing alice's key bundle");
	await bobSessionBuilder.processPreKey(aliceKeyBundle);

	console.log("[+] Creating session cipher");
	const bobSessionCipher = new SessionCipher(bobStore, aliceAddress);
	const plainTextBuffer = await bobSessionCipher.decryptPreKeyWhisperMessage(cipherText.body!);
	const plainText = new TextDecoder().decode(plainTextBuffer);

	console.log("=> Decrypted message: ", plainText);
};

export default testSignal;
