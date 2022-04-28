import * as React from "react";
import InputMessageBar from "./InputMessageBar";
import { ReactComponent as MainIcon } from "./missive-icon.svg";
import "./App.css";
import Conversation from "./Conversation";
import Navigation, { TopicInterface } from "./Navigation";
import useWaku, { ConnectionStatus } from "./hooks/waku";
import useMessageRetriever from "./hooks/useMessagesRetriever";
import useHelloWorldSender, { contentTopic } from "./hooks/hello_world_sender";
import { decodeMessage, HelloWorldMessage } from "./lib/proto/hello_world";
import useNickName from "./hooks/useNickName";

function IndicatorStatus() {
  const { status } = useWaku();

  return (
    <div>
      <div
        className="pin"
        style={{
          background:
            status !== ConnectionStatus.Connected
              ? "#c4c4c4"
              : "rgb(0, 207, 6)",
        }}
      ></div>
    </div>
  );
}

function Header() {
  return (
    <header>
      <div className="main-icon-header-container">
        <MainIcon className="main-icon-header" />
      </div>
      <div className="right-header-container">
        <IndicatorStatus />
      </div>
    </header>
  );
}

function App() {
  const { messages } = useMessageRetriever<HelloWorldMessage>(
    [contentTopic],
    decodeMessage
  );
  const sendHelloWorld = useHelloWorldSender();
  const { userId } = useNickName();

  const initialTopics: TopicInterface[] = [
    {
      title: "Louis",
    },
    {
      title: "Marc",
    },
  ];
  const [topics] = React.useState(initialTopics);

  return (
    <div className="App">
      <Header />

      <div className="App-content">
        <div className="navigation-container col-lg-3">
          <Navigation topics={topics} />
        </div>

        <div className="col-lg-9 messages-side-container">
          <div className="messages-container">
            <Conversation messages={messages} currentUser={userId} />
          </div>
          <InputMessageBar
            pushMessage={(value: string) => sendHelloWorld(value)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
