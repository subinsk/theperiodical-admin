"use client";

import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

export const Editor = ({
  id,
  value,
  onChange,
  readOnly,
  placeholder,
  ...props
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  props?: any;
}): JSX.Element => {
  return (
    <ReactQuill
      id={id}
      theme="snow"
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      {...props}
    />
  );
};
