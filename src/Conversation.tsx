import * as React from "react";
import "./Conversation.css";
// imports shards
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
// import icons
//import images
import AvatarClassicIcon from "./avatar.png";
import { HelloWorldMessage } from "./lib/proto/hello_world";

const Emoji = (props: {
  label: string;
  toclick: () => void;
  symbol: string;
}) => (
  <span
    className="emoji"
    role="img"
    aria-label={props.label ? props.label : ""}
    aria-hidden={props.label ? "false" : "true"}
    onClick={(e) => {
      e.stopPropagation();
      props.toclick();
    }}
  >
    {props.symbol}
  </span>
);

function Reactions(props: {
  displayed: boolean;
  innerRef: React.RefObject<HTMLDivElement>;
  setterReaction: (value: string) => void;
}) {
  console.log("[INFO] REactions is created");

  if (props.displayed === true) {
    return (
      <div className="reactions" ref={props.innerRef}>
        <Emoji
          symbol="❤️"
          label="red heart"
          toclick={() => {
            props.setterReaction("❤️");
          }}
        />
        <Emoji
          symbol="😄"
          label="laugh"
          toclick={() => {
            props.setterReaction("😄");
          }}
        />
        <Emoji
          symbol="😢"
          label="cry"
          toclick={() => props.setterReaction("😢")}
        />
      </div>
    );
  } else {
    return <div></div>;
  }
}

function ActiveReaction(props: { value: string }) {
  if (props.value !== "") {
    return <div className="active-reaction">{props.value}</div>;
  } else {
    return null;
  }
}

function MessageLine(props: {
  message: HelloWorldMessage;
  currentUser: string;
}) {
  const [displayStatus, setDisplayStatus] = React.useState(false);

  const myRef = React.useRef<HTMLDivElement>(null);
  const setClickedOutside = (bool: boolean) => {
    if (bool) {
      setDisplayStatus(false);
    }
  };
  const handleClickOutside = (e: any) => {
    const myref = myRef.current;

    if (myref && !myref.contains(e.target)) {
      setClickedOutside(true);
    }
  };
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const [activeReact, setActiveReact] = React.useState("");

  const setReact = async (value: string) => {
    // on affiche le react actif
    setActiveReact(value);
    // on masque la barre avec tous les reacts
    setDisplayStatus(false);
  };

  return (
    <div
      className={
        "message-line " +
        (props.message.userId !== props.currentUser ? "left-guy" : "right-guy")
      }
    >
      <div className="avatar">
        <img className="avatar-icon" src={AvatarClassicIcon} alt="Avatar" />
      </div>
      <div
        className="message-box"
        onClick={() => {
          setDisplayStatus(true);
        }}
      >
        {props.message.text}
        <Reactions
          innerRef={myRef}
          displayed={displayStatus}
          setterReaction={setReact}
        />
        <ActiveReaction value={activeReact} />
      </div>
      {/* <div className="nickname" style={{ color: "black", fontSize: "0.8em" }}>
				{props.message.nickName}
			</div> */}
    </div>
  );
}

function Conversation(props: {
  messages: HelloWorldMessage[];
  currentUser: string;
}) {
  const messagesEndRef = React.useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    } else {
      console.log("scrolling not possible, container null");
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [props.messages]);
  return (
    <div ref={messagesEndRef} className="intermediate-box">
      <div className="sub-intermediate-box">
        {props.messages.map((item: HelloWorldMessage, i: number) => (
          <MessageLine key={i} message={item} currentUser={props.currentUser} />
        ))}
      </div>
    </div>
  );
}

export default Conversation;
