import React from "react";
import { Button } from "antd";
import TextArea from 'antd/lib/input/TextArea';

import "./index.css";

const ButtonState = {
  success: "success",
  failed: "failed",
};

export function CompInForm(props) {
  const { context } = props;
  const [text, setText] = React.useState({ text: "" });

  return (
    <div>
      <p className="comp-in-form comp-in-form-text">{"test desc"}</p>
      <TextArea
        className="comp-in-form comp-in-form-textarea"
        placeholder="test input"
        disabled={(context && context.disabled) || false}
        onChange={(e) => {
          setText({ text: e.target.value });
        }}
        value={text.text}
      />
    </div>
  );
}

export function CompInTable(props) {
  const [state, setState] = React.useState({
    state: ButtonState.success,
  });

  return (
    <Button
      className="comp-in-table-button"
      onClick={() => {
        setState({
          state:
            state.state === ButtonState.success
              ? ButtonState.failed
              : ButtonState.success,
        });
      }}
      style={{
        color: state.state === ButtonState.success ? "#ca5732" : "#63a6eb",
      }}
    >
      test click
    </Button>
  );
}
