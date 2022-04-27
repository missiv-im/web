# Signal encryption protocol

> We use the work done by [privacyresearchgroup](https://github.com/privacyresearchgroup) over the signal protocol with their library [libsignal-protocol-typescript](https://github.com/privacyresearchgroup/libsignal-protocol-typescript)

This page will explain how we use the signal protocol in the application and how we take a different direction using a decentralized network instead of a central server to hold user's keys.

## Types of data used in the protocol

-   `PreKey`: stored by the "server", a public key associated to an unique id. Can be signed. At installation, the client generates a single signed prekey and a list of one-time use prekeys
-   `Session`: unidirectional signal session between two users. Should not be teared down. A session can be instantiate in two ways; either a preKeyBundle, or a preKeySignalMessage.

## How to create an identity

In order to identify an user on a network and allow people to talk with this user using encryption, there are a few things that need to be set up.

The signal protocol requires two variables to be set in order to identify an user:

-   `registrationId` (number): an unique id number
-   `identityKeyPair` (pubKey, privKey): a pair of private and public key (this should be kept secure)

Then in order to prove the identity of the user, we have to generate a signed prekey with our private key. Then we have a public signed prekey we can share to give people a way to encrypt their message using the user's public key and verifying the key with a signature:

```ts
const publicSignedPreKey: = {
    keyId: signedPreKeyId,
    publicKey: signedPreKey.keyPair.pubKey,
    signature: signedPreKey.signature
};
```

Then we generate a one-time use prekey to be used by other people to encrypt their message (one key pair per message):

```ts
const publicPreKey = {
	keyId: preKey.keyId,
	publicKey: preKey.keyPair.pubKey
};
```

Everything is setup on the user's side in order to have an identity compatible with the signal protocol.

To sum up an user identity is made of :

-   `registrationId`: unique id
-   `identityKeyPair`: pub/priv keys to identify the user
-   `publicSignedPreKey`: public key to communicate with the user and signed with their private key
-   `preKey`: a one time usage key to ....

## How to encrypt data

The first step is to create a session between two users. A session is unidirectional so in order to have a conversation, we will have to setup sessions in both ways.

In the case in which alice wants to contact bob :

```ts
const bobAddress = new SignalProtocolAddress("bob", 1);
const aliceSessionBuilder = new SessionBuilder(aliceStore, bobAddress);
```

Then we grab bob's key bundle in order to initiate a session using bob's prekeys. If the identity changed, it will trigger an error:

```ts
const bobKeyBundle = directory.get("bob);
await aliceSessionBuilder.processPreKey(bobKeyBundle);
```

If no error shows, we have successfully created a session on alice's side. The next step is to create the cipher to encrypt the message:

```ts
const aliceSessionCipher = new SessionCipher(aliceStore, bobAddress);
const cipherText = await aliceSessionCipher.encrypt(new TextEncoder().encode("Hello bob!").buffer);
```

And it's done, we have an encrypted message using Bob's public preshared key.

## How to decrypt data

The process to decrypt a message is nearly the same as encrypting it. We have to setup the session builder, then the session cipher and decrypt the message's content.

```ts
const aliceAddress = new SignalProtocolAddress("alice", 1);
const bobSessionBuilder = new SessionBuilder(bobStore, aliceAddress);

const aliceKeyBundle = directory.get("alice");
await bobSessionBuilder.processPreKey(aliceKeyBundle);

const bobSessionCipher = new SessionCipher(bobStore, bobAddress);

const plainTextBuffer = await bobSessionCipher.decryptPreKeyWhisperMessage(message.body);
const plainText = new TextDecoder().decode(plainTextBuffer);
```

And that's it we can now decrypt ciphered data with the signal protocol.
