import * as React from "react";
import "./InputMessageBar.css";
// imports shards
import { FormInput, Button } from "shards-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
// import icons
import * as Icon from "react-bootstrap-icons";

function SendButton(props: any) {
	return (
		<div className="SendButton">
			<Button className="btn-send" pill onClick={props.pushMessage}>
				<Icon.Send />
			</Button>
		</div>
	);
}

function InputMessageBar(props: any) {
	const [inputValue, setInputValue] = React.useState("");

	return (
		<div className="InputMessageBar">
			<div className="bar-container">
				<FormInput
					className="w-100"
					placeholder="Ma missive"
					onChange={(evt: any) => setInputValue(evt.target.value)}
					value={inputValue}
				/>
				<SendButton
					pushMessage={() => {
						setInputValue("");
						props.pushMessage(inputValue);
					}}
				/>
			</div>
		</div>
	);
}

export default InputMessageBar;
