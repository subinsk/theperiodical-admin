"use client";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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
      style={{
        maxHeight: "300px",
        overflow: "auto",
      }}
      placeholder={placeholder}
      {...props}
    />
  );
};
