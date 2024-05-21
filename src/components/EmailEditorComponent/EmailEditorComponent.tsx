import SunEditor from "suneditor-react";
import { IProps } from "./types";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import React from "react";


const EmailEditorComponent = React.memo(({content, onChange}: IProps) => {
  return (
    <SunEditor
      setDefaultStyle="font-size: 16px; max-width: 1000px; max-height: 400px; font-family:'David Libre';"
      lang="en"
      onDrop={(e) => console.log(e)}
      height="auto"
      setContents={content}
      autoFocus={true}
      onChange={(val: string) => onChange(val)}
      setOptions={{
        rtl: true,
        buttonList: [
          ["undo", "redo"],
          ["formatBlock", "bold", "italic" ,"fontSize", "lineHeight" , "fontColor", "hiliteColor" , "underline", "strike", "list", "align",  "font", "fullScreen", "indent", "outdent", "preview", "removeFormat",],
          ["link"],
        ],
        font: ['Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Bellefair', 'David Libre'],
      }}
    />
  );
})

export default EmailEditorComponent;
