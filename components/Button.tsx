import React from "react";

interface Props extends React.HTMLProps<HTMLButtonElement> {
  outline?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<Props> = ({
  children,
  outline = false,
  className,
  type = "button",
  ...props
}) => {
  const shared = "py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline";
  const filled =
    "bg-purple-500 focus:bg-purple-600 hover:bg-purple-600 text-white";
  const outlined =
    "border border-purple-600 text-purple-900 hover:bg-purple-100";

  return (
    <button
      type={type}
      className={`${shared} ${className} ${outline ? outlined : filled}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
