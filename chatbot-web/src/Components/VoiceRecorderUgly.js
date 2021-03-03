import React, { useState } from "react";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";
export default function VoiceRecorder() {
  const [data, setData] = useState({
    url: null,
    blob: null,
    chunks: null,
    duration: {
      h: null,
      m: null,
      s: null,
    },
  });

  const handleAudioStop = (d) => {
    console.log("stop", d);
    setData(d);
  };

  const handleAudioUpload = (file) => {
    console.log("upload", file);
  };
  const handleOnChange = (file, f) => {
    console.log("change", file);
  };

  const handleRest = () => {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: null,
        m: null,
        s: null,
      },
    };
    setData(reset);
  };
  return (
    <div className='VoiceRecorder'>
      <Recorder
        record={true}
        title={"New recording"}
        audioURL={data.url}
        handleAudioStop={(data) => handleAudioStop(data)}
        handleOnChange={(value) => handleOnChange(value, "firstname")}
        handleAudioUpload={(data) => handleAudioUpload(data)}
        handleRest={() => handleRest()}
      />
    </div>
  );
}
