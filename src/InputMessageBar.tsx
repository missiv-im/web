import * as React from "react";
import "./InputMessageBar.css";
// imports shards
import "bootstrap/dist/css/bootstrap.min.css";

function SendButton(props: { clearAndPushMessage: () => void }) {
  return (
    <div className="SendButton">
      <button className="btn-send" onClick={props.clearAndPushMessage}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            color="white"
            d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"
          />
        </svg>
      </button>
    </div>
  );
}

function InputMessageBar(props: { pushMessage: (value: string) => void }) {
  const [inputValue, setInputValue] = React.useState("");

  return (
    <div className="InputMessageBar">
      <div className="bar-container">
        <input
          className="w-100 input-message"
          placeholder="Ma missive"
          onChange={(evt: any) => setInputValue(evt.target.value)}
          value={inputValue}
        />
        <SendButton
          clearAndPushMessage={() => {
            setInputValue("");
            props.pushMessage(inputValue);
            window.scrollTo(0, document.body.scrollHeight);
          }}
        />
      </div>
    </div>
  );
}

export default InputMessageBar;
