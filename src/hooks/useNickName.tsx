import { createContext, useContext } from "react";
import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { v4 as uuid4 } from "uuid";
import useLocalForage from "./uselocalforage";

export type NickNameContextType = {
	userId: string;
	setUserId: (value: string) => void;
	nickName: string;
	setNickName: (value: string) => void;
};

const NickNameContext = createContext<NickNameContextType>({
	userId: "",
	setUserId: () => undefined,
	nickName: "",
	setNickName: () => undefined
});

export const NickNameContextProvider = (props: { children: React.ReactNode }) => {
	const [userId, setUserId] = useLocalForage("userId", uuid4());
	const [nickName, setNickName] = useLocalForage("nickname", generateNick());

	return (
		<NickNameContext.Provider
			value={{
				userId,
				setUserId,
				nickName,
				setNickName
			}}>
			{props.children}
		</NickNameContext.Provider>
	);
};

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
	const { nickName, setNickName, userId, setUserId } = useContext(NickNameContext);
	return { nickName, setNickName, userId, setUserId };
};

export default useNickName;
