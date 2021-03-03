import React, { useRef, useEffect, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import SendIcon from "@material-ui/icons/Send";
import KeyboardVoiceIcon from "@material-ui/icons/KeyboardVoice";

export default function VoiceRecorder({
  voiceNote,
  classes,
  recording,
  setRecording,
  setAudioMessage,
  sendAudioMessage,
}) {
  const audioRef = useRef();
  const [items, setItems] = useState([]);
  const [recorder, setRecorder] = useState(null);
  const [preRecording, setPreRecording] = useState(false);
  const [recDuration, setRecDuration] = useState(0);
  const [recMinutes, setRecMinutes] = useState(0);
  const [recSeconds, setRecSeconds] = useState(0);
  const [recDurationInterval, setRecDurationInterval] = useState(null);

  const initRecorder = () => {
    const device = navigator.mediaDevices.getUserMedia({ audio: true });

    device.then((stream) => {
      let recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        setItems((i) => [...i, e.data]);
      };

      setRecorder(recorder);
    });
  };

  useEffect(() => {
    if (recording) {
      setRecDurationInterval(
        setInterval(() => {
          setRecDuration((rD) => rD + 1);
        }, 1000)
      );
    } else if (recDurationInterval) {
      clearInterval(recDurationInterval);
      setRecDurationInterval(null);
    }
  }, [recording]);

  useEffect(() => {
    if (preRecording) {
      setPreRecording(false);
      startRecord();
    }
  }, [recorder]);

  useEffect(() => {
    if (recDuration) {
      setRecMinutes(Math.floor(recDuration / 60));
      setRecSeconds(Math.floor(recDuration % 60));
    } else {
      setRecMinutes(0);
      setRecSeconds(0);
    }
  }, [recDuration]);

  const startRecord = () => {
    if (recorder) {
      setRecording(true);
      recorder.start(100);
    } else {
      setPreRecording(true);
      initRecorder();
    }
  };

  const stopRecord = () => {
    if (recorder) {
      recorder.stop();
      setAudioMessage(items);
      setRecording(false);
    }
  };

  const preSendAudioMessage = () => {
    if (!recording && items.length) {
      const blob = new Blob(items, { type: "audio/webm" });

      const reader = new window.FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64 = reader.result;

        sendAudioMessage({ type: "audio/webm", data: base64.split(",")[1] });
      };
    }
  };

  if (voiceNote) {
    return (
      <>
        {(recording || items.length > 0) && (
          <div className='text-center centerText'>
            {recording && (
              <InputBase
                className={classes.input}
                value={`Escuchando 👂🏻 ${
                  recMinutes / 10 < 1 ? "0" : ""
                }${recMinutes}:${recSeconds / 10 < 1 ? "0" : ""}${recSeconds}`}
                disabled
                inputProps={{ "aria-label": "jeje" }}
              />
            )}
            {!recording && items.length > 0 && (
              <InputBase
                className={classes.input}
                value={`Envíamos tu audio? 🤓  ${
                  recMinutes / 10 < 1 ? "0" : ""
                }${recMinutes}:${recSeconds / 10 < 1 ? "0" : ""}${recSeconds}`}
                disabled
                inputProps={{ "aria-label": "jeje" }}
              />
            )}
          </div>
        )}
        {(recording || items.length > 0) && (
          <Divider className={classes.divider} orientation='vertical' />
        )}

        <IconButton
          className={classes.iconButton}
          aria-label='directions'
          onClick={
            recording
              ? stopRecord
              : items.length > 0
              ? preSendAudioMessage
              : startRecord
          }
        >
          {recording || items.length === 0 ? (
            <KeyboardVoiceIcon
              style={
                !recording
                  ? { color: "hsl(346,76%,77%)" }
                  : { color: "hsl(346,76%,95%)" }
              }
            />
          ) : (
            <SendIcon style={{ color: "hsl(346,76%,77%)" }} />
          )}
        </IconButton>
      </>
    );
  }
  return <div className='VoiceRecorder'></div>;
}
