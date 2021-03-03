import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";

import Message from "./Message";
import OptionsMessage from "./OptionsMessage";
import firstPhase from "./firstPhase";
import secondPhase from "./secondPhase";
import thirdPhase from "./thirdPhase";
import finalPhase from "./finalPhase";

export default function Conversation() {
  const refForScroll = useRef();

  const [userAge, setUserAge] = useState(null);
  const [userGender, setUserGender] = useState(null);
  const [userName, setUserName] = useState(null);

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);

  const sendWatsonMessage = (sId, message) => {
    console.log("session = ", sId);
    console.log("w message", message);

    const payload = {
      message: message,
      userName: userName,
      userAgeMin: userAge[0],
      userAgeMax: userAge[1],
      userGender: userGender,
    };

    console.log("payload", payload, JSON.stringify(payload));

    fetch("/api/watson/message", {
      method: "POST",
      headers: {
        session_id: sId,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        throw new Error("failed getting watson api response");
      })
      .then((responseJson) => {
        if (
          responseJson &&
          responseJson.output &&
          responseJson.output.generic &&
          responseJson.output.generic.length
        ) {
          const messages = [
            ...responseJson.output.generic.map((watsonResponse) => {
              return {
                sender: "bot",
                text: watsonResponse.text,
              };
            }),
            {
              sender: "user",
              input: {
                handleSubmit: presendWatsonMessage,
                placeholder: "ingresa aquí tu respuesta",
              },
            },
          ];
          addMessages(messages);
        } else {
          throw new Error("failed getting watson message response");
        }
      })
      .catch((error) => {
        console.log("login error", error);
        return false;
      });
  };

  const presendWatsonMessage = (message) => {
    console.log("message", message);
    setMessages((mss) => {
      let tempMss = mss.pop();

      tempMss = [
        ...mss,
        {
          ...tempMss,
          text:
            message.type && message.type === "audio/webm"
              ? "Nota de voz 🔈"
              : message,
        },
      ];
      console.log("mss", tempMss);
      return tempMss;
    });
    if (sessionId) {
      sendWatsonMessage(sessionId, message);
    } else {
      getSessionId()
        .then((sId) => {
          console.log("obtuve un nuevo promise sId", sId);
          sendWatsonMessage(sId, message);
        })
        .catch((err) => console.log("error", err));
    }
  };

  const getSessionId = () => {
    return new Promise((resolve, reject) => {
      fetch("/api/watson/session", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("failed getting watson api response");
        })
        .then((responseJson) => {
          if (responseJson && responseJson.session_id) {
            setSessionId(responseJson.session_id);
            console.log("sesssion creada", responseJson.session_id);
            resolve(responseJson.session_id);
          } else {
            throw new Error("failed getting watson session id");
          }
        })
        .catch((error) => {
          console.log("login error", error);
          reject(false);
        });
    });
  };

  const addMessages = (tempInitialMessages, time) => {
    setTimeout(() => {
      let initialMessages = [...tempInitialMessages];

      if (initialMessages && initialMessages.length) {
        const message = initialMessages.shift();

        if (message) {
          setMessages((m) => [...m, message]);
        }

        return addMessages(initialMessages);
      }
      return true;
    }, time || 1000 + Math.floor(Math.random() * (800 - 300) + 300));
    // }, 1);
  };

  useEffect(() => {
    if (refForScroll)
      refForScroll.current.scrollIntoView({ behavior: "smooth" });
  }, [refForScroll, messages]);

  useEffect(() => {
    if (userAge && userAge.length) {
      secondPhase(addMessages, userAge, (gender) => {
        setUserGender(gender);
      });
    }
  }, [userAge]);

  useEffect(() => {
    if (userAge && userAge.length && userGender) {
      thirdPhase(addMessages, userAge, userGender, (name) => {
        if (name) {
          setMessages((mss) => {
            let tempMss = mss.pop();

            tempMss = [...mss, { ...tempMss, text: name }];
            console.log("mss", tempMss);
            return tempMss;
          });
          setUserName(`, ${name},`);
        } else {
          setUserName(",");
        }
      });
    }
  }, [userGender]);

  useEffect(() => {
    if (userAge && userAge.length && userGender && userName) {
      finalPhase(
        addMessages,
        userAge,
        userGender,
        userName,
        presendWatsonMessage
      );
    }
  }, [userName]);

  useEffect(() => {
    firstPhase(addMessages, setMessages, (age) => {
      setUserAge(age);
    });
  }, []);

  return (
    <Container fluid className='Conversation'>
      {messages &&
        messages.length &&
        messages.map((message, index) => (
          <Row key={index}>
            <Col
              xs={message.sender === "bot" ? 9 : { offset: 1, span: 9 }}
              sm={
                message.sender === "bot"
                  ? 6
                  : message.options && message.options.length >= 4
                  ? { offset: 4, span: 8 }
                  : message.options && message.options.length >= 2
                  ? { offset: 6, span: 6 }
                  : { offset: 8, span: 4 }
              }
            >
              {message.options ? (
                <OptionsMessage
                  options={message.options}
                  nextMessage={messages[index + 1]}
                />
              ) : (
                <Message message={message} nextMessage={messages[index + 1]} />
              )}
            </Col>
          </Row>
        ))}
      <div ref={refForScroll}></div>
    </Container>
  );
}
