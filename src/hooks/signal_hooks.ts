import { DeviceType } from "@privacyresearch/libsignal-protocol-typescript";
import { useState } from "react";
import createID from "../lib/signal/createid";
import { SignalProtocolStore } from "../lib/signal/store";

const useSignalProtocol = (name: string) => {
	const [store] = useState(new SignalProtocolStore());
	const [keyBundle, setKeyBundle] = useState<undefined | DeviceType>();

	const init = async () => {
		const bundle = await createID(name, store);
		setKeyBundle(bundle);
	};
	init();

	return { store, keyBundle, setKeyBundle };
};

export { useSignalProtocol };
