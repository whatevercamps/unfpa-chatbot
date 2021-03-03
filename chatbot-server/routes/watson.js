// 1. Import dependencies
const atob = require("atob");
const Blob = require("cross-blob");
var express = require("express");
var router = express.Router();

const AssistantV2 = require("ibm-watson/assistant/v2");
const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
// const NaturalLanguageUnderstandingV1 = require("ibm-watson/natural-language-understanding/v1");

const { IamAuthenticator } = require("ibm-watson/auth");

// 2. Create instance

//// 2.1 Fisrt Auth

const assitantAuthenticator = new IamAuthenticator({
  apikey: process.env.WATSON_ASSISTANT_APIKEY,
});
const sttAuthenticator = new IamAuthenticator({
  apikey: process.env.IBM_SPEECH_TO_TEXT_APIKEY,
});

// const nluAuthenticator = new IamAuthenticator({
//   apikey: process.env.IBM_NATURAL_LANGUAGE_UNDERSTANDING_APIKEY,
// });

//// 2.2 Connect to assistant

const assistant = new AssistantV2({
  authenticator: assitantAuthenticator,
  serviceUrl: process.env.WATSON_ASSISTANT_URL,
  version: "2020-04-01",
});

const speechToText = new SpeechToTextV1({
  authenticator: sttAuthenticator,
  serviceUrl: process.env.IBM_SPEECH_TO_TEXT_URL,
});

// const nlu = NaturalLanguageUnderstandingV1({
//   version: "2020-08-01",
//   authenticator: nluAuthenticator,
//   serviceUrl: process.env.IBM_NATURAL_LANGUAGE_UNDERSTANDING_URL,
// });

// 3. Utils Functions
const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

// 4. Route to handle session tokens

// GET /api/watson/session
router.get("/session", (req, res, next) => {
  return assistant
    .createSession({ assistantId: process.env.WATSON_ASSISTANT_ID })
    .then((session) => res.json(session["result"]))
    .catch(next);
});

// 5. Handle Messages
const handleMessages = (req, res, next, messageText) => {
  const payload = {
    assistantId: process.env.WATSON_ASSISTANT_ID,
    sessionId: req.headers.session_id,
    input: {
      message_type: "text",
      text: messageText || req.body.message,
      options: {
        return_context: true,
      },
    },
    context: {
      skills: {
        "main skill": {
          user_defined: {
            origin: "nodejs",
            userAgeMin: req.body.userAgeMin,
            userAgeMax: req.body.userAgeMax,
            userGender: req.body.userGender,
            userName: req.body.userName,
          },
        },
      },
    },
  };

  assistant
    .message(payload)
    .then((watsonResponse) => res.json({ message: message, ...watsonResponse["result"] }))
    .catch(next);
};

// POST /api/watson/message
router.post("/message", (req, res, next) => {
  let message = { ...req.body.message };

  if (message.type && message.type.includes("audio/") && message.data) {
    const blob = b64toBlob(message.data);

    const recognizeParams = {
      audio: blob.stream(),
      contentType: message.type,
      model: "es-CO_NarrowbandModel",
      wordAlternativesThreshold: 0.9,
    };
    speechToText
      .recognize(recognizeParams)
      .then((speechRecognitionResults) => {
        console.log("stt res:", speechRecognitionResults.result);
        if (
          speechRecognitionResults.result &&
          speechRecognitionResults.result.results &&
          speechRecognitionResults.result.results.length > 0 &&
          speechRecognitionResults.result.results[0].alternatives &&
          speechRecognitionResults.result.results[0].alternatives.length > 0
        ) {
          message.text = speechRecognitionResults.result.results[0].alternatives[0].transcript;
          const payload = {
            assistantId: process.env.WATSON_ASSISTANT_ID,
            sessionId: req.headers.session_id,
            input: {
              message_type: "text",
              text: message.text,
              options: {
                return_context: true,
              },
            },
            context: {
              skills: {
                "main skill": {
                  user_defined: {
                    origin: "nodejs",
                    userAgeMin: req.body.userAgeMin,
                    userAgeMax: req.body.userAgeMax,
                    userGender: req.body.userGender,
                    userName: req.body.userName,
                  },
                },
              },
            },
          };

          console.log("final message text", { ...message, data: "" });

          assistant
            .message(payload)
            .then((watsonResponse) => res.json({ message: message, ...watsonResponse["result"] }))
            .catch(next);
        } else {
          throw new Error("No se logro obtener la data del stt");
        }
      })
      .catch((err) => {
        console.log("error:", err);
        next(err);
      });
  } else {
    handleMessages(req, res, next);
  }
});

// 5. Export routes
module.exports = router;
