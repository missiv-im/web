import { DeviceType } from "@privacyresearch/libsignal-protocol-typescript";
import React, { createContext, useContext } from "react";
import createID from "../lib/signal/createid";
import { SignalProtocolStore } from "../lib/signal/store";
import useLocalForage from "./uselocalforage";

export type SignalContextType = {
	store: SignalProtocolStore;
	keyBundle: DeviceType | undefined;
	setKeyBundle: (bundle: DeviceType) => void;
};

const SignalProtocolContext = createContext<SignalContextType>({
	store: new SignalProtocolStore(),
	keyBundle: undefined,
	setKeyBundle: () => undefined
});

export const SignalProtocolContextProvider = (props: { children: React.ReactNode }) => {
	const initKeyBundle = async () => {
		// TODO: change username
		const bundle = await createID("userName", store);
		setKeyBundle(bundle);
	};

	const [store] = useLocalForage("store", new SignalProtocolStore());
	const [keyBundle, setKeyBundle] = useLocalForage("keyBundle", () => {
		initKeyBundle();
		return undefined;
	});

	return (
		<SignalProtocolContext.Provider
			value={{
				store,
				keyBundle,
				setKeyBundle
			}}>
			{props.children}
		</SignalProtocolContext.Provider>
	);
};

const useSignalProtocol = () => {
	const { store, keyBundle, setKeyBundle } = useContext(SignalProtocolContext);

	return { store, keyBundle, setKeyBundle };
};

export { useSignalProtocol };
