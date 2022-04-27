import { useEffect, useState } from "react";
import localForage from "localforage";

const useLocalForage = (key: string, initialValue?: any) => {
	const [storedValue, setStoredValue] = useState(initialValue);

	useEffect(() => {
		const fetchStoredData = async () => {
			try {
				const value = await localForage.getItem(key);
				setStoredValue(value);
			} catch {
				return initialValue;
			}
		};
		fetchStoredData();
	}, [initialValue, storedValue, key]);

	const set = (value: any) => {
		const setStoredData = async () => {
			try {
				await localForage.setItem(key, value);
				setStoredValue(value);
			} catch {
				return initialValue;
			}
		};
		setStoredData();
	};

	const remove = () => {
		const removeData = async () => {
			try {
				await localForage.removeItem(key);
				setStoredValue(null);
			} catch {
				return;
			}
		};
		removeData();
	};

	return [storedValue, set, remove];
};

export default useLocalForage;
