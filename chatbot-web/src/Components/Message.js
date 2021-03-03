import React from "react";

import InputMessage from "./InputMessage";

export default function Message(props, { setMessageInput }) {
  return (
    <div
      onClick={
        props.customClickEvent ? () => props.customClickEvent() : () => true
      }
      className={
        (props.message.sender === "bot"
          ? "Message bot scale-up-tl"
          : "Message user scale-up-tr") +
        (!props.nextMessage || props.nextMessage.sender !== props.message.sender
          ? " final"
          : "") +
        (props.customClickEvent ? " clickable" : "")
      }
    >
      {props.message.text ||
        (props.message.input && (
          <InputMessage
            input={props.message.input}
            finish={(input) => {
              props.message.input.handleSubmit(input);
            }}
          />
        ))}
    </div>
  );
}
