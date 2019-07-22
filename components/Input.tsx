import React from "react";

interface Props extends React.HTMLProps<HTMLInputElement> {
  id: string;
  label: string;
}
const Input: React.FC<Props> = ({ id, label, ...props }) => (
  <>
    <label
      className="block w-full text-left text-gray-700 text-sm font-bold mb-2"
      htmlFor={id}
    >
      {label}
    </label>
    <input
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      id={id}
      {...props}
    />
  </>
);

export default Input;
