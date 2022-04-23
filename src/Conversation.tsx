import * as React from "react";
import "./Conversation.css"
// imports shards
import { FormInput, Button } from "shards-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
// import icons
import * as Icon from 'react-bootstrap-icons';
//import images
import AvatarClassicIcon from "./avatar.png"
import Message from "./App"


const Emoji = (props:any) => (
    <span
        className="emoji"
        role="img"
        aria-label={props.label ? props.label : ""}
        aria-hidden={props.label ? "false" : "true"}
    >
        {props.symbol}
    </span>
);

function Reactions(props:{displayed:any, ref:any}){

	
	
	if (props.displayed){
		return <div className="reaction">
			<Emoji symbol="❤️" label="red heart" onClick=""/>
			<Emoji symbol="😄" label="laugh"/>
			<Emoji symbol="😢" label="laugh"/>
		</div>
	}
	else {
	return null
	}
}

function MessageLine(props:any){

	const [displayStatus, setdisplayStatus] = React.useState(false)

	const myRef = React.useRef<HTMLDivElement>(null);
	const setClickedOutside = (bool:Boolean) =>{
		if (bool){
			console.log("ok");
			setdisplayStatus(false)
		}
	}
    const handleClickOutside = (e:any) => {
		const myref = myRef.current;
		console.log("here")
        if (myref && myref.contains(e.target)) {
            setClickedOutside(true);
        }
    };
	React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    });

	

	return <div className={"message-line "+ (props.message.from == props.currentUser?"left-guy":"right-guy")}>
		<div className="avatar">
			<img className="avatar-icon" src={AvatarClassicIcon}/>
		</div>
		<div className="message-box" onClick={()=>setdisplayStatus(true)} >
			{props.message.text}
			<Reactions ref={myRef} displayed={displayStatus} />
		</div>
	</div>
}

function Conversation(props:any){
	
    return <div className="intermediate-box">

	{props.messages.map((item:any, i:any) => (
							<MessageLine key={i} message={item} currentUser = {props.currentUser}/>
						))}
						</div>
}


export default Conversation;
