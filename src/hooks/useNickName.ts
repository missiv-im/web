import { useEffect, useState } from "react";
import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { v4 as uuid4 } from "uuid";

const generateNick = () => {
	const name = uniqueNamesGenerator({
		dictionaries: [adjectives, colors, animals],
		separator: " ",
		length: 3,
		style: "capital"
	});

	return name;
};

const useNickName = () => {
	const [userId, setUserId] = useState<string>(() => {
		const persistedId = window.localStorage.getItem("userId");
		return persistedId !== null ? persistedId : uuid4();
	});

	const [nickName, setNickName] = useState<string>(() => {
		const persistedNick = window.localStorage.getItem("nickname");
		return persistedNick !== null ? persistedNick : generateNick();
	});

	// save nickname to disk when the nickname changes
	useEffect(() => {
		localStorage.setItem("nickname", nickName);
	}, [nickName]);
	// save userId to disk when the uuid changes
	useEffect(() => {
		localStorage.setItem("userId", userId);
	}, [userId]);

	return { nickName, setNickName, userId, setUserId };
};

export default useNickName;
