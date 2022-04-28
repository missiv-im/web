import "./Navigation.css";
import * as React from "react";
import AvatarConvIcon from "./avatar.png";
function Topic(props: any) {
  return (
    <div className="topic">
      <div className="head-topic">{props.name.title}</div>
      <div className="content-topic">Hello, comment vas ...</div>
    </div>
  );
}
export interface TopicInterface {
  title: string;
}

function Navigation(props: any) {
  return (
    <div className="navigation">
      <div className="search-bar">
        <input
          className="navigation-input"
          placeholder="Vos espaces...."
        ></input>
      </div>
      <div className="topics-links">
        {props.topics.map(function (item: any, i: any) {
          const getConvLine = (itemb: any) => (
            <div className="conversation-link-container">
              <div className="avatar-conv">
                <img
                  className="avatar-conv-icon"
                  src={AvatarConvIcon}
                  alt="Avatar"
                />
              </div>
              <Topic name={itemb} />
            </div>
          );
          if (i !== props.topics.length - 1) {
            return (
              <React.Fragment key={i}>
                {getConvLine(item)}
                <div className="topics-separator"></div>
              </React.Fragment>
            );
          } else {
            return <React.Fragment key={i}>{getConvLine(item)}</React.Fragment>;
          }
        })}
      </div>
    </div>
  );
}

export default Navigation;
