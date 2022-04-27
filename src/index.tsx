import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// css imports

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import { WakuContextProvider } from "./hooks/waku";
import { SignalProtocolContextProvider } from "./hooks/signal_hooks";
import localforage from "localforage";

localforage.config({
	driver: localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
	name: "missiv.im",
	version: 1.0,
	storeName: "keyvaluepairs", // Should be alphanumeric, with underscores.
	description: "some description"
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<WakuContextProvider>
			<SignalProtocolContextProvider>
				<App />
			</SignalProtocolContextProvider>
		</WakuContextProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
