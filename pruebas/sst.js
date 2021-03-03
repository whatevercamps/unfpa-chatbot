const fs = require("fs");
const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require("ibm-watson/auth");

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: "gNViDJBQ13jg0fjYVviLwp_495WFdb-8XCKyjnNT6QiM",
  }),
  serviceUrl:
    "https://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/23182b42-f860-428f-aca8-0f1cb5d84a36",
});
/* es-CO_BroadbandModel */
/* es-CO_NarrowbandModel */
const recognizeParams = {
  audio: fs.createReadStream("audio.ogg"),
  contentType: "audio/ogg",
  model: "es-MX_NarrowbandModel",
  wordAlternativesThreshold: 0.9,
  keywordsThreshold: 0.5,
};

speechToText
  .recognize(recognizeParams)
  .then((speechRecognitionResults) => {
    console.log(JSON.stringify(speechRecognitionResults, null, 2));
    if (
      speechRecognitionResults.result &&
      speechRecognitionResults.results &&
      speechRecognitionResults.results.length > 0
    ) {
      console.log(speechRecognitionResults.results[0]);
    }
  })
  .catch((err) => {
    console.log("error:", err);
  });

speechToText;
