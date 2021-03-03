import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import VoiceRecorder from "./VoiceRecorder";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function InputMessage(props) {
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioMessage, setAudioMessage] = useState(null);

  const classes = useStyles();

  return (
    <Paper
      component='form'
      className={classes.root}
      onSubmit={(evt) => {
        if (input.split("").length) {
          evt.preventDefault();
          props.finish(input);
        }
      }}
    >
      {!recording && !audioMessage && (
        <InputBase
          className={classes.input}
          onChange={(evt) => setInput(evt.target.value)}
          value={input}
          placeholder={props.input.placeholder}
          inputProps={{ "aria-label": props.input.placeholder }}
        />
      )}
      {!recording && !audioMessage && (
        <Divider className={classes.divider} orientation='vertical' />
      )}
      {input.length === 0 && !props.input.notAllowedToRecord ? (
        <VoiceRecorder
          voiceNote={true}
          classes={classes}
          recording={recording}
          setRecording={setRecording}
          setAudioMessage={setAudioMessage}
          sendAudioMessage={props.finish}
        />
      ) : (
        <IconButton
          disabled={input.split("").length <= 0}
          type='submit'
          className={classes.iconButton}
          aria-label='directions'
        >
          <SendIcon
            // color={!input.split("").length && "disabled"}
            style={
              input.split("").length > 0
                ? { color: "hsl(346,76%,77%)" }
                : { color: "hsl(346,76%,95%)" }
            }
          />
        </IconButton>
      )}
    </Paper>
  );
}
