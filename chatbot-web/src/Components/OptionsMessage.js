import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import Message from "./Message";

export default function OptionsMessage(props) {
  return (
    <div className='OptionsMessage'>
      <Row>
        {props.options.map((option, index) => {
          return (
            <Col key={index} lg={Math.round(12 / (props.options.length || 1))}>
              <Message
                customClickEvent={option.onClick}
                message={option.message}
                nextMessage={props.nextMessage}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
